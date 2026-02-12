
import React from 'react';
import { 
  Users, TrendingUp, Search, ExternalLink, ArrowUpRight, ArrowDownRight, MoreHorizontal 
} from 'lucide-react';

const CompetitorTracking: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Competitor Intelligence</h2>
          <p className="text-slate-400 text-sm">Real-time tracking of competitor content strategies and engagement</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Track New Entity
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { name: 'TechMaster Pro', rank: 1, share: '34%', trend: 'up', posts: 12, views: '1.2M' },
          { name: 'DevCentral', rank: 2, share: '28%', trend: 'down', posts: 8, views: '950K' },
          { name: 'AIOps Hub', rank: 3, share: '15%', trend: 'up', posts: 15, views: '420K' },
        ].map((competitor, idx) => (
          <div key={idx} className="bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-6 group hover:border-blue-500/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-lg">
                  {competitor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold group-hover:text-blue-400 transition-colors">{competitor.name}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                    Ranked #{competitor.rank} in Sector
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500"><MoreHorizontal size={18} /></button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-900/50 p-3 rounded-xl">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Market Share</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{competitor.share}</span>
                  {competitor.trend === 'up' ? <ArrowUpRight size={16} className="text-emerald-500" /> : <ArrowDownRight size={16} className="text-rose-500" />}
                </div>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-xl">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Monthly Views</p>
                <p className="text-xl font-bold">{competitor.views}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Performing Content</p>
              <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <p className="text-sm font-medium mb-1 line-clamp-1">The Future of AI Agents in 2026</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                  <span>YouTube Video</span>
                  <span className="text-emerald-400">850k views</span>
                </div>
              </div>
              <button className="w-full text-xs text-blue-400 font-bold hover:underline py-1">View Full Profile</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-6">Topic Overlap Analysis</h3>
        <div className="relative h-64 flex items-center justify-center border border-dashed border-slate-700 rounded-2xl bg-slate-900/30">
          <div className="text-center space-y-2">
            <Search className="mx-auto text-slate-600" size={32} />
            <p className="text-slate-400 font-medium">Topic Map Visualisation</p>
            <p className="text-xs text-slate-500 max-w-sm">Use the AI engine to map your content themes against competitors to identify "Blue Oceans" where they aren't competing yet.</p>
            <button className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm border border-slate-700 transition-colors">
              Generate Topic Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitorTracking;
