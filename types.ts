
export interface ContentItem {
  id: string;
  date: string;
  platform: 'GITHUB' | 'REDDIT' | 'LINKEDIN' | 'YOUTUBE' | 'BRIGHTEDGE' | 'GSC' | 'GA4';
  type: string;
  author: string;
  description: string;
  impressions: number;
  views: number;
  engagement: number;
}

export interface Connector {
  id: string;
  name: string;
  provider: 'google' | 'brightedge' | 'github';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  icon: string;
}

export interface DatabaseConfig {
  id: 'mongodb' | 'postgresql';
  name: string;
  connectionString: string;
  status: 'online' | 'offline' | 'configuring';
  latency: number;
  cluster: string;
}

export interface ConnectionLog {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

export enum NavSection {
  DASHBOARD = 'dashboard',
  CONTENT = 'content',
  YOUTUBE = 'youtube',
  BRIGHTEDGE = 'brightedge',
  COMPETITORS = 'competitors',
  REPORTS = 'reports',
  IMPORT = 'import',
  USERS = 'users'
}

export interface WidgetConfig {
  id: string;
  title: string;
  visible: boolean;
  order: number;
  type: 'stat' | 'chart' | 'list' | 'table';
}

export type FilterOperator = 'contains' | 'equals' | 'greaterThan' | 'lessThan' | 'between';

export interface FilterRule {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
  valueEnd?: any;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface User {
  username: string;
  role: 'admin' | 'editor' | 'viewer';
}

// Added YouTubeStats interface to fix import error in YouTubeAnalytics.tsx
export interface YouTubeStats {
  id: string;
  title: string;
  views: number;
  engagementRate: number;
  date: string;
  duration: number;
  category: string;
}

// Added BrightEdgePage interface to fix import error in BrightEdgeAnalytics.tsx
export interface BrightEdgePage {
  url: string;
  rank: number;
  keywords: number;
  traffic: number;
  gscImpressions: number;
  ctr: number;
  value: number;
  group: string;
  status: 'Optimal' | 'Rising' | 'Stable' | 'Alert' | string;
}
