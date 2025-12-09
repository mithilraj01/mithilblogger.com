import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Subscription from '@/models/Subscription';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get full user details
    const user = await User.findById(currentUser.id).select('-passwordHash');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get subscription details if exists
    let subscription = null;
    if (user.subscriptionPlan) {
      subscription = await Subscription.findOne({ userId: user._id.toString() });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionStatus: user.subscriptionStatus,
        createdAt: user.createdAt,
      },
      subscription: subscription ? {
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd,
      } : null,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
