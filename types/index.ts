import { CONTENT_TYPES, CMS_TYPES, AI_MODELS, SUBSCRIPTION_STATUS, USER_ROLES } from '@/config/constants';

export type ContentType = typeof CONTENT_TYPES[number];
export type CMSType = typeof CMS_TYPES[number];
export type AIModel = typeof AI_MODELS[keyof typeof AI_MODELS];
export type SubscriptionStatus = typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type PlanType = 'starter' | 'growth' | 'agency';

// User Types
export interface IUser {
  _id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  subscriptionPlan: PlanType | null;
  subscriptionStatus: SubscriptionStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Website Types
export interface IWebsite {
  _id: string;
  userId: string;
  domain: string;
  cmsType: CMSType;
  cmsConfig?: {
    apiUrl?: string;
    apiKey?: string;
    webhookUrl?: string;
  };
  createdAt: Date;
}

// Content Types
export interface IContent {
  _id: string;
  websiteId: string;
  url?: string;
  rawText: string;
  contentType: ContentType;
  createdAt: Date;
}

// Optimization Types
export interface IOptimization {
  _id: string;
  contentId: string;
  optimizedText: string;
  entities: string[];
  citations: string[];
  suggestedFAQs?: Array<{ question: string; answer: string }>;
  suggestedHeadings?: string[];
  modelUsed: AIModel;
  createdAt: Date;
}

// Visibility Score Types
export interface IVisibilityScore {
  _id: string;
  contentId: string;
  chatgptScore: number;
  geminiScore: number;
  rankingProbability: number;
  createdAt: Date;
}

// Usage Log Types
export interface IUsageLog {
  _id: string;
  userId: string;
  action: string;
  tokenCost: number;
  timestamp: Date;
}

// Subscription Types
export interface ISubscription {
  _id: string;
  userId: string;
  plan: PlanType;
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// API Request/Response Types

// GEO API
export interface GEOOptimizeRequest {
  text?: string;
  url?: string;
  intent?: string;
  targetAudience?: string;
  contentType?: ContentType;
}

export interface GEOOptimizeResponse {
  optimizedText: string;
  entities: string[];
  suggestedFAQs: Array<{ question: string; answer: string }>;
  suggestedHeadings: string[];
  originalLength: number;
  optimizedLength: number;
}

// AEO API
export interface AEOGenerateRequest {
  query: string;
  industry?: string;
}

export interface AEOGenerateResponse {
  directAnswer: string;
  longAnswer: string;
  voiceAnswer: string;
  faq: Array<{ question: string; answer: string }>;
}

// Visibility Score API
export interface VisibilityScoreRequest {
  contentId: string;
}

export interface VisibilityScoreResponse {
  contentId: string;
  chatgptScore: number;
  geminiScore: number;
  rankingProbability: number;
  insights: string[];
}

// Competitor API
export interface CompetitorScanRequest {
  competitorUrl: string;
}

export interface CompetitorScanResponse {
  entities: string[];
  summary: string;
  improvedVersion: string;
  keywords: string[];
}

// Publish API
export interface PublishRequest {
  websiteId: string;
  contentId: string;
  target: 'wordpress' | 'webhook';
  webhookUrl?: string;
  publishOptions?: {
    title?: string;
    status?: 'draft' | 'publish';
  };
}

export interface PublishResponse {
  success: boolean;
  publishedUrl?: string;
  message: string;
}

// Billing API
export interface CreateCheckoutSessionRequest {
  plan: PlanType;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface SubscriptionInfo {
  plan: PlanType | null;
  status: SubscriptionStatus;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
}

// Admin API
export interface AdminMetrics {
  userCount: number;
  activeSubscriptions: number;
  estimatedMRR: number;
  totalAIRequests: number;
  topUsersByUsage: Array<{
    userId: string;
    email: string;
    usage: number;
  }>;
}
