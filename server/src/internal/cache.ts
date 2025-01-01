import NodeCache from "node-cache";
import { APP_ENV } from "../config/app-config";

export interface Cache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  has(key: string): Promise<boolean>;
  flush(): Promise<void>;
  quit(): Promise<void>;
}

export class InMemoryCache implements Cache {
  private readonly cache: NodeCache;
  constructor() {
    this.cache = new NodeCache({
      stdTTL: 60 * 60 * 24, // 1 day
    });
  }

  public async get<T>(key: string): Promise<T | null> {
    return this.cache.get(key) as T;
  }

  public async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (ttl === undefined) {
      ttl = this.cache.options.stdTTL ?? 60 * 5; // Default to 5 minutes
    }

    this.cache.set(key, value, ttl);
  }

  public async del(key: string): Promise<void> {
    this.cache.del(key);
  }

  public async has(key: string): Promise<boolean> {
    return this.cache.has(key);
  }

  public async flush(): Promise<void> {
    this.cache.flushAll();
  }

  public async quit(): Promise<void> {
    this.cache.close();
  }
}

export function getCacheFactory(): Cache | undefined {
  if (APP_ENV !== "production") {
    return new InMemoryCache();
  }
}
