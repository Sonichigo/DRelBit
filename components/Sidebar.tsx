
"use client";
import React from 'react';
import { NavSection, User, Project } from '../types';
import { NAV_ITEMS } from '../constants';
import { Menu, ChevronLeft, LogOut, ChevronDown, FolderKanban } from 'lucide-react';

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
  const isAdmin = user.role === 'super_admin' || user.role === 'admin';

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} flex flex-col h-full bg-[#111827] border-r border-slate-800 transition-all duration-300 relative z-20`}>
      <div className="p-6 flex items-center justify-between">
        <div className={`flex items-center gap-2 overflow-hidden ${!isOpen && 'hidden'}`}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/40">O</div>
          <span className="text-lg font-bold truncate">Content</span>
        </div>
        <button onClick={toggleSidebar} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
          {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && projects.length > 0 && (
        <div className="px-4 mb-6">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-2">Workspace</label>
          <div className="relative group">
            <select 
              value={activeProject?.id}
              onChange={(e) => {
                const p = projects.find(pr => pr.id === e.target.value);
                if (p) onSelectProject(p);
              }}
              className="w-full bg-[#1e293b] border border-slate-700 rounded-xl py-2.5 pl-9 pr-8 text-xs font-bold appearance-none cursor-pointer focus:ring-1 focus:ring-blue-500/50 transition-all text-white"
            >
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <FolderKanban className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={14} />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-white transition-colors" size={14} />
          </div>
        </div>
      )}

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          if ('isHeader' in item && item.isHeader) {
            return (
              <div key={item.label} className={`pt-6 pb-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider ${!isOpen && 'hidden'}`}>
                {item.label}
              </div>
            );
          }
          
          if (item.adminOnly && !isAdmin) return null;

          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id as NavSection)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}>{item.icon}</span>
              <span className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${!isOpen && 'opacity-0 w-0'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-[#0c111d]/50">
        <div className={`flex items-center gap-3 ${!isOpen ? 'justify-center' : 'px-2'}`}>
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600 shadow-inner">
            <span className="text-sm font-bold text-white">{user.username.charAt(0).toUpperCase()}</span>
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-white">{user.username}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">{user.role.replace('_', ' ')}</p>
            </div>
          )}
          {isOpen && (
            <button 
              onClick={onLogout}
              className="p-2 text-slate-500 hover:text-red-400 transition-colors bg-slate-800/50 rounded-lg border border-slate-800"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
