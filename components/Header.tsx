
import React from 'react';
import { NavSection, Project } from '../types';
import { Bell, Search, RefreshCw, LayoutGrid, FolderKanban } from 'lucide-react';

interface HeaderProps {
  activeSection: NavSection;
  activeProject: Project | null;
  onOpenWidgets: () => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onRefresh: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  activeSection, 
  activeProject, 
  onOpenWidgets, 
  searchQuery, 
  onSearchChange,
  onRefresh
}) => {
  const getTitle = () => {
    switch (activeSection) {
      case NavSection.DASHBOARD: return 'General Insights';
      case NavSection.YOUTUBE: return 'YouTube Analytics';
      case NavSection.BRIGHTEDGE: return 'SEO & GSC Intelligence';
      case NavSection.COMPETITORS: return 'Competitive Analysis';
      case NavSection.REPORTS: return 'Custom Reports';
      case NavSection.IMPORT: return 'Integrations Hub';
      case NavSection.USERS: return 'Access Control';
      case NavSection.PROJECTS: return 'Workspace Manager';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="h-20 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-20 backdrop-blur-md bg-opacity-90 shadow-2xl">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white tracking-tight whitespace-nowrap">{getTitle()}</h1>
          <div className="h-4 w-px bg-slate-800"></div>
          {activeProject && (
            <div className="flex items-center gap-1.5 opacity-60">
              <FolderKanban size={10} className="text-blue-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeProject.name}</span>
            </div>
          )}
        </div>
        
        <div className="hidden xl:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest whitespace-nowrap">Mongo v6.3</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
            <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest whitespace-nowrap">IndexDB Cache</span>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-2xl px-8 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Universal Search..." 
            className="w-full bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-white placeholder-slate-600 font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={onRefresh}
            className="p-2.5 text-slate-500 hover:text-blue-400 bg-slate-900/50 border border-slate-800 rounded-xl transition-all hover:border-blue-500/30" 
            title="Refresh Data"
          >
            <RefreshCw size={18} />
          </button>
          <button className="p-2.5 text-slate-500 hover:text-white bg-slate-900/50 border border-slate-800 rounded-xl relative transition-all">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f172a]"></span>
          </button>
        </div>
        <button 
          onClick={onOpenWidgets}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xl shadow-blue-900/40 active:scale-95"
        >
          <LayoutGrid size={16} />
          <span className="uppercase tracking-widest">Widgets</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
