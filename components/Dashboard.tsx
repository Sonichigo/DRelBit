
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_CONTENT, PLATFORM_COLORS } from '../constants';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Eye, TrendingUp, Users, Share2, MoreVertical, ExternalLink, 
  Zap, Database, GripVertical, Settings2, EyeOff, Check, X,
  LayoutGrid, PanelRightClose, PanelRightOpen
} from 'lucide-react';
import { dbService } from '../services/databaseService';
import { ContentItem, WidgetConfig } from '../types';

const CHART_DATA = [
  { name: 'Mon', views: 4000, reach: 2400 },
  { name: 'Tue', views: 3000, reach: 1398 },
  { name: 'Wed', views: 2000, reach: 9800 },
  { name: 'Thu', views: 2780, reach: 3908 },
  { name: 'Fri', views: 1890, reach: 4800 },
  { name: 'Sat', views: 2390, reach: 3800 },
  { name: 'Sun', views: 3490, reach: 4300 },
];

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'stat-views', title: 'Total Views', visible: true, order: 0, type: 'stat' },
  { id: 'stat-content', title: 'Content Pieces', visible: true, order: 1, type: 'stat' },
  { id: 'stat-impressions', title: 'Total Impressions', visible: true, order: 2, type: 'stat' },
  { id: 'stat-shares', title: 'Social Shares', visible: true, order: 3, type: 'stat' },
  { id: 'chart-growth', title: 'Growth Overview', visible: true, order: 4, type: 'chart' },
  { id: 'list-events', title: 'Upcoming Events', visible: true, order: 5, type: 'list' },
  { id: 'table-content', title: 'Recent Content Activity', visible: true, order: 6, type: 'table' },
];

