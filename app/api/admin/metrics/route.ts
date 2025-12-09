import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/session';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Subscription from '@/models/Subscription';
import UsageLog from '@/models/UsageLog';
import { PLANS } from '@/config/plans';

export async function GET() {
  try {
    await requireAdmin();

    await dbConnect();

    // Get total user count
    const userCount = await User.countDocuments();

    // Get active subscriptions
    const activeSubscriptions = await Subscription.countDocuments({
      status: 'active',
    });

    // Calculate estimated MRR
    const subscriptions = await Subscription.find({ status: 'active' });
    let estimatedMRR = 0;
    subscriptions.forEach((sub) => {
      const plan = PLANS[sub.plan];
      if (plan) {
        estimatedMRR += plan.price;
      }
    });

    // Get total AI requests (current month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const totalAIRequests = await UsageLog.countDocuments({
      timestamp: { $gte: startOfMonth },
    });

    // Get top users by usage
    const topUsersAggregation = await UsageLog.aggregate([
      {
        $match: {
          timestamp: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: '$userId',
          usage: { $sum: 1 },
          totalTokens: { $sum: '$tokenCost' },
        },
      },
      {
        $sort: { usage: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Enrich with user email
    const topUsers = await Promise.all(
      topUsersAggregation.map(async (item) => {
        const user = await User.findById(item._id).select('email');
        return {
          userId: item._id,
          email: user?.email || 'Unknown',
          usage: item.usage,
          totalTokens: item.totalTokens,
        };
      })
    );

    return NextResponse.json({
      userCount,
      activeSubscriptions,
      estimatedMRR,
      totalAIRequests,
      topUsersByUsage: topUsers,
    });
  } catch (error: any) {
    console.error('Admin metrics error:', error);
    
    if (error.message === 'Unauthorized' || error.message.includes('Admin')) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch admin metrics' },
      { status: 500 }
    );
  }
}
