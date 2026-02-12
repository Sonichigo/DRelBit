
import React from 'react';
import { NavSection } from '../types';
import { Bell, Search, Filter, Calendar, LayoutGrid } from 'lucide-react';

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
      case NavSection.IMPORT: return 'Data Management';
      case NavSection.USERS: return 'Access Control';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="h-20 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10 backdrop-blur-md bg-opacity-80">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-semibold text-white">{getTitle()}</h1>
        <div className="hidden lg:flex items-center gap-4 border-l border-slate-700 pl-8">
          <div className="flex items-center gap-2 text-sm text-slate-400 hover:text-white cursor-pointer transition-colors bg-slate-800/50 px-3 py-1.5 rounded-md">
            <Calendar size={16} />
            <span>Last 30 Days</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400 hover:text-white cursor-pointer transition-colors bg-slate-800/50 px-3 py-1.5 rounded-md">
            <Filter size={16} />
            <span>All Authors</span>
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
          <button className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f172a]"></span>
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
            <LayoutGrid size={18} />
            <span>Widgets</span>
            <span className="bg-blue-400/30 px-1.5 py-0.5 rounded text-[10px]">15</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
