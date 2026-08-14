// Performance optimization: API request caching
class APICache {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  get(key: string): unknown | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }

  set(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const apiCache = new APICache();

export async function optimizedFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const cacheKey = url + JSON.stringify(options);
  const cached = apiCache.get(cacheKey);

  if (cached) {
    return cached as T;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText || "Request failed");
  }

  const data = (await response.json()) as T;
  apiCache.set(cacheKey, data);

  return data;
}
