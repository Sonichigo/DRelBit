
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import { Youtube, TrendingUp, Users, Clock, PlusCircle, Search, Play, MessageSquare } from 'lucide-react';
import AdvancedFilter from './AdvancedFilter';
import { YouTubeStats, FilterRule, SortConfig } from '../types';

const MOCK_VIDEOS = [
  { id: 'v1', title: 'NextJS 15 Auth Patterns', views: 42000, engagementRate: 8.5, date: '2025-01-20', duration: 1200, category: 'Technical' },
  { id: 'v2', title: 'Mastering Gemini 2.5 API', views: 85000, engagementRate: 12.4, date: '2025-01-25', duration: 1800, category: 'AI' },
  { id: 'v3', title: 'Rust for JS Developers', views: 25000, engagementRate: 4.5, date: '2025-01-15', duration: 900, category: 'Technical' },
  { id: 'v4', title: 'Agentic Workflows 101', views: 56000, engagementRate: 9.1, date: '2025-01-28', duration: 1500, category: 'AI' },
  { id: 'v5', title: 'DevOps Trends 2026', views: 31000, engagementRate: 6.2, date: '2025-01-10', duration: 1100, category: 'Architecture' },
];

const YouTubeAnalytics: React.FC = () => {
  const [rules, setRules] = useState<FilterRule[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    let data = [...MOCK_VIDEOS];
    
    if (searchQuery) {
      data = data.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    rules.forEach(rule => {
      data = data.filter(item => {
        const val = (item as any)[rule.field];
        if (rule.operator === 'contains') return String(val).toLowerCase().includes(String(rule.value).toLowerCase());
        if (rule.operator === 'equals') return String(val) === String(rule.value);
        if (rule.operator === 'greaterThan') return Number(val) > Number(rule.value);
        if (rule.operator === 'lessThan') return Number(val) < Number(rule.value);
        if (rule.operator === 'between') {
          if (rule.field === 'date') return val >= rule.value && val <= rule.valueEnd;
          return Number(val) >= Number(rule.value) && Number(val) <= Number(rule.valueEnd);
        }
        return true;
      });
    });

    return data;
  }, [rules, searchQuery]);

  const filterFields = [
    { label: 'Video Title', value: 'title', type: 'string' as const },
    { label: 'Views', value: 'views', type: 'number' as const },
    { label: 'Engagement (%)', value: 'engagementRate', type: 'number' as const },
    { label: 'Duration (sec)', value: 'duration', type: 'number' as const },
    { label: 'Publish Date', value: 'date', type: 'date' as const },
    { label: 'Category', value: 'category', type: 'select' as const, options: ['Technical', 'AI', 'Architecture'] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Youtube className="text-red-500" /> YouTube Command Center
          </h2>
          <p className="text-slate-400 text-sm">Consolidated multi-channel performance & competitive intelligence</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm transition-colors border border-slate-700 font-medium">
            <PlusCircle size={18} />
            <span>Add Competitor</span>
          </button>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition-colors shadow-lg shadow-red-900/20 font-medium">
            <TrendingUp size={18} />
            <span>AI Audit</span>
          </button>
        </div>
      </div>

      <div className="bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <AdvancedFilter 
              fields={filterFields} 
              onApply={setRules} 
              onClear={() => setRules([])} 
            />
            <div className="relative flex-1 lg:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search video titles..." 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-red-500/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Result Count</span>
              <span className="text-lg font-bold">{filteredData.length} Videos</span>
            </div>
            <div className="px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Total Views</span>
              <span className="text-lg font-bold text-red-500">{(filteredData.reduce((acc, v) => acc + v.views, 0) / 1000).toFixed(1)}k</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.length > 0 ? (
            filteredData.map((video) => (
              <div key={video.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-red-500/30 transition-all group">
                <div className="aspect-video bg-slate-800 relative flex items-center justify-center">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                   <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                     <Play size={24} className="text-white fill-white ml-1" />
                   </div>
                   <span className="absolute bottom-3 right-3 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold">
                     {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                   </span>
                   <span className="absolute top-3 left-3 bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold">
                     {video.category}
                   </span>
                </div>
                <div className="p-5 space-y-4">
                  <h3 className="font-bold text-sm line-clamp-2 min-h-[40px] group-hover:text-red-400 transition-colors">{video.title}</h3>
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span className="flex items-center gap-1"><Clock size={12} /> {video.date}</span>
                    <span className="flex items-center gap-1 font-bold text-slate-300">{(video.views / 1000).toFixed(1)}K VIEWS</span>
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Engagement</span>
                      <span className="text-sm font-bold text-emerald-400">{video.engagementRate}%</span>
                    </div>
                    <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-500">
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
               <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-600">
                 <Search size={32} />
               </div>
               <div>
                 <p className="text-white font-bold">No videos found</p>
                 <p className="text-slate-500 text-sm">Try changing your filters or search keywords</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YouTubeAnalytics;
