type RateLimitOptions = {
  maximum: number;
  windowMs: number;
};

const buckets = new Map<string, Map<string, number[]>>();

export function consumeRateLimit(
  namespace: string,
  key: string,
  now: number,
  options: RateLimitOptions
) {
  const bucket = buckets.get(namespace) ?? new Map<string, number[]>();
  buckets.set(namespace, bucket);
  const recent = (bucket.get(key) ?? []).filter(
    (timestamp) => now - timestamp < options.windowMs
  );
  if (recent.length >= options.maximum) return false;
  bucket.set(key, [...recent, now]);
  return true;
}

export function getRequestClientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}
