
import React from 'react';
import { 
  BarChart3, FileText, Download, Share2, Calendar, Plus, Settings, ChevronDown 
} from 'lucide-react';

const CustomReports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reporting Hub</h2>
          <p className="text-slate-400 text-sm">Create, schedule and export automated performance reports</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm border border-slate-700 transition-colors">
            <Settings size={18} />
            <span>Manage Templates</span>
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
            <Plus size={18} />
            <span>New Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Monthly Executive Summary', type: 'PDF / Dashboard', lastRun: '2 days ago', status: 'Scheduled' },
          { title: 'SEO Keyword Rank Tracker', type: 'Excel / CSV', lastRun: '1 hour ago', status: 'Active' },
          { title: 'Competitor YouTube Comparison', type: 'PowerPoint', lastRun: '1 week ago', status: 'Paused' },
        ].map((report, idx) => (
          <div key={idx} className="bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-6 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-800 rounded-xl text-slate-400 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                <FileText size={24} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                report.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-400' :
                report.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-700 text-slate-400'
              }`}>
                {report.status}
              </span>
            </div>
            <h3 className="font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors">{report.title}</h3>
            <p className="text-slate-500 text-xs mb-6 uppercase font-bold tracking-wider">{report.type}</p>
            
            <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>Last run: {report.lastRun}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BarChart3 size={14} />
                <span>12 Metrics</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors border border-slate-700 flex items-center justify-center gap-2">
                <Download size={14} /> Download
              </button>
              <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-400">
                <Share2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-10 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Plus size={32} />
          </div>
          <h3 className="text-xl font-bold">Build a Custom Visualization</h3>
          <p className="text-slate-400 text-sm">Mix data sources (GSC + YouTube + GA4) to create a unique perspective on your content performance.</p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg cursor-pointer hover:border-blue-500/50">
              <span className="text-sm font-medium">Select Metric</span>
              <ChevronDown size={14} />
            </div>
            <span className="text-slate-600 font-bold">+</span>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg cursor-pointer hover:border-blue-500/50">
              <span className="text-sm font-medium">Select Dimension</span>
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomReports;
