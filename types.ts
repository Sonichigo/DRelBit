
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

export interface YouTubeStats {
  channelId: string;
  channelName: string;
  totalViews: number;
  subscribers: number;
  avgWatchTime: number;
  engagementRate: number;
  competitorId?: string;
}

export interface BrightEdgePage {
  url: string;
  rank: number;
  keywords: number;
  traffic: number;
  gscImpressions: number;
  ctr: number;
  value: number;
  group: string;
  status: 'Optimal' | 'Rising' | 'Stable' | 'Alert';
}

export interface User {
  username: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface WidgetConfig {
  id: string;
  title: string;
  visible: boolean;
  order: number;
  type: 'stat' | 'chart' | 'list' | 'table';
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

export type FilterOperator = 'contains' | 'equals' | 'greaterThan' | 'lessThan' | 'between';

export interface FilterRule {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
  valueEnd?: any; // For between operator
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}
