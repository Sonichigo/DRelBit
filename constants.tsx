
import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Youtube, 
  Globe, 
  Users, 
  BarChart3, 
  Upload, 
  ShieldCheck,
  Zap,
  Clock,
  ExternalLink,
  MessageSquare,
  TrendingUp,
  Share2
} from 'lucide-react';
import { NavSection, ContentItem } from './types';

export const NAV_ITEMS = [
  { id: NavSection.DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: NavSection.CONTENT, label: 'Content Management', icon: <FileText size={20} />, isHeader: true },
  { id: NavSection.YOUTUBE, label: 'YouTube Analytics', icon: <Youtube size={20} /> },
  { id: NavSection.BRIGHTEDGE, label: 'BrightEdge & SEO', icon: <Globe size={20} /> },
  { id: NavSection.COMPETITORS, label: 'Competitor Tracking', icon: <TrendingUp size={20} /> },
  { id: NavSection.REPORTS, label: 'Custom Reports', icon: <BarChart3 size={20} /> },
  { id: NavSection.IMPORT, label: 'Data Import', icon: <Upload size={20} />, isHeader: true },
  { id: NavSection.USERS, label: 'User Management', icon: <ShieldCheck size={20} /> },
];

export const MOCK_CONTENT: ContentItem[] = [
  { id: '1', date: '2025-01-29', platform: 'GITHUB', type: 'DEMO', author: 'Bhavana Giri', description: 'Car Dealership Agent with Redis Agent Memory Server', impressions: 12000, views: 3500, engagement: 450 },
  { id: '2', date: '2025-01-29', platform: 'GITHUB', type: 'DEMO', author: 'Bhavana Giri', description: 'A banking chatbot with semantic routing', impressions: 9800, views: 2100, engagement: 310 },
  { id: '3', date: '2025-01-28', platform: 'REDDIT', type: 'COMMENT', author: 'Ricardo Ferreira', description: 'Helping user to evaluate a migration from Oracle Coherence', impressions: 4500, views: 1500, engagement: 85 },
  { id: '4', date: '2025-01-28', platform: 'LINKEDIN', type: 'POST', author: 'Guy Royse', description: 'Social media post promoting Medium series on LangGraph.js', impressions: 45000, views: 12000, engagement: 1500 },
  { id: '5', date: '2025-01-27', platform: 'YOUTUBE', type: 'VIDEO', author: 'DevEx Team', description: 'Mastering the Gemini 2.5 API - Full Guide', impressions: 150000, views: 42000, engagement: 5600 },
];

export const PLATFORM_COLORS: Record<string, string> = {
  GITHUB: 'bg-slate-700',
  REDDIT: 'bg-orange-600',
  LINKEDIN: 'bg-blue-600',
  YOUTUBE: 'bg-red-600',
  BRIGHTEDGE: 'bg-emerald-600'
};
