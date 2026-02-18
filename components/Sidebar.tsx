
"use client";
import React from 'react';
import { NavSection, User, Project } from '../types';
import { 
  LayoutDashboard, Youtube, Globe, Users, FileBarChart, 
  Upload, Settings, FolderKanban, ShieldCheck, ChevronLeft, LogOut, ChevronDown 
} from 'lucide-react';

interface SidebarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  user: User;
  onLogout: () => void;
  projects: Project[];
  activeProject: Project | null;
  onSelectProject: (p: Project) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSelectSection, 
  isOpen, 
  toggleSidebar,
  user,
  onLogout,
  projects,
  activeProject,
  onSelectProject
}) => {
  const menuItems = [
    { id: NavSection.DASHBOARD, label: 'Cumulative Report', icon: <LayoutDashboard size={18} /> },
    { id: NavSection.YOUTUBE, label: 'Analytics & GA4', icon: <Youtube size={18} /> },
    { id: NavSection.BRIGHTEDGE, label: 'SEO & BrightEdge', icon: <Globe size={18} /> },
    { id: NavSection.COMPETITORS, label: 'Competitor Tracking', icon: <Users size={18} /> },
    { id: NavSection.REPORTS, label: 'Custom Reports', icon: <FileBarChart size={18} /> },
    { label: 'DATA IMPORT', isHeader: true },
    { id: NavSection.PROJECTS, label: 'Project Control', icon: <FolderKanban size={18} /> },
    { id: NavSection.IMPORT, label: 'Data Import', icon: <Upload size={18} /> },
    { id: NavSection.USERS, label: 'User Management', icon: <Settings size={18} /> },
    { label: 'SYSTEM HEALTH', isHeader: true },
    { id: NavSection.SYSTEM_HEALTH, label: 'System Health', icon: <ShieldCheck size={18} /> },
  ];

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} flex flex-col h-full bg-[#0c111d] border-r border-slate-800 transition-all duration-300 relative z-30 shadow-2xl`}>
      <div className="p-6 flex items-center justify-between">
        <div className={`flex items-center gap-2 overflow-hidden ${!isOpen && 'hidden'}`}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/40 shrink-0">O</div>
          <span className="text-lg font-bold truncate tracking-tight">OmniContent</span>
        </div>
        <button onClick={toggleSidebar} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
          {isOpen ? <ChevronLeft size={20} /> : <ChevronLeft size={20} className="rotate-180" />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item, idx) => {
          if (item.isHeader) {
            return (
              <div key={idx} className={`pt-6 pb-2 px-3 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ${!isOpen && 'hidden'}`}>
                {item.label}
              </div>
            );
          }

          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id as NavSection)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400 transition-colors'}>{item.icon}</span>
              <span className={`text-xs font-bold whitespace-nowrap overflow-hidden transition-all duration-300 ${!isOpen && 'opacity-0 w-0'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-[#0c111d]">
        <div className={`flex items-center gap-3 ${!isOpen ? 'justify-center' : 'px-2'}`}>
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 shadow-inner shrink-0">
            <span className="text-sm font-black text-white">{user.username.charAt(0).toUpperCase()}</span>
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-white">{user.username}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user.role.replace('_', ' ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
