
import React from 'react';
import { MOCK_CONTENT, PLATFORM_COLORS } from '../constants';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Eye, TrendingUp, Users, Share2, MoreVertical, ExternalLink } from 'lucide-react';

const data = [
  { name: 'Mon', views: 4000, reach: 2400 },
  { name: 'Tue', views: 3000, reach: 1398 },
  { name: 'Wed', views: 2000, reach: 9800 },
  { name: 'Thu', views: 2780, reach: 3908 },
  { name: 'Fri', views: 1890, reach: 4800 },
  { name: 'Sat', views: 2390, reach: 3800 },
  { name: 'Sun', views: 3490, reach: 4300 },
];

const StatCard: React.FC<{ title: string; value: string; trend: string; icon: React.ReactNode }> = ({ title, value, trend, icon }) => (
  <div className="bg-[#1e293b]/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-800 rounded-lg text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-400/10 transition-colors">
        {icon}
      </div>
      <span className={`text-xs font-medium ${trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
        {trend}
      </span>
    </div>
    <p className="text-slate-400 text-sm font-medium">{title}</p>
    <h3 className="text-2xl font-bold mt-1">{value}</h3>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Views" value="3.5M" trend="+12.5%" icon={<Eye size={20} />} />
        <StatCard title="Content Pieces" value="608" trend="+24 this week" icon={<TrendingUp size={20} />} />
        <StatCard title="Total Impressions" value="1.8M" trend="+8.2%" icon={<Users size={20} />} />
        <StatCard title="Social Shares" value="2.3K" trend="+4.1%" icon={<Share2 size={20} />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="xl:col-span-2 bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold">Growth Overview</h3>
              <p className="text-sm text-slate-400">Aggregated reach across all channels</p>
            </div>
            <select className="bg-slate-800 border-none rounded-lg text-sm px-3 py-1.5 focus:ring-1 focus:ring-blue-500">
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Area type="monotone" dataKey="views" stroke="#3b82f6" fillOpacity={1} fill="url(#colorViews)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Closing Soon/Alerts */}
        <div className="bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-6">Upcoming Events</h3>
          <div className="space-y-4">
            {[
              { days: '1 DAY', event: 'AI Engineer Europe 2026', type: 'CONFERENCE' },
              { days: '1 DAY', event: 'Techorama Belgium 2026', type: 'CONFERENCE' },
              { days: '2 DAYS', event: 'devConf 2026', type: 'CONFERENCE' },
              { days: '4 DAYS', event: 'AgentCon Toronto 2026', type: 'CONFERENCE' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700">
                <div className="bg-rose-500/10 text-rose-500 text-[10px] font-bold px-2 py-1 rounded w-16 text-center">
                  {item.days}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.event}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{item.type}</p>
                </div>
                <ExternalLink size={14} className="text-slate-600" />
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-2.5 rounded-xl border border-slate-700 text-sm font-medium hover:bg-slate-800 transition-all">
            View All Events
          </button>
        </div>
      </div>

      {/* Recent Content Table */}
      <div className="bg-[#1e293b]/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-bold">Recent Content Activity</h3>
          <button className="text-sm text-blue-400 font-medium hover:underline">View All Posts</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900/50">
              <tr className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Platform</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {MOCK_CONTENT.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-400">{item.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md text-white ${PLATFORM_COLORS[item.platform]}`}>
                      {item.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-1 rounded border border-slate-700 uppercase">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{item.author}</td>
                  <td className="px-6 py-4 text-sm text-slate-400 max-w-md truncate">{item.description}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-500">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
