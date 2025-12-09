export const APP_NAME = 'GEOFORGE Enterprise';
export const APP_DESCRIPTION = 'AI Search Visibility & GEO/AEO Optimization Platform';

export const ROUTES = {
  HOME: '/',
  PRICING: '/pricing',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  GEO: '/dashboard/geo',
  AEO: '/dashboard/aeo',
  SCORE: '/dashboard/score',
  COMPETITOR: '/dashboard/competitor',
  SETTINGS: '/dashboard/settings',
  ADMIN: '/admin',
} as const;

export const API_ROUTES = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    ME: '/api/auth/me',
  },
  GEO: {
    OPTIMIZE: '/api/geo/optimize',
  },
  AEO: {
    GENERATE: '/api/aeo/generate',
  },
  SCORE: {
    TEST: '/api/score/test',
  },
  COMPETITOR: {
    SCAN: '/api/competitor/scan',
  },
  PUBLISH: {
    PUSH: '/api/publish/push',
  },
  BILLING: {
    CREATE_CHECKOUT: '/api/billing/create-checkout-session',
    WEBHOOK: '/api/billing/webhook',
    SUBSCRIPTION: '/api/billing/subscription',
  },
  ADMIN: {
    METRICS: '/api/admin/metrics',
  },
} as const;

export const CONTENT_TYPES = [
  'blog',
  'product',
  'service',
  'landing',
] as const;

export const CMS_TYPES = [
  'wordpress',
  'webflow',
  'shopify',
  'custom',
] as const;

export const AI_MODELS = {
  OPENAI: 'openai',
  GEMINI: 'gemini',
} as const;

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  TRIAL: 'trial',
  NONE: 'none',
} as const;

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;
