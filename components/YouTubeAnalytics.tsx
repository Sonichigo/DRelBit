
import React, { useState, useEffect, useMemo } from 'react';
import { Youtube, Search, Play, Clock, Sparkles } from 'lucide-react';
import { api } from '../services/apiService';
import { ContentItem, Project } from '../types';

interface YouTubeAnalyticsProps {
  project: Project | null;
}

const YouTubeAnalytics: React.FC<YouTubeAnalyticsProps> = ({ project }) => {
  const [data, setData] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!project) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Fix: Use api.getContent instead of non-existent dbService.getCachedData
        // api.getContent already handles local vs remote data and filtering by projectId
        const dbData = await api.getContent(project.id);
        // Filter for project relevant platforms
        const projectData = dbData.filter(i => 
          i.platform === 'YOUTUBE' || i.platform === 'GA4'
        );
        setData(projectData);
      } catch (err) {
        console.error("YouTube analytics synchronization failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [project]);

  const filteredData = useMemo(() => {
    return data.filter(v => 
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  if (loading) return <div className="p-20 text-center text-slate-500 font-bold animate-pulse">Synchronizing GA4 Stream...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Youtube className="text-red-500" /> Analytics & GA4 Intelligence
          </h2>
          <p className="text-slate-400 text-sm">Real-time engagement tracking for {project?.name}</p>
        </div>
      </div>

      <div className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">
          <div className="relative flex-1 lg:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search content records..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="px-6 py-3 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center gap-4">
             <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Aggregate Reach</span>
             <span className="text-lg font-bold text-red-500">{data.reduce((acc, i) => acc + i.views, 0).toLocaleString()}</span>
          </div>
        </div>

        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <div key={item.id} className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden hover:border-red-500/30 transition-all group">
                <div className="aspect-video bg-slate-800 relative flex items-center justify-center">
                  <Play size={32} className="text-white opacity-20 group-hover:opacity-40 transition-opacity" />
                  <span className="absolute top-3 left-3 bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold shadow-lg">{item.platform}</span>
                  <span className="absolute bottom-3 right-3 text-[10px] font-bold text-slate-500">{item.date}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-sm line-clamp-2 min-h-[40px] group-hover:text-red-400 transition-colors">{item.description}</h3>
                  <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Engagement</p>
                      <p className="text-sm font-bold text-white">{item.engagement.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Views</p>
                      <p className="text-sm font-bold text-red-400">{item.views.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
            <Youtube size={48} className="mx-auto text-slate-800 mb-4" />
            <h3 className="text-lg font-bold text-slate-500">No Analytics Data Detected</h3>
            <p className="text-slate-600 text-sm mt-1">Upload GA4 or YouTube CSVs in the Import section.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeAnalytics;
