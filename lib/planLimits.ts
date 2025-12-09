import { PlanType } from '@/types';
import { PLANS } from '@/config/plans';
import UsageLog from '@/models/UsageLog';

/**
 * Check if user can perform an action based on their plan limits
 */
export async function checkPlanLimit(
  userId: string,
  plan: PlanType | null,
  actionType: 'aiRequests' | 'contentOptimizations' | 'visibilityScores' | 'competitorScans'
): Promise<{ allowed: boolean; current: number; limit: number; message?: string }> {
  if (!plan) {
    return {
      allowed: false,
      current: 0,
      limit: 0,
      message: 'No active subscription plan',
    };
  }

  const planConfig = PLANS[plan];
  if (!planConfig) {
    return {
      allowed: false,
      current: 0,
      limit: 0,
      message: 'Invalid plan',
    };
  }

  const limit = planConfig.limits[actionType];

  // For agency plan (unlimited), always allow
  if (limit >= 999999) {
    return {
      allowed: true,
      current: 0,
      limit,
    };
  }

  // Get current month's usage
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const usageCount = await UsageLog.countDocuments({
    userId,
    action: actionType,
    timestamp: { $gte: startOfMonth },
  });

  const allowed = usageCount < limit;

  return {
    allowed,
    current: usageCount,
    limit,
    message: allowed ? undefined : `Monthly ${actionType} limit reached. Please upgrade your plan.`,
  };
}

/**
 * Log usage for tracking and billing
 */
export async function logUsage(
  userId: string,
  action: string,
  tokenCost: number = 0
): Promise<void> {
  try {
    await UsageLog.create({
      userId,
      action,
      tokenCost,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error logging usage:', error);
    // Don't throw - logging failure shouldn't break the main flow
  }
}

/**
 * Get user's current month usage summary
 */
export async function getUserUsageSummary(userId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const usageLogs = await UsageLog.find({
    userId,
    timestamp: { $gte: startOfMonth },
  });

  const summary = {
    aiRequests: 0,
    contentOptimizations: 0,
    visibilityScores: 0,
    competitorScans: 0,
    totalTokens: 0,
  };

  usageLogs.forEach((log) => {
    summary.totalTokens += log.tokenCost;
    
    if (log.action === 'aiRequests' || log.action === 'geo_optimize') {
      summary.aiRequests++;
      summary.contentOptimizations++;
    } else if (log.action === 'visibility_score') {
      summary.visibilityScores++;
    } else if (log.action === 'competitor_scan') {
      summary.competitorScans++;
    }
  });

  return summary;
}
