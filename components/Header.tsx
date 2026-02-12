
import React from 'react';
import { NavSection } from '../types';
import { Bell, Search, Filter, Calendar, LayoutGrid, Database, Zap, RefreshCw } from 'lucide-react';

interface HeaderProps {
  activeSection: NavSection;
}

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const getTitle = () => {
    switch (activeSection) {
      case NavSection.DASHBOARD: return 'General Insights';
      case NavSection.YOUTUBE: return 'YouTube Analytics Console';
      case NavSection.BRIGHTEDGE: return 'SEO & GSC Intelligence';
      case NavSection.COMPETITORS: return 'Competitive Analysis';
      case NavSection.REPORTS: return 'Custom Reporting Hub';
      case NavSection.IMPORT: return 'Integrations Hub';
      case NavSection.USERS: return 'Access Control';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="h-20 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10 backdrop-blur-md bg-opacity-80">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-semibold text-white">{getTitle()}</h1>
        <div className="hidden lg:flex items-center gap-4 border-l border-slate-700 pl-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-md border border-emerald-500/20">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">MongoDB Active</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 rounded-md border border-blue-500/20">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">Postgres Cache</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search metrics..." 
            className="bg-slate-800/50 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all w-64"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 text-slate-500 border border-slate-800 rounded-lg hover:text-blue-400 cursor-pointer transition-colors" title="Background Sync Status">
            <RefreshCw size={18} />
          </div>
          <button className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f172a]"></span>
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
            <LayoutGrid size={18} />
            <span>Widgets</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
