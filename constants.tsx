
import React from 'react';
import { 
  LayoutDashboard, 
  Youtube, 
  Globe, 
  BarChart3, 
  Upload, 
  ShieldCheck,
  TrendingUp,
  FolderKanban,
  Activity
} from 'lucide-react';
import { NavSection, Project } from './types';

export const NAV_ITEMS = [
  { id: NavSection.DASHBOARD, label: 'Cumulative Report', icon: <LayoutDashboard size={20} /> },
  { id: NavSection.YOUTUBE, label: 'Analytics & GA4', icon: <Youtube size={20} /> },
  { id: NavSection.BRIGHTEDGE, label: 'SEO & BrightEdge', icon: <Globe size={20} /> },
  { id: NavSection.COMPETITORS, label: 'Competitor Tracking', icon: <TrendingUp size={20} /> },
  { id: NavSection.REPORTS, label: 'Custom Reports', icon: <BarChart3 size={20} /> },
  { id: NavSection.IMPORT, label: 'Data Import', icon: <Upload size={20} />, isHeader: true },
  { id: NavSection.PROJECTS, label: 'Project Control', icon: <FolderKanban size={20} />, adminOnly: true },
  { id: NavSection.USERS, label: 'User Management', icon: <ShieldCheck size={20} />, adminOnly: true },
  { id: NavSection.SYSTEM_HEALTH, label: 'System Health', icon: <Activity size={20} />, isHeader: true },
];

export const PLATFORM_COLORS: Record<string, string> = {
  GITHUB: 'bg-slate-700',
  REDDIT: 'bg-orange-600',
  LINKEDIN: 'bg-blue-600',
  YOUTUBE: 'bg-red-600',
  BRIGHTEDGE: 'bg-emerald-600',
  GSC: 'bg-blue-400',
  GA4: 'bg-orange-400'
};
