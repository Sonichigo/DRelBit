
import { ContentItem, Report, ConnectionLog, Project } from '../types';

class DatabaseService {
  private dbName = 'ContentDB_v2';
  private version = 4; // Incremented version
  private cacheTTL = 30000;

  constructor() {
    this.initMongo();
  }

  private initMongo(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('content')) db.createObjectStore('content', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('reports')) db.createObjectStore('reports', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('projects')) db.createObjectStore('projects', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('users')) db.createObjectStore('users', { keyPath: 'username' });
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

  async getFromMongo(store: string): Promise<any[]> {
    const db = await this.initMongo();
    return new Promise((resolve) => {
      const tx = db.transaction(store, 'readonly');
      const os = tx.objectStore(store);
      const request = os.getAll();
      request.onsuccess = () => {
        const result = request.result || [];
        // Inject default project if empty
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
    });
  }

  invalidateCache(store: string) {
    localStorage.removeItem(`pg_cache_${store}`);
  }
}

export const dbService = new DatabaseService();
