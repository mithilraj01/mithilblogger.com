// Simple in-memory rate limiter for API routes
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Rate limit middleware
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param limit - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 */
export function rateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60 * 1000 // 1 minute default
): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const entry = store[identifier];

  // Clean up old entries periodically
  if (Math.random() < 0.01) {
    cleanupStore(now);
  }

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired one
    store[identifier] = {
      count: 1,
      resetTime: now + windowMs,
    };

    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: store[identifier].resetTime,
    };
  }

  // Increment existing entry
  entry.count++;

  if (entry.count > limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: entry.resetTime,
    };
  }

  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    reset: entry.resetTime,
  };
}

/**
 * Clean up expired entries from store
 */
function cleanupStore(now: number): void {
  const keys = Object.keys(store);
  for (const key of keys) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}

/**
 * Get rate limit headers
 */
export function getRateLimitHeaders(result: {
  limit: number;
  remaining: number;
  reset: number;
}): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
  };
}
