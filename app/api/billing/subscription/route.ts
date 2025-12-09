import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import dbConnect from '@/lib/db';
import Subscription from '@/models/Subscription';

export async function GET() {
  try {
    const user = await requireAuth();

    await dbConnect();

    const subscription = await Subscription.findOne({ userId: user.id });

    if (!subscription) {
      return NextResponse.json({
        plan: user.subscriptionPlan,
        status: user.subscriptionStatus,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      });
    }

    return NextResponse.json({
      plan: subscription.plan,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: false, // Can be enhanced with Stripe API call
    });
  } catch (error: any) {
    console.error('Get subscription error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get subscription' },
      { status: 500 }
    );
  }
}
