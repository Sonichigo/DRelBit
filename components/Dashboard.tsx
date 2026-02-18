
"use client";

import React, { useState, useEffect } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar
} from 'recharts';
import { 
  Eye, TrendingUp, Users, Database, Search, Plus, X, 
  Calendar as CalendarIcon, Zap, LayoutGrid, SearchIcon
} from 'lucide-react';
import { api } from '../services/apiService';
import { ContentItem, Project } from '../types';

interface DashboardProps {
  project: Project | null;
  isWidgetGalleryOpen: boolean;
  setIsWidgetGalleryOpen: (val: boolean) => void;
  searchQuery: string;
}

type WidgetId = 'metrics' | 'growth' | 'communities' | 'events' | 'explorer';

const WIDGET_CONFIG = [
  { id: 'metrics', label: 'Primary Metrics', icon: <Eye size={14} /> },
  { id: 'growth', label: 'Growth Velocity', icon: <TrendingUp size={14} /> },
  { id: 'communities', label: 'Community Share', icon: <Users size={14} /> },
  { id: 'events', label: 'Milestone Feed', icon: <Zap size={14} /> },
  { id: 'explorer', label: 'Semantic Explorer', icon: <SearchIcon size={14} /> },
];

const Dashboard: React.FC<DashboardProps> = ({ project, isWidgetGalleryOpen, setIsWidgetGalleryOpen, searchQuery }) => {
  const [data, setData] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleWidgets, setVisibleWidgets] = useState<WidgetId[]>(['metrics', 'growth', 'communities', 'events', 'explorer']);

  const load = async () => {
    setLoading(true);
    if (!project) {
      setLoading(false);
      return;
    }
    try {
      const content = await api.getContent(project.id);
      setData(content || []);
    } catch (err) {
      console.error("Dashboard data load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const saved = localStorage.getItem(`widgets_${project?.id || 'global'}`);
    if (saved) setVisibleWidgets(JSON.parse(saved));

    const handleUpdate = () => load();
    window.addEventListener('data-updated', handleUpdate);
    return () => window.removeEventListener('data-updated', handleUpdate);
  }, [project]);

  const toggleWidget = (id: WidgetId) => {
    const newWidgets = visibleWidgets.includes(id) 
      ? visibleWidgets.filter(w => w !== id) 
      : [...visibleWidgets, id];
    setVisibleWidgets(newWidgets as WidgetId[]);
    localStorage.setItem(`widgets_${project?.id || 'global'}`, JSON.stringify(newWidgets));
  };

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;
    const q = searchQuery.toLowerCase();
    return data.filter(item => 
      item.description.toLowerCase().includes(q) ||
      item.author.toLowerCase().includes(q) ||
      item.platform.toLowerCase().includes(q)
    );
  }, [data, searchQuery]);

  const stats = React.useMemo(() => {
    return {
      views: data.reduce((acc, i) => acc + (i.views || 0), 0),
      impressions: data.reduce((acc, i) => acc + (i.impressions || 0), 0),
      engagement: data.reduce((acc, i) => acc + (i.engagement || 0), 0),
      count: data.length
    };
  }, [data]);

  const chartData = React.useMemo(() => {
    const groups: Record<string, any> = {};
    data.forEach(item => {
      const dateKey = item.date || 'Unknown';
      if (!groups[dateKey]) {
        groups[dateKey] = { date: dateKey, views: 0, impressions: 0 };
      }
      groups[dateKey].views += (item.views || 0);
      groups[dateKey].impressions += (item.impressions || 0);
    });
    return Object.values(groups).sort((a: any, b: any) => a.date.localeCompare(b.date));
  }, [data]);

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-500 font-bold">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="animate-pulse">Synchronizing Workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {visibleWidgets.includes('metrics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Aggregate Views', val: stats.views, trend: '+12.5%' },
            { label: 'Total Impressions', val: stats.impressions, trend: '+8.2%' },
            { label: 'Active Engagement', val: stats.engagement, trend: 'STABLE' },
            { label: 'Unique Records', val: stats.count, trend: 'v2.5' }
          ].map((s, i) => (
            <div key={i} className="bg-[#1e293b]/50 border border-slate-800 p-8 rounded-3xl transition-all hover:border-slate-700 shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{s.label}</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded tracking-widest bg-slate-900 text-slate-400 border border-slate-800">{s.trend}</span>
              </div>
              <h3 className="text-4xl font-black text-white">{s.val.toLocaleString()}</h3>
            </div>
          ))}
        </div>
      )}

      {visibleWidgets.includes('growth') && (
        <div className="bg-[#1e293b]/50 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Growth Velocity</h3>
            <div className="flex gap-2">
              <div className="px-3 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20 text-[9px] font-black text-blue-500 uppercase tracking-widest">Views</div>
              <div className="px-3 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20 text-[9px] font-black text-purple-500 uppercase tracking-widest">Impressions</div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px' }} />
                <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="impressions" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorImpressions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {visibleWidgets.includes('explorer') && (
        <div className="bg-[#1e293b]/50 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
            <h3 className="text-xl font-bold flex items-center gap-3"><Search size={22} className="text-blue-500" /> Semantic Explorer</h3>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{filteredData.length} records identified</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
                  <th className="px-8 py-5">Content Target</th>
                  <th className="px-8 py-5">Platform</th>
                  <th className="px-8 py-5 text-right">Reach</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {filteredData.slice(0, 30).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">{item.description}</span>
                        <span className="text-[9px] text-slate-500 font-bold uppercase mt-1">{item.date} • {item.author}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[9px] font-black px-2 py-1 rounded border border-slate-800 bg-slate-900 text-slate-400 uppercase">{item.platform}</span>
                    </td>
                    <td className="px-8 py-5 text-right font-mono text-xs font-bold text-slate-300">{(item.views || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isWidgetGalleryOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#1e293b] border border-slate-700 w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <h3 className="text-xl font-bold">Workspace Configuration</h3>
              <button onClick={() => setIsWidgetGalleryOpen(false)} className="p-2 text-slate-500 hover:text-white transition-all"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-3">
              {WIDGET_CONFIG.map(widget => {
                const isActive = visibleWidgets.includes(widget.id as WidgetId);
                return (
                  <button 
                    key={widget.id}
                    onClick={() => toggleWidget(widget.id as WidgetId)}
                    className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all ${
                      isActive ? 'bg-blue-600/10 border-blue-500/40 text-white' : 'bg-slate-900/50 border-slate-800 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'bg-slate-800 text-slate-600'}`}>
                        {widget.icon}
                      </div>
                      <span className="font-bold text-sm">{widget.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="p-8 border-t border-slate-800">
              <button onClick={() => setIsWidgetGalleryOpen(false)} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Commit Layout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
