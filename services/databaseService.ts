
import { ContentItem, BrightEdgePage, YouTubeStats, User, WidgetConfig } from '../types';

/**
 * OmniDB Service
 * Simulates a full-stack environment:
 * - MongoDB: Persistent Document Store (via IndexedDB)
 * - PostgreSQL: High-speed Relational Cache (via Memory + LocalStorage)
 */
class DatabaseService {
  private dbName = 'OmniContentDB';
  private version = 2; // Incremented for new store
  private cacheTTL = 60000; // 1 minute cache

  constructor() {
    this.initMongo();
  }

  // --- MONGODB LAYER (Persistent IndexedDB) ---
  private initMongo(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('content')) db.createObjectStore('content', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('seo')) db.createObjectStore('seo', { keyPath: 'url' });
        if (!db.objectStoreNames.contains('users')) db.createObjectStore('users', { keyPath: 'username' });
        if (!db.objectStoreNames.contains('preferences')) db.createObjectStore('preferences', { keyPath: 'key' });
      };
      request.onsuccess = (e: any) => resolve(e.target.result);
      request.onerror = (e) => reject(e);
    });
  }

  async saveToMongo(store: string, data: any[]): Promise<void> {
    const db = await this.initMongo();
    const tx = db.transaction(store, 'readwrite');
    const os = tx.objectStore(store);
    data.forEach(item => os.put(item));
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve();
    });
  }

  async savePreference(key: string, value: any): Promise<void> {
    const db = await this.initMongo();
    const tx = db.transaction('preferences', 'readwrite');
    tx.objectStore('preferences').put({ key, value });
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve();
    });
  }

  async getPreference(key: string): Promise<any | null> {
    const db = await this.initMongo();
    return new Promise((resolve) => {
      const tx = db.transaction('preferences', 'readonly');
      const request = tx.objectStore('preferences').get(key);
      request.onsuccess = () => resolve(request.result?.value || null);
    });
  }

  async getFromMongo(store: string): Promise<any[]> {
    const db = await this.initMongo();
    return new Promise((resolve) => {
      const tx = db.transaction(store, 'readonly');
      const os = tx.objectStore(store);
      const request = os.getAll();
      request.onsuccess = () => resolve(request.result);
    });
  }

  // --- POSTGRESQL LAYER (Fast Cache) ---
  private getCacheKey(store: string) { return `pg_cache_${store}`; }

  async getCachedData(store: string): Promise<{ data: any[], source: 'postgres' | 'mongo' }> {
    const cached = localStorage.getItem(this.getCacheKey(store));
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < this.cacheTTL) {
        console.log(`[PostgreSQL Cache] Hit for ${store}`);
        return { data, source: 'postgres' };
      }
    }

    // Cache Miss -> Hit MongoDB
    console.log(`[MongoDB] Fetching ${store} (Cache Miss)`);
    const data = await this.getFromMongo(store);
    this.setCache(store, data);
    return { data, source: 'mongo' };
  }

  private setCache(store: string, data: any[]) {
    localStorage.setItem(this.getCacheKey(store), JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  }

  invalidateCache(store: string) {
    localStorage.removeItem(this.getCacheKey(store));
  }
}

export const dbService = new DatabaseService();
