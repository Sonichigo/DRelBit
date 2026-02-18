
import { Connector, ContentItem } from '../types';

class ConnectorService {
  private storageKey = 'omni_connectors';

  getConnectors(): Connector[] {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) return JSON.parse(saved);
    const defaultConnectors: Connector[] = [
      { id: 'gsc-primary', name: 'Google Search Console', provider: 'google', status: 'disconnected', icon: 'gsc' },
      { id: 'ga4-main', name: 'Google Analytics 4', provider: 'google', status: 'disconnected', icon: 'ga4' },
      { id: 'be-enterprise', name: 'BrightEdge S2S', provider: 'brightedge', status: 'disconnected', icon: 'be' },
      { id: 'gh-repos', name: 'GitHub Developer API', provider: 'github', status: 'connected', lastSync: '2025-01-29T10:00:00Z', icon: 'gh' }
    ];
    localStorage.setItem(this.storageKey, JSON.stringify(defaultConnectors));
    return defaultConnectors;
  }

  async connect(id: string): Promise<void> {
    // In a real OAuth flow, this would redirect to Google.
    // Here we simulate the successful auth state.
    console.log(`Initiating OAuth handshake for ${id}...`);
    await new Promise(r => setTimeout(r, 1000));
    
    const connectors = this.getConnectors();
    const updated = connectors.map(c => c.id === id ? { ...c, status: 'connected' as const, lastSync: new Date().toISOString() } : c);
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  async syncData(id: string, projectId: string): Promise<{ count: number }> {
    const response = await fetch('/api/connectors/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ connectorId: id, projectId })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Sync failed");
    }

    const result = await response.json();
    
    // Update local storage timestamp
    const connectors = this.getConnectors();
    const updated = connectors.map(c => c.id === id ? { ...c, lastSync: new Date().toISOString() } : c);
    localStorage.setItem(this.storageKey, JSON.stringify(updated));

    return { count: result.count };
  }

  async disconnect(id: string): Promise<void> {
    const connectors = this.getConnectors();
    const updated = connectors.map(c => c.id === id ? { ...c, status: 'disconnected' as const } : c);
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }
}

export const connectorService = new ConnectorService();
