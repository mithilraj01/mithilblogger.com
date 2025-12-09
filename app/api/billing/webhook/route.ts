import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { verifyWebhookSignature } from '@/lib/billing';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Subscription from '@/models/Subscription';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const event = verifyWebhookSignature(body, signature);

    await dbConnect();

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id || session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (!userId || !plan) {
          console.error('Missing userId or plan in session metadata');
          break;
        }

        // Update user's subscription
        await User.findByIdAndUpdate(userId, {
          subscriptionPlan: plan,
          subscriptionStatus: 'active',
        });

        // Create or update subscription record
        await Subscription.findOneAndUpdate(
          { userId },
          {
            userId,
            plan,
            status: 'active',
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
          { upsert: true, new: true }
        );

        console.log(`Subscription activated for user ${userId}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeSubscriptionId = subscription.id;

        const dbSubscription = await Subscription.findOne({ stripeSubscriptionId });
        
        if (dbSubscription) {
          const status = subscription.cancel_at_period_end 
            ? 'cancelled' 
            : subscription.status === 'active' 
              ? 'active' 
              : 'none';

          await Subscription.findByIdAndUpdate(dbSubscription._id, {
            status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          });

          await User.findByIdAndUpdate(dbSubscription.userId, {
            subscriptionStatus: status,
          });

          console.log(`Subscription updated for subscription ${stripeSubscriptionId}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeSubscriptionId = subscription.id;

        const dbSubscription = await Subscription.findOne({ stripeSubscriptionId });
        
        if (dbSubscription) {
          await Subscription.findByIdAndUpdate(dbSubscription._id, {
            status: 'cancelled',
          });

          await User.findByIdAndUpdate(dbSubscription.userId, {
            subscriptionStatus: 'cancelled',
            subscriptionPlan: null,
          });

          console.log(`Subscription cancelled for subscription ${stripeSubscriptionId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 400 }
    );
  }
}
