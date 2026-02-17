
import React from 'react';
import { NavSection, Project } from '../types';
import { Bell, Search, Filter, Calendar, LayoutGrid, Database, Zap, RefreshCw, FolderKanban } from 'lucide-react';

interface HeaderProps {
  activeSection: NavSection;
  activeProject: Project | null;
}

const Header: React.FC<HeaderProps> = ({ activeSection, activeProject }) => {
  const getTitle = () => {
    switch (activeSection) {
      case NavSection.DASHBOARD: return 'General Insights';
      case NavSection.YOUTUBE: return 'YouTube Analytics Console';
      case NavSection.BRIGHTEDGE: return 'SEO & GSC Intelligence';
      case NavSection.COMPETITORS: return 'Competitive Analysis';
      case NavSection.REPORTS: return 'Custom Reporting Hub';
      case NavSection.IMPORT: return 'Integrations Hub';
      case NavSection.USERS: return 'Access Control';
      case NavSection.PROJECTS: return 'Workspace Manager';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="h-20 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10 backdrop-blur-md bg-opacity-80 shadow-sm">
      <div className="flex items-center gap-8">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">{getTitle()}</h1>
          {activeProject && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <FolderKanban size={10} className="text-blue-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{activeProject.name}</span>
            </div>
          )}
        </div>
        
        <div className="hidden xl:flex items-center gap-4 border-l border-slate-800 pl-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Mongo v6.3</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Neon Cache</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Universal Search..." 
            className="bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all w-64 text-white placeholder-slate-600 font-medium"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 text-slate-500 border border-slate-800 rounded-xl hover:text-blue-400 cursor-pointer transition-colors bg-slate-900/50" title="Background Sync Status">
            <RefreshCw size={18} />
          </div>
          <button className="p-2 text-slate-500 hover:text-white bg-slate-900/50 border border-slate-800 rounded-xl relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-[#0f172a]"></span>
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-900/30">
            <LayoutGrid size={16} />
            <span className="uppercase tracking-widest">Widgets</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
