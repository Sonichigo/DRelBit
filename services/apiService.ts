
import { ContentItem, Report, Project, CFP, Session, TrackedUrl } from '../types';
import { dbService } from './databaseService';

const API_BASE = '/api'; 

class ApiService {
  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async ping(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${API_BASE}/projects`, { signal: controller.signal });
      clearTimeout(id);
      return response.ok;
    } catch {
      return false;
    }
  }

  private async requestWithRetry(path: string, options: RequestInit = {}, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(`${API_BASE}${path}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });
        if (!response.ok) throw new Error(`HTTP_ERROR_${response.status}`);
        return await response.json();
      } catch (error: any) {
        if (i === retries - 1) throw error;
        await this.delay(Math.pow(2, i) * 500);
      }
    }
  }

  async scrapeUrl(url: string, projectId: string): Promise<ContentItem[]> {
    return this.requestWithRetry('/scrape', {
      method: 'POST',
      body: JSON.stringify({ url, projectId })
    });
  }

  async getTrackedUrls(projectId: string): Promise<TrackedUrl[]> {
    try {
      return await this.requestWithRetry(`/tracked-urls?projectId=${projectId}`);
    } catch {
      return JSON.parse(localStorage.getItem(`tracked_urls_${projectId}`) || '[]');
    }
  }

  async addTrackedUrl(trackedUrl: TrackedUrl): Promise<void> {
    try {
      await this.requestWithRetry('/tracked-urls', {
        method: 'POST',
        body: JSON.stringify(trackedUrl)
      });
    } catch {
      const existing = JSON.parse(localStorage.getItem(`tracked_urls_${trackedUrl.projectId}`) || '[]');
      localStorage.setItem(`tracked_urls_${trackedUrl.projectId}`, JSON.stringify([...existing, trackedUrl]));
    }
  }

  async deleteTrackedUrl(id: string, projectId: string): Promise<void> {
    try {
      await this.requestWithRetry(`/tracked-urls/${id}`, { method: 'DELETE' });
    } catch {
      const existing = JSON.parse(localStorage.getItem(`tracked_urls_${projectId}`) || '[]');
      localStorage.setItem(`tracked_urls_${projectId}`, JSON.stringify(existing.filter((u: any) => u.id !== id)));
    }
  }

  async getCFPs(projectId: string): Promise<CFP[]> {
    try {
      const data = await this.requestWithRetry(`/cfps?projectId=${projectId}`);
      await dbService.saveToMongo('cfps', data);
      return data;
    } catch {
      const local = await dbService.getFromMongo('cfps');
      return local.filter((c: any) => c.projectId === projectId);
    }
  }

  async syncUnsyncedData(): Promise<{ processedCount: number }> {
    const queue = await dbService.getSyncQueue();
    if (queue.length === 0) return { processedCount: 0 };
    await this.requestWithRetry('/content', { method: 'POST', body: JSON.stringify(queue) });
    await dbService.clearSyncQueue();
    return { processedCount: queue.length };
  }

  async uploadContent(items: ContentItem[]): Promise<void> {
    try {
      await this.requestWithRetry('/content', { method: 'POST', body: JSON.stringify(items) });
      await dbService.saveToMongo('content', items);
    } catch {
      await dbService.addToSyncQueue(items);
      throw new Error('QUEUED_FOR_SYNC');
    }
  }

  async getContent(projectId?: string): Promise<ContentItem[]> {
    try {
      const serverData = await this.requestWithRetry(`/content${projectId ? `?projectId=${projectId}` : ''}`);
      if (serverData) await dbService.saveToMongo('content', serverData);
      return serverData;
    } catch {
      const local = await dbService.getFromMongo('content');
      return projectId ? local.filter((i: any) => i.projectId === projectId) : local;
    }
  }

  async getProjects(): Promise<Project[]> {
    try {
      const serverProjects = await this.requestWithRetry('/projects');
      if (serverProjects) await dbService.saveToMongo('projects', serverProjects);
      return serverProjects;
    } catch {
      return await dbService.getFromMongo('projects') as Project[];
    }
  }

  async saveProject(project: Project): Promise<void> {
    await this.requestWithRetry('/projects', { method: 'POST', body: JSON.stringify(project) });
    await dbService.saveToMongo('projects', [project]);
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    await this.requestWithRetry(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
  }

  async deleteProject(id: string): Promise<void> {
    await this.requestWithRetry(`/projects/${id}`, { method: 'DELETE' });
  }

  async getReports(projectId: string): Promise<Report[]> {
    try {
      const data = await this.requestWithRetry(`/reports?projectId=${projectId}`);
      if (data) await dbService.saveToMongo('reports', data);
      return data;
    } catch {
      const local = await dbService.getFromMongo('reports');
      return local.filter((r: any) => r.projectId === projectId);
    }
  }

  async saveReport(report: Report): Promise<void> {
    await this.requestWithRetry('/reports', { method: 'POST', body: JSON.stringify(report) });
    await dbService.saveToMongo('reports', [report]);
  }

  async deleteReport(id: string): Promise<void> {
    await this.requestWithRetry(`/reports/${id}`, { method: 'DELETE' });
  }
}

export const api = new ApiService();
