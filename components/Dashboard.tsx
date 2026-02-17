
import React, { useState, useEffect } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar
} from 'recharts';
import { 
  Eye, TrendingUp, Users, Database, LayoutDashboard, Search, Filter, FolderPlus
} from 'lucide-react';
import { api } from '../services/apiService';
import { ContentItem, Project } from '../types';

interface DashboardProps {
  project: Project | null;
}

const Dashboard: React.FC<DashboardProps> = ({ project }) => {
  const [data, setData] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

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
    // Listen for custom update events from other components
    const handleUpdate = () => load();
    window.addEventListener('data-updated', handleUpdate);
    return () => window.removeEventListener('data-updated', handleUpdate);
  }, [project]);

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
      if (!groups[dateKey]) groups[dateKey] = { name: dateKey, views: 0, engagement: 0 };
      groups[dateKey].views += (item.views || 0);
      groups[dateKey].engagement += (item.engagement || 0);
    });
    return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-4">
      <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
      <span className="uppercase tracking-[0.2em] font-black text-[10px]">Aggregating Atlas Data</span>
    </div>
  );

  if (!project) return (
    <div className="bg-[#1e293b]/50 border-2 border-dashed border-slate-800 rounded-3xl p-32 text-center animate-in fade-in duration-500">
      <FolderPlus size={48} className="mx-auto text-slate-700 mb-6" />
      <h3 className="text-2xl font-bold text-slate-300">No Workspace Active</h3>
      <p className="text-slate-500 max-w-sm mx-auto mt-2">
        Please go to the <span className="text-blue-500 font-bold">Project Control</span> section to initialize your first cloud workspace.
      </p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <LayoutDashboard className="text-blue-500" /> Unified Footprint
          </h2>
          <p className="text-slate-400 text-sm">Aggregated performance for workspace: <span className="text-white font-bold">{project.name}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl w-fit mb-4"><Eye size={20} /></div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Cumulative Traffic</p>
          <h3 className="text-2xl font-bold mt-1">{stats.views.toLocaleString()}</h3>
        </div>
        <div className="bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl w-fit mb-4"><Users size={20} /></div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Total Reach</p>
          <h3 className="text-2xl font-bold mt-1">{stats.impressions.toLocaleString()}</h3>
        </div>
        <div className="bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl w-fit mb-4"><TrendingUp size={20} /></div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Engagement Value</p>
          <h3 className="text-2xl font-bold mt-1">{stats.engagement.toLocaleString()}</h3>
        </div>
        <div className="bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl w-fit mb-4"><Database size={20} /></div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Data Corpus</p>
          <h3 className="text-2xl font-bold mt-1">{stats.count} Records</h3>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl p-8 shadow-inner shadow-black/20">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">Growth Velocity Timeline</h3>
            <div className="flex gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800">
              Active Source: <span className="text-blue-400 ml-2">MongoDB Atlas</span>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartData.length > 1 ? (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorGrowth)" />
                </AreaChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                  <Bar dataKey="views" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={60} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-[#1e293b]/50 border-2 border-dashed border-slate-800 rounded-3xl p-32 text-center">
          <Database size={48} className="mx-auto text-slate-700 mb-6" />
          <h3 className="text-2xl font-bold text-slate-300">Project Empty</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2">
            Upload your CSV performance spreadsheets in the <span className="text-blue-500 font-bold">Data Import</span> section to populate this cloud workspace.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