const StatCard: React.FC<{ 
  title: string; value: string; trend: string; icon: React.ReactNode; 
  isEditing?: boolean; onHide?: () => void;
  dragHandlers?: any;
}> = ({ title, value, trend, icon, isEditing, onHide, dragHandlers }) => (
  <div 
    className={`bg-[#1e293b]/50 border rounded-xl p-5 transition-all group relative overflow-hidden ${
      isEditing ? 'border-blue-500/50 border-dashed cursor-move scale-[0.98]' : 'border-slate-800 hover:border-slate-700'
    }`}
    {...dragHandlers}
  >
    {isEditing && (
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <button onClick={(e) => { e.stopPropagation(); onHide?.(); }} className="p-1.5 bg-slate-900 rounded-md text-slate-400 hover:text-rose-400 border border-slate-700">
          <EyeOff size={14} />
        </button>
        <div className="p-1.5 bg-slate-900 rounded-md text-slate-400 border border-slate-700 cursor-grab active:cursor-grabbing">
          <GripVertical size={14} />
        </div>
      </div>
    )}
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-800 rounded-lg text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-400/10 transition-colors">
        {icon}
      </div>
      {!isEditing && (
        <span className={`text-xs font-medium ${trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trend}
        </span>
      )}
    </div>
    <p className="text-slate-400 text-sm font-medium">{title}</p>
    <h3 className="text-2xl font-bold mt-1">{value}</h3>
  </div>
);

const Dashboard: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [dataSource, setDataSource] = useState<'postgres' | 'mongo'>('mongo');
  const [loading, setLoading] = useState(true);
  const [widgets, setWidgets] = useState<WidgetConfig[]>(DEFAULT_WIDGETS);
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: dbData, source } = await dbService.getCachedData('content');
      const savedWidgets = await dbService.getPreference('dashboard_layout');
      
      if (savedWidgets) {
        setWidgets(savedWidgets);
      }

      if (dbData.length === 0) {
        await dbService.saveToMongo('content', MOCK_CONTENT);
        const { data: reFetched, source: reSource } = await dbService.getCachedData('content');
        setContent(reFetched);
        setDataSource(reSource);
      } else {
        setContent(dbData);
        setDataSource(source);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const saveLayout = async (newWidgets: WidgetConfig[]) => {
    setWidgets(newWidgets);
    await dbService.savePreference('dashboard_layout', newWidgets);
  };

  const toggleWidgetVisibility = (id: string) => {
    const newWidgets = widgets.map(w => w.id === id ? { ...w, visible: !w.visible } : w);
    saveLayout(newWidgets);
  };

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const newList = [...widgets];
      const draggedItemContent = newList[dragItem.current];
      newList.splice(dragItem.current, 1);
      newList.splice(dragOverItem.current, 0, draggedItemContent);
      
      // Update order property
      const updatedList = newList.map((item, index) => ({ ...item, order: index }));
      saveLayout(updatedList);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const getWidgetIcon = (id: string) => {
    switch (id) {
      case 'stat-views': return <Eye size={20} />;
      case 'stat-content': return <TrendingUp size={20} />;
      case 'stat-impressions': return <Users size={20} />;
      case 'stat-shares': return <Share2 size={20} />;
      default: return <LayoutGrid size={20} />;
    }
  };

  const visibleWidgets = widgets.filter(w => w.visible).sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6 relative">
      {/* Configuration Header */}
      <div className="flex items-center justify-between bg-slate-800/20 p-4 rounded-2xl border border-slate-800/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <LayoutGrid className="text-blue-500" size={20} />
            <h2 className="font-bold text-lg">Personalized Workspace</h2>
          </div>
          <div className="h-4 w-px bg-slate-700 hidden md:block"></div>
          <div className="hidden md:flex items-center gap-2">
             <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
               dataSource === 'postgres' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
             }`}>
               {dataSource === 'postgres' ? <Zap size={10} /> : <Database size={10} />}
               {dataSource === 'postgres' ? 'Fast Cache' : 'Mongo Persistent'}
             </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-lg transition-colors border ${isSidebarOpen ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
            title="Widget Library"
          >
            <PanelRightOpen size={20} />
          </button>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              isEditing ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            {isEditing ? <Check size={18} /> : <Settings2 size={18} />}
            <span>{isEditing ? 'Finish Layout' : 'Customize'}</span>
          </button>
        </div>
      </div>

      {/* Widget Library Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-y-0 right-0 w-80 bg-[#0f172a] border-l border-slate-800 z-50 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-lg">Widget Library</h3>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500">
              <PanelRightClose size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Available Components</p>
            {widgets.map((widget) => (
              <div 
                key={widget.id} 
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  widget.visible ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-900 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${widget.visible ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                    {getWidgetIcon(widget.id)}
                  </div>
                  <span className="text-sm font-medium">{widget.title}</span>
                </div>
                <button 
                  onClick={() => toggleWidgetVisibility(widget.id)}
                  className={`p-1.5 rounded-md transition-colors ${
                    widget.visible ? 'text-emerald-400 hover:bg-emerald-400/10' : 'text-slate-600 hover:bg-slate-800'
                  }`}
                >
                  {widget.visible ? <Check size={18} /> : <Plus size={18} />}
                </button>
              </div>
            ))}
          </div>
          <div className="p-6 bg-slate-900/50 border-t border-slate-800">
            <button 
              onClick={() => { setWidgets(DEFAULT_WIDGETS); saveLayout(DEFAULT_WIDGETS); }}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold rounded-lg transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      )}

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleWidgets.filter(w => w.type === 'stat').map((widget, idx) => (
          <div 
            key={widget.id} 
            draggable={isEditing}
            onDragStart={() => handleDragStart(widgets.findIndex(w => w.id === widget.id))}
            onDragEnter={() => handleDragEnter(widgets.findIndex(w => w.id === widget.id))}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
          >
            <StatCard 
              title={widget.title} 
              value={widget.id === 'stat-content' ? content.length.toString() : 
                     widget.id === 'stat-views' ? '3.5M' : 
                     widget.id === 'stat-impressions' ? '1.8M' : '2.3K'} 
              trend="+12.5%" 
              icon={getWidgetIcon(widget.id)}
              isEditing={isEditing}
              onHide={() => toggleWidgetVisibility(widget.id)}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Chart */}
        {visibleWidgets.find(w => w.id === 'chart-growth') && (
          <div 
            draggable={isEditing}
            onDragStart={() => handleDragStart(widgets.findIndex(w => w.id === 'chart-growth'))}
            onDragEnter={() => handleDragEnter(widgets.findIndex(w => w.id === 'chart-growth'))}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            className={`xl:col-span-2 bg-[#1e293b]/50 border rounded-2xl p-6 relative transition-all ${
              isEditing ? 'border-blue-500/50 border-dashed scale-[0.99] cursor-move' : 'border-slate-800'
            }`}
          >
            {isEditing && (
              <div className="absolute top-2 right-2 flex gap-1 z-10">
                <button onClick={() => toggleWidgetVisibility('chart-growth')} className="p-1.5 bg-slate-900 rounded-md text-slate-400 hover:text-rose-400 border border-slate-700">
                  <EyeOff size={14} />
                </button>
                <div className="p-1.5 bg-slate-900 rounded-md text-slate-400 border border-slate-700">
                  <GripVertical size={14} />
                </div>
              </div>
            )}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold">Growth Overview</h3>
                <p className="text-sm text-slate-400">Aggregated reach across all channels</p>
              </div>
              <select className="bg-slate-800 border-none rounded-lg text-sm px-3 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none">
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA}>
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
        )}

        {/* Closing Soon/Alerts */}
        {visibleWidgets.find(w => w.id === 'list-events') && (
          <div 
            draggable={isEditing}
            onDragStart={() => handleDragStart(widgets.findIndex(w => w.id === 'list-events'))}
            onDragEnter={() => handleDragEnter(widgets.findIndex(w => w.id === 'list-events'))}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            className={`bg-[#1e293b]/50 border rounded-2xl p-6 relative transition-all ${
              isEditing ? 'border-blue-500/50 border-dashed scale-[0.99] cursor-move' : 'border-slate-800'
            }`}
          >
            {isEditing && (
              <div className="absolute top-2 right-2 flex gap-1 z-10">
                <button onClick={() => toggleWidgetVisibility('list-events')} className="p-1.5 bg-slate-900 rounded-md text-slate-400 hover:text-rose-400 border border-slate-700">
                  <EyeOff size={14} />
                </button>
                <div className="p-1.5 bg-slate-900 rounded-md text-slate-400 border border-slate-700">
                  <GripVertical size={14} />
                </div>
              </div>
            )}
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
        )}
      </div>

      {/* Recent Content Table */}
      {visibleWidgets.find(w => w.id === 'table-content') && (
        <div 
          draggable={isEditing}
          onDragStart={() => handleDragStart(widgets.findIndex(w => w.id === 'table-content'))}
          onDragEnter={() => handleDragEnter(widgets.findIndex(w => w.id === 'table-content'))}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
          className={`bg-[#1e293b]/50 border rounded-2xl overflow-hidden relative transition-all ${
            isEditing ? 'border-blue-500/50 border-dashed scale-[0.99] cursor-move' : 'border-slate-800'
          }`}
        >
          {isEditing && (
            <div className="absolute top-2 right-2 flex gap-1 z-10">
              <button onClick={() => toggleWidgetVisibility('table-content')} className="p-1.5 bg-slate-900 rounded-md text-slate-400 hover:text-rose-400 border border-slate-700">
                <EyeOff size={14} />
              </button>
              <div className="p-1.5 bg-slate-900 rounded-md text-slate-400 border border-slate-700">
                <GripVertical size={14} />
              </div>
            </div>
          )}
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold">Recent Content Activity</h3>
            <div className="flex items-center gap-4">
               {loading && <Loader2 size={16} className="animate-spin text-blue-500" />}
               <button className="text-sm text-blue-400 font-medium hover:underline">View All Posts</button>
            </div>
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
                {content.map((item) => (
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
      )}
    </div>
  );
};

const Loader2 = ({ size, className }: { size: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const Plus = ({ size, className }: { size: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export default Dashboard;
