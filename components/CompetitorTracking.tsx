
import React, { useState } from 'react';
import { 
  Users, TrendingUp, Search, ExternalLink, ArrowUpRight, ArrowDownRight, MoreHorizontal, X, Plus, Loader2, Sparkles
} from 'lucide-react';

const CompetitorTracking: React.FC = () => {
  const [competitors, setCompetitors] = useState([
    { name: 'TechMaster Pro', rank: 1, share: '34%', trend: 'up', posts: 12, views: '1.2M' },
    { name: 'DevCentral', rank: 2, share: '28%', trend: 'down', posts: 8, views: '950K' },
    { name: 'AIOps Hub', rank: 3, share: '15%', trend: 'up', posts: 15, views: '420K' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [isMapping, setIsMapping] = useState(false);
  const [newEntity, setNewEntity] = useState('');

  const handleTrackEntity = () => {
    if (!newEntity) return;
    setCompetitors([
      ...competitors,
      { name: newEntity, rank: competitors.length + 1, share: '0%', trend: 'up', posts: 0, views: '0' }
    ]);
    setNewEntity('');
    setIsAdding(false);
    alert(`Entity "${newEntity}" is now being tracked.`);
  };

  const runTopicMap = () => {
    setIsMapping(true);
    setTimeout(() => {
      setIsMapping(false);
      alert('AI Topic Map Generated. Significant content gap identified in "Self-Healing Infrastructure" niche.');
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Competitor Intelligence</h2>
          <p className="text-slate-400 text-sm">Real-time tracking of competitor content strategies and engagement</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-900/20"
        >
          Track New Entity
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {competitors.map((competitor, idx) => (
          <div key={idx} className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl p-6 group hover:border-blue-500/30 transition-all shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center font-bold text-lg border border-slate-700 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  {competitor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold group-hover:text-blue-400 transition-colors">{competitor.name}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                    Sector Rank #{competitor.rank}
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"><MoreHorizontal size={18} /></button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mb-1">Market Share</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{competitor.share}</span>
                  {competitor.trend === 'up' ? <ArrowUpRight size={16} className="text-emerald-500" /> : <ArrowDownRight size={16} className="text-rose-500" />}
                </div>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mb-1">Views / Mo</p>
                <p className="text-xl font-bold">{competitor.views}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Viral Signal</p>
              <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors cursor-pointer group/item">
                <p className="text-xs font-bold mb-1 line-clamp-1 group-hover/item:text-blue-400">The Future of AI Agents in 2026</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase">
                  <span>YouTube</span>
                  <span className="text-emerald-400">850k views</span>
                </div>
              </div>
              <button className="w-full text-[10px] text-blue-400 font-black hover:text-blue-300 transition-colors uppercase tracking-widest">
                Full Competitive Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl p-10">
        <div className="flex flex-col items-center text-center max-w-xl mx-auto">
          <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
            {isMapping ? <Loader2 size={32} className="animate-spin" /> : <Sparkles size={32} />}
          </div>
          <h3 className="text-xl font-bold">Blue Ocean Analysis</h3>
          <p className="text-slate-400 text-sm mt-2">Identify untapped semantic territories where your brand can dominate without direct competition.</p>
          
          <button 
            disabled={isMapping}
            onClick={runTopicMap}
            className="mt-8 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold border border-slate-700 transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {isMapping ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            {isMapping ? 'Generating Map...' : 'Map Topic Overlap'}
          </button>
          
          <p className="text-[10px] text-slate-600 mt-6 font-bold uppercase tracking-widest">Powered by Gemini 3.0 Reasoning Engine</p>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-[#1e293b] border border-slate-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold">Track New Competitor</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Entity Name or URL</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newEntity}
                  onChange={(e) => setNewEntity(e.target.value)}
                  placeholder="e.g. Acme Corp Digital"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-white"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-all text-sm border border-slate-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleTrackEntity}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all text-sm shadow-lg shadow-blue-900/20"
                >
                  Start Tracking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitorTracking;
