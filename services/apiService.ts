
import { ContentItem, Report, Project } from '../types';
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

        if (response.status === 401) throw new Error('AUTH_EXPIRED');
        if (response.status === 404) throw new Error('RESOURCE_NOT_FOUND');
        
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP_ERROR_${response.status}`);
        }

        return await response.json();
      } catch (error: any) {
        if (i === retries - 1) throw error;
        await this.delay(Math.pow(2, i) * 500);
      }
    }
  }

  async uploadContent(items: ContentItem[]): Promise<void> {
    try {
      await this.requestWithRetry('/content', { method: 'POST', body: JSON.stringify(items) });
    } catch (err) {
      console.error("Cloud upload failed, diverting to local vault:", err);
      await dbService.saveToMongo('content', items);
      throw new Error('FALLBACK_TO_LOCAL');
    }
  }

  async getContent(projectId?: string): Promise<ContentItem[]> {
    try {
      return await this.requestWithRetry(`/content${projectId ? `?projectId=${projectId}` : ''}`);
    } catch (err) {
      const local = await dbService.getFromMongo('content');
      return projectId ? local.filter((i: any) => i.projectId === projectId) : local;
    }
  }

  async getProjects(): Promise<Project[]> {
    try {
      return await this.requestWithRetry('/projects');
    } catch (err) {
      return await dbService.getFromMongo('projects') as Project[];
    }
  }

  async saveProject(project: Project): Promise<void> {
    try {
      await this.requestWithRetry('/projects', { method: 'POST', body: JSON.stringify(project) });
    } catch (err) {
      await dbService.saveToMongo('projects', [project]);
    }
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    try {
      await this.requestWithRetry(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
    } catch (err) {
      const local = await dbService.getFromMongo('projects');
      const updated = local.map((p: any) => p.id === id ? { ...p, ...updates } : p);
      await dbService.saveToMongo('projects', updated);
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      await this.requestWithRetry(`/projects/${id}`, { method: 'DELETE' });
    } catch (err) {
      // Local fallback removal is tricky with indexedDB as we have to delete by ID
      // This is handled in the UI state generally but for consistency:
      console.warn("Delete failed on cloud, manual local cleanup required");
    }
  }

  async saveReport(report: Report): Promise<void> {
    try {
      await this.requestWithRetry('/reports', { method: 'POST', body: JSON.stringify(report) });
    } catch (err) {
      await dbService.saveToMongo('reports', [report]);
    }
  }

  async getReports(projectId: string): Promise<Report[]> {
    try {
      return await this.requestWithRetry(`/reports?projectId=${projectId}`);
    } catch (err) {
      const local = await dbService.getFromMongo('reports');
      return local.filter((r: any) => r.projectId === projectId);
    }
  }

  async deleteReport(id: string): Promise<void> {
    try {
      await this.requestWithRetry(`/reports/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn("Report delete cloud failed.");
    }
  }
}

export const api = new ApiService();
