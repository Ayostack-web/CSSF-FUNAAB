import { NextResponse } from 'next/server';

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  const realIp = request.headers.get('x-real-ip');
  return realIp || 'unknown';
}

function cleanupExpiredEntries(now: number) {
  if (rateLimitStore.size < 1000) return;

  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

export function getRateLimitErrorResponse(
  request: Request,
  routeKey: string,
  limit = 30,
  windowMs = 60_000
) {
  const now = Date.now();
  cleanupExpiredEntries(now);

  const ip = getClientIp(request);
  const key = `${routeKey}:${ip}`;

  const currentEntry = rateLimitStore.get(key);
  if (!currentEntry || currentEntry.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  currentEntry.count += 1;
  rateLimitStore.set(key, currentEntry);

  if (currentEntry.count <= limit) {
    return null;
  }

  const retryAfterSeconds = Math.max(1, Math.ceil((currentEntry.resetAt - now) / 1000));
  return NextResponse.json(
    { error: 'Too many requests. Please try again shortly.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSeconds),
      },
    }
  );
}
