
import { ContentItem, Report, Project } from '../types';

class DatabaseService {
  private dbName = 'OmniContentDB_v2';
  private version = 6; 

  constructor() {
    if (typeof window !== 'undefined') {
      this.initMongo();
    }
  }

  private initMongo(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined') return Promise.resolve(null);
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('content')) db.createObjectStore('content', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('reports')) db.createObjectStore('reports', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('projects')) db.createObjectStore('projects', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('users')) db.createObjectStore('users', { keyPath: 'username' });
        if (!db.objectStoreNames.contains('cfps')) db.createObjectStore('cfps', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('sessions')) db.createObjectStore('sessions', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('pending_sync')) db.createObjectStore('pending_sync', { keyPath: 'id', autoIncrement: true });
      };
      request.onsuccess = (e: any) => resolve(e.target.result);
      request.onerror = (e) => reject(e);
    });
  }

  async saveToMongo(store: string, data: any[]): Promise<void> {
    if (typeof window === 'undefined') return;
    const db = await this.initMongo();
    if (!db) return;
    const tx = db.transaction(store, 'readwrite');
    const os = tx.objectStore(store);
    data.forEach(item => os.put(item));
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve();
    });
  }

  async addToSyncQueue(data: any[]): Promise<void> {
    if (typeof window === 'undefined') return;
    const db = await this.initMongo();
    if (!db) return;
    const tx = db.transaction('pending_sync', 'readwrite');
    const os = tx.objectStore('pending_sync');
    data.forEach(item => os.put({ ...item, timestamp: Date.now() }));
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve();
    });
  }

  async getSyncQueue(): Promise<any[]> {
    if (typeof window === 'undefined') return [];
    const db = await this.initMongo();
    if (!db) return [];
    return new Promise((resolve) => {
      const tx = db.transaction('pending_sync', 'readonly');
      const os = tx.objectStore('pending_sync');
      const request = os.getAll();
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async clearSyncQueue(): Promise<void> {
    if (typeof window === 'undefined') return;
    const db = await this.initMongo();
    if (!db) return;
    const tx = db.transaction('pending_sync', 'readwrite');
    const os = tx.objectStore('pending_sync');
    os.clear();
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve();
    });
  }

  async getFromMongo(store: string): Promise<any[]> {
    if (typeof window === 'undefined') return [];
    const db = await this.initMongo();
    if (!db) return [];
    return new Promise((resolve) => {
      const tx = db.transaction(store, 'readonly');
      const os = tx.objectStore(store);
      const request = os.getAll();
      request.onsuccess = () => {
        const result = request.result || [];
        if (store === 'projects' && result.length === 0) {
          const defaultProj = { 
            id: 'proj-local', 
            name: 'Local Default Workspace', 
            description: 'Offline fallback environment', 
            createdAt: new Date().toISOString() 
          };
          this.saveToMongo('projects', [defaultProj]);
          resolve([defaultProj]);
        } else {
          resolve(result);
        }
      };
      request.onerror = () => resolve([]);
    });
  }

  invalidateCache(store: string) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`pg_cache_${store}`);
    }
  }
}

export const dbService = new DatabaseService();
