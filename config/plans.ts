export type PlanType = 'starter' | 'growth' | 'agency';

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  priceId?: string;
  interval: 'month';
  features: string[];
  limits: {
    aiRequests: number;
    websites: number;
    contentOptimizations: number;
    visibilityScores: number;
    competitorScans: number;
  };
  popular?: boolean;
}

export const PLANS: Record<PlanType, Plan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 49,
    interval: 'month',
    features: [
      '30 AI optimizations per month',
      '1 website',
      'GEO content optimizer',
      'AEO answer engine',
      'AI visibility scoring',
      'Basic competitor analysis',
      'Email support',
    ],
    limits: {
      aiRequests: 30,
      websites: 1,
      contentOptimizations: 30,
      visibilityScores: 30,
      competitorScans: 10,
    },
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    price: 199,
    interval: 'month',
    popular: true,
    features: [
      '200 AI optimizations per month',
      '5 websites',
      'GEO content optimizer',
      'AEO answer engine',
      'AI visibility scoring',
      'Advanced competitor analysis',
      'Auto-publish to WordPress',
      'Priority support',
      'API access',
    ],
    limits: {
      aiRequests: 200,
      websites: 5,
      contentOptimizations: 200,
      visibilityScores: 200,
      competitorScans: 50,
    },
  },
  agency: {
    id: 'agency',
    name: 'Agency',
    price: 499,
    interval: 'month',
    features: [
      'Unlimited AI optimizations',
      'Unlimited websites',
      'GEO content optimizer',
      'AEO answer engine',
      'AI visibility scoring',
      'Full competitor analysis',
      'Auto-publish to all platforms',
      'White-label options',
      'Dedicated account manager',
      'API access',
      'Custom integrations',
    ],
    limits: {
      aiRequests: 999999,
      websites: 999999,
      contentOptimizations: 999999,
      visibilityScores: 999999,
      competitorScans: 999999,
    },
  },
};

export function getPlanById(planId: PlanType): Plan | undefined {
  return PLANS[planId];
}

export function canPerformAction(
  plan: PlanType | null,
  currentUsage: number,
  actionType: keyof Plan['limits']
): boolean {
  if (!plan) return false;
  const planConfig = PLANS[plan];
  if (!planConfig) return false;
  return currentUsage < planConfig.limits[actionType];
}
