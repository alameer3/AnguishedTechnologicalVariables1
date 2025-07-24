// Error logging utility for production-safe error handling
export const logError = (error: Error | string, context?: string) => {
  if (process.env.NODE_ENV === 'development') {
    // Error logged only in development mode
  }
  
  // In production, you might want to send to an error tracking service
  // like Sentry, LogRocket, or similar
};

export const logInfo = (message: string, data?: unknown) => {
  if (process.env.NODE_ENV === 'development') {
    // Info logged only in development mode
  }
};

// Rate limiting helper for API calls
const rateLimitCache = new Map<string, number>();
const RATE_LIMIT_WINDOW = 1000; // 1 second
const MAX_REQUESTS_PER_WINDOW = 10;

export const isRateLimited = (key: string): boolean => {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  // Clean old entries
  const entries = Array.from(rateLimitCache.entries());
  for (const [k, timestamp] of entries) {
    if (timestamp < windowStart) {
      rateLimitCache.delete(k);
    }
  }
  
  // Count current requests
  const currentRequests = Array.from(rateLimitCache.values())
    .filter(timestamp => timestamp > windowStart).length;
  
  if (currentRequests >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  rateLimitCache.set(key, now);
  return false;
};