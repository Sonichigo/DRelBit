
export interface ContentItem {
  id: string;
  projectId: string;
  date: string;
  platform: 'GITHUB' | 'REDDIT' | 'LINKEDIN' | 'YOUTUBE' | 'BRIGHTEDGE' | 'GSC' | 'GA4' | 'SEO' | 'BLOG';
  type: string;
  author: string;
  description: string;
  impressions: number;
  views: number;
  engagement: number;
  url?: string;
  events?: string[];
  communities?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  spreadsheetUrl?: string;
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

export interface CFP {
  id: string;
  projectId: string;
  eventName: string;
  type: string;
  deadline: string;
  status: 'OPEN' | 'CLOSED';
}

export interface TrackedUrl {
  id: string;
  projectId: string;
  url: string;
  label: string;
  lastScraped?: string;
}

// Added Session interface to support apiService and databaseService
export interface Session {
  id: string;
  projectId: string;
  title: string;
  date: string;
}

// Added Connector interface to support connectorService
export interface Connector {
  id: string;
  name: string;
  provider: string;
  status: 'connected' | 'disconnected';
  icon: string;
  lastSync?: string;
}

// Added Filter types to support AdvancedFilter component
export type FilterOperator = 'contains' | 'equals' | 'greaterThan' | 'lessThan' | 'between';

export interface FilterRule {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string;
  valueEnd?: string;
}

export enum NavSection {
  DASHBOARD = 'dashboard',
  YOUTUBE = 'youtube',
  BRIGHTEDGE = 'brightedge',
  COMPETITORS = 'competitors',
  REPORTS = 'reports',
  IMPORT = 'import',
  USERS = 'users',
  PROJECTS = 'projects',
  SYSTEM_HEALTH = 'system_health',
  // Added missing enum values used in constants.tsx
  CONTENT = 'content',
  NEEDS_UPDATE = 'needs_update',
  EVENTS = 'events',
  PRESENTATIONS = 'presentations',
  SESSIONS = 'sessions',
  JIRA = 'jira',
  CONFLUENCE = 'confluence',
  SYSTEM_STATS = 'system_stats'
}

export interface User {
  username: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
}
