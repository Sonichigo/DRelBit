
import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  AlertCircle,
  Calendar,
  Mic,
  MonitorPlay,
  Share2,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  FolderKanban
} from 'lucide-react';
import { NavSection } from './types';

export const NAV_GROUPS = [
  {
    items: [
      { id: NavSection.DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    ]
  },
  {
    label: 'CONTENT MANAGEMENT',
    items: [
      { id: NavSection.CONTENT, label: 'Content', icon: <FileText size={18} /> },
      { id: NavSection.NEEDS_UPDATE, label: 'Needs Update', icon: <AlertCircle size={18} />, badge: 13 },
    ]
  },
  {
    label: 'EVENT MANAGEMENT',
    items: [
      { id: NavSection.EVENTS, label: 'Events', icon: <Calendar size={18} /> },
      { id: NavSection.PRESENTATIONS, label: 'Presentations', icon: <Mic size={18} /> },
      { id: NavSection.SESSIONS, label: 'Sessions', icon: <MonitorPlay size={18} /> },
      { id: NavSection.NEEDS_UPDATE, label: 'Needs Update', icon: <AlertCircle size={18} /> },
    ]
  },
  {
    label: 'EXTERNAL',
    items: [
      { id: NavSection.JIRA, label: 'Jira', icon: <Share2 size={18} /> },
      { id: NavSection.CONFLUENCE, label: 'Confluence', icon: <BookOpen size={18} /> },
    ]
  },
  {
    label: 'SYSTEM MANAGEMENT',
    items: [
      { id: NavSection.USERS, label: 'User Management', icon: <Users size={18} /> },
      { id: NavSection.SYSTEM_STATS, label: 'System Stats', icon: <BarChart3 size={18} /> },
    ]
  }
];

export const PLATFORM_COLORS: Record<string, string> = {
  GITHUB: 'bg-slate-700',
  REDDIT: 'bg-orange-600',
  LINKEDIN: 'bg-blue-600',
  YOUTUBE: 'bg-red-600',
  BRIGHTEDGE: 'bg-emerald-600',
  GSC: 'bg-blue-400',
  GA4: 'bg-orange-400',
  BLOG: 'bg-indigo-600'
};
