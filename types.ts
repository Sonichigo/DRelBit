
export interface ContentItem {
  id: string;
  projectId: string;
  date: string;
  platform: 'GITHUB' | 'REDDIT' | 'LINKEDIN' | 'YOUTUBE' | 'BRIGHTEDGE' | 'GSC' | 'GA4' | 'SEO';
  type: string;
  author: string;
  description: string;
  impressions: number;
  views: number;
  engagement: number;
}

export interface Report {
  id: string;
  projectId: string;
  title: string;
  type: string;
  createdAt: string;
  sources: string[];
  metrics: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export enum NavSection {
  DASHBOARD = 'dashboard',
  CONTENT = 'content',
  YOUTUBE = 'youtube',
  BRIGHTEDGE = 'brightedge',
  COMPETITORS = 'competitors',
  REPORTS = 'reports',
  IMPORT = 'import',
  USERS = 'users',
  PROJECTS = 'projects',
  SYSTEM_HEALTH = 'system_health'
}

export interface User {
  username: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
}

/**
 * Added missing types to fix compilation errors in:
 * - components/AdvancedFilter.tsx
 * - services/databaseService.ts
 * - services/connectorService.ts
 */

export type FilterOperator = 'contains' | 'equals' | 'greaterThan' | 'lessThan' | 'between';

export interface FilterRule {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string;
  valueEnd?: string;
}

export interface Connector {
  id: string;
  name: string;
  provider: string;
  status: 'connected' | 'disconnected';
  icon: string;
  lastSync?: string;
}

export interface ConnectionLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'success' | 'info' | 'warn' | 'error';
}
