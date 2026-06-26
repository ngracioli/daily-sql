import { NextRequest } from "next/server";
import Redis from "ioredis";

interface RateLimitRecord {
  timestamps: number[];
}

const localCache = new Map<string, RateLimitRecord>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 10; // max 10 attempts per minute

export interface RateLimitResult {
  isAllowed: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

// Next.js hot-reloading workaround: preserve Redis connection in global scope
const globalForRedis = global as unknown as { redis?: Redis };
let redisClient: Redis | null = null;

if (process.env.REDIS_URL) {
  if (!globalForRedis.redis) {
    try {
      globalForRedis.redis = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 1,
        connectTimeout: 1000, // fail fast to fallback in 1s
      });
      
      globalForRedis.redis.on("error", (err) => {
        console.warn("Redis connection error, falling back to in-memory rate limiting:", err.message);
      });
    } catch (err: any) {
      console.warn("Failed to initialize Redis, falling back to in-memory rate limiting:", err.message);
    }
  }
  redisClient = globalForRedis.redis || null;
}

// Periodic cleanup interval for the in-memory fallback cache to prevent memory leaks
if (typeof window === "undefined" && typeof global !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of localCache.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < WINDOW_MS);
      if (record.timestamps.length === 0) {
        localCache.delete(ip);
      }
    }
  }, WINDOW_MS).unref(); // unref so Jest tests exit cleanly without hanging
}

/**
 * Checks rate limit in local memory (sliding window log fallback).
 */
function checkInMemoryLimit(ip: string, now: number): RateLimitResult {
  const record = localCache.get(ip) || { timestamps: [] };
  
  record.timestamps = record.timestamps.filter((t) => now - t < WINDOW_MS);
  const currentCount = record.timestamps.length;
  
  if (currentCount >= MAX_ATTEMPTS) {
    const oldestTimestamp = record.timestamps[0];
    const resetMs = oldestTimestamp + WINDOW_MS - now;
    return {
      isAllowed: false,
      limit: MAX_ATTEMPTS,
      remaining: 0,
      resetMs: resetMs > 0 ? resetMs : 0,
    };
  }
  
  record.timestamps.push(now);
  localCache.set(ip, record);
  
  return {
    isAllowed: true,
    limit: MAX_ATTEMPTS,
    remaining: MAX_ATTEMPTS - record.timestamps.length,
    resetMs: WINDOW_MS,
  };
}

// Atomic Lua script for sliding window rate limiting in Redis
const SLIDING_WINDOW_LUA = `
  local key = KEYS[1]
  local now = tonumber(ARGV[1])
  local window = tonumber(ARGV[2])
  local limit = tonumber(ARGV[3])
  local member = ARGV[4]
  
  local clearBefore = now - window
  redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)
  
  local currentCount = redis.call('ZCARD', key)
  local isAllowed = 0
  local remaining = 0
  local resetMs = 0
  
  if currentCount < limit then
    isAllowed = 1
    redis.call('ZADD', key, now, member)
    redis.call('EXPIRE', key, math.ceil(window / 1000))
    remaining = limit - (currentCount + 1)
  else
    isAllowed = 0
    remaining = 0
    local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
    if #oldest > 0 then
      local oldestScore = tonumber(oldest[2])
      resetMs = oldestScore + window - now
    else
      resetMs = window
    end
  end
  
  return {isAllowed, remaining, math.max(0, math.ceil(resetMs))}
`;

/**
 * Checks if the client IP address from a request has exceeded the allowed execution rate.
 */
export async function checkRateLimit(req: NextRequest): Promise<RateLimitResult> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
             req.headers.get("x-real-ip") || 
             "127.0.0.1";
  
  const now = Date.now();
  
  if (redisClient && redisClient.status === "ready") {
    try {
      const key = `rl:v1:attempt:${ip}`;
      const evalResult = await redisClient.eval(
        SLIDING_WINDOW_LUA,
        1,
        key,
        String(now),
        String(WINDOW_MS),
        String(MAX_ATTEMPTS),
        `${now}-${Math.random()}`
      );
      
      if (Array.isArray(evalResult)) {
        const [isAllowedVal, remaining, resetMs] = evalResult as [number, number, number];
        return {
          isAllowed: isAllowedVal === 1,
          limit: MAX_ATTEMPTS,
          remaining,
          resetMs,
        };
      }
    } catch (err: any) {
      console.warn("Redis sliding window evaluation failed, falling back to memory:", err.message);
    }
  }
  
  return checkInMemoryLimit(ip, now);
}
