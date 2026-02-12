
import { dbService } from './databaseService';
import { Connector, ContentItem } from '../types';

class ConnectorService {
  private storageKey = 'omni_connectors';

  getConnectors(): Connector[] {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) return JSON.parse(saved);
    return [
      { id: 'gsc-primary', name: 'Google Search Console', provider: 'google', status: 'disconnected', icon: 'gsc' },
      { id: 'ga4-main', name: 'Google Analytics 4', provider: 'google', status: 'disconnected', icon: 'ga4' },
      { id: 'be-enterprise', name: 'BrightEdge S2S', provider: 'brightedge', status: 'disconnected', icon: 'be' },
      { id: 'gh-repos', name: 'GitHub Developer API', provider: 'github', status: 'connected', lastSync: '2025-01-29T10:00:00Z', icon: 'gh' }
    ];
  }

  async connect(id: string): Promise<void> {
    // Simulate OAuth Popup
    console.log(`Initiating OAuth for ${id}...`);
    await new Promise(r => setTimeout(r, 2000));
    
    const connectors = this.getConnectors();
    const updated = connectors.map(c => c.id === id ? { ...c, status: 'connected' as const, lastSync: new Date().toISOString() } : c);
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  async disconnect(id: string): Promise<void> {
    const connectors = this.getConnectors();
    const updated = connectors.map(c => c.id === id ? { ...c, status: 'disconnected' as const } : c);
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  async syncData(id: string): Promise<void> {
    const connector = this.getConnectors().find(c => c.id === id);
    if (!connector || connector.status !== 'connected') return;

    // Simulate API Payload Fetching
    console.log(`Syncing data from ${connector.name} API...`);
    await new Promise(r => setTimeout(r, 3000));

    // Mock incoming data from API
    const apiData: ContentItem[] = [
      { 
        id: `api-${Date.now()}`, 
        date: new Date().toISOString().split('T')[0], 
        platform: id.includes('gsc') ? 'GSC' : 'GA4', 
        type: 'API_FETCH', 
        author: 'System Bot', 
        description: `Automated sync from ${connector.name}`, 
        impressions: Math.floor(Math.random() * 10000), 
        views: Math.floor(Math.random() * 2000), 
        engagement: Math.floor(Math.random() * 500) 
      }
    ];

    await dbService.saveToMongo('content', apiData);
    dbService.invalidateCache('content');
    
    // Update last sync time
    const connectors = this.getConnectors();
    const updated = connectors.map(c => c.id === id ? { ...c, lastSync: new Date().toISOString() } : c);
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }
}

export const connectorService = new ConnectorService();
