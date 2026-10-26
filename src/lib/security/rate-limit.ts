interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Sliding window in-memory rate limiter.
 * @param identifier Unique key (e.g. user IP, user ID, endpoint)
 * @param maxRequests Maximum allowed requests in the time window
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  identifier: string,
  maxRequests = 20,
  windowMs = 60 * 1000
): { success: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier) || { timestamps: [] };

  // Filter timestamps within current window
  const recent = record.timestamps.filter((ts) => now - ts < windowMs);

  if (recent.length >= maxRequests) {
    const oldest = recent[0];
    const resetMs = Math.max(0, windowMs - (now - oldest));
    return { success: false, remaining: 0, resetMs };
  }

  recent.push(now);
  rateLimitStore.set(identifier, { timestamps: recent });

  // Periodically clean up old keys if map exceeds 5000 items
  if (rateLimitStore.size > 5000) {
    for (const [key, val] of rateLimitStore.entries()) {
      const active = val.timestamps.filter((ts) => now - ts < windowMs);
      if (active.length === 0) {
        rateLimitStore.delete(key);
      } else {
        rateLimitStore.set(key, { timestamps: active });
      }
    }
  }

  return {
    success: true,
    remaining: maxRequests - recent.length,
    resetMs: windowMs,
  };
}
