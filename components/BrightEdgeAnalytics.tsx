
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Globe, Search, ExternalLink, Filter, TrendingUp, BarChart2
} from 'lucide-react';
import { api } from '../services/apiService';
import { ContentItem, Project } from '../types';

interface BrightEdgeAnalyticsProps {
  project: Project | null;
}

const BrightEdgeAnalytics: React.FC<BrightEdgeAnalyticsProps> = ({ project }) => {
  const [data, setData] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!project) return;
      setLoading(true);
      const content = await api.getContent(project.id);
      setData(content.filter(i => i.platform === 'BRIGHTEDGE' || i.platform === 'SEO' || i.platform === 'GSC'));
      setLoading(false);
    };
    load();
  }, [project]);

  const filtered = useMemo(() => {
    return data.filter(item => item.description.toLowerCase().includes(query.toLowerCase()));
  }, [data, query]);

  if (loading) return <div className="p-20 text-center text-slate-500 animate-pulse font-bold tracking-widest">Auditing SEO Database...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Globe className="text-emerald-500" /> SEO & BrightEdge Control
          </h2>
          <p className="text-slate-400">Unified search log tracking for {project?.name}</p>
        </div>
      </div>

      <div className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl p-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
          <div className="relative flex-1 w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search URLs or Keywords..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-white"
            />
          </div>
          <div className="flex gap-4">
            <div className="px-8 py-3 bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Aggregate Traffic</span>
              <span className="text-xl font-bold text-emerald-500">{data.reduce((acc, i) => acc + i.views, 0).toLocaleString()}</span>
            </div>
            <div className="px-8 py-3 bg-slate-900/50 rounded-2xl border border-slate-800 flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total Visibility</span>
              <span className="text-xl font-bold">{(data.reduce((acc, i) => acc + i.impressions, 0) / 1000).toFixed(1)}k</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-800">
                <th className="px-6 py-4">Target URI / Keyword</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4 text-right">Reach</th>
                <th className="px-6 py-4 text-right">Traffic</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.length > 0 ? filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/20 transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-blue-400 truncate max-w-md font-mono">{row.description}</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Audit Date: {row.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[9px] font-bold bg-slate-800 px-2 py-1 rounded border border-slate-700 uppercase">{row.platform}</span>
                  </td>
                  <td className="px-6 py-5 text-right font-mono text-slate-300">{row.impressions.toLocaleString()}</td>
                  <td className="px-6 py-5 text-right font-bold text-emerald-400 font-mono">{row.views.toLocaleString()}</td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-slate-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100"><ExternalLink size={16} /></button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <Globe size={40} className="mx-auto text-slate-800 mb-4" />
                    <p className="text-slate-600 font-bold">No SEO Data Loaded</p>
                    <p className="text-slate-700 text-xs mt-1">Upload organic search logs to populate this table.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BrightEdgeAnalytics;
