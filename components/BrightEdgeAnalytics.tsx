
import React, { useState, useMemo } from 'react';
import { 
  Globe, Search, TrendingUp, Layers, Filter, CheckCircle2, ChevronRight, BarChart2, ArrowUp, ArrowDown 
} from 'lucide-react';
import AdvancedFilter from './AdvancedFilter';
import { BrightEdgePage, FilterRule, SortConfig } from '../types';

const MOCK_PAGES: BrightEdgePage[] = [
  { url: '/docs/api-getting-started', rank: 1.2, keywords: 450, traffic: 4200, gscImpressions: 240000, ctr: 12.4, value: 4200, group: 'Documentation', status: 'Optimal' },
  { url: '/blog/nextjs-15-overview', rank: 3.5, keywords: 120, traffic: 1100, gscImpressions: 85000, ctr: 4.2, value: 1100, group: 'Blog', status: 'Rising' },
  { url: '/product/enterprise-tier', rank: 8.2, keywords: 15, traffic: 850, gscImpressions: 12000, ctr: 0.8, value: 850, group: 'Product', status: 'Alert' },
  { url: '/docs/authentication', rank: 2.1, keywords: 210, traffic: 2400, gscImpressions: 110000, ctr: 8.5, value: 2400, group: 'Documentation', status: 'Stable' },
  { url: '/blog/database-scaling', rank: 12.4, keywords: 8, traffic: 150, gscImpressions: 4000, ctr: 1.2, value: 150, group: 'Blog', status: 'Alert' },
  { url: '/case-studies/redis-migration', rank: 4.8, keywords: 65, traffic: 920, gscImpressions: 15000, ctr: 6.1, value: 920, group: 'Case Studies', status: 'Stable' },
];

const BrightEdgeAnalytics: React.FC = () => {
  const [rules, setRules] = useState<FilterRule[]>([]);
  const [sort, setSort] = useState<SortConfig>({ field: 'traffic', direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedData = useMemo(() => {
    let data = [...MOCK_PAGES];

    // Search filter
    if (searchQuery) {
      data = data.filter(p => p.url.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Advanced rules
    rules.forEach(rule => {
      data = data.filter(item => {
        const val = (item as any)[rule.field];
        if (rule.operator === 'contains') return String(val).toLowerCase().includes(String(rule.value).toLowerCase());
        if (rule.operator === 'equals') return String(val) === String(rule.value);
        if (rule.operator === 'greaterThan') return Number(val) > Number(rule.value);
        if (rule.operator === 'lessThan') return Number(val) < Number(rule.value);
        if (rule.operator === 'between') return Number(val) >= Number(rule.value) && Number(val) <= Number(rule.valueEnd);
        return true;
      });
    });

    // Sorting
    data.sort((a: any, b: any) => {
      const fieldA = a[sort.field];
      const fieldB = b[sort.field];
      if (typeof fieldA === 'string') {
        return sort.direction === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      }
      return sort.direction === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    });

    return data;
  }, [rules, sort, searchQuery]);

  const toggleSort = (field: string) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const filterFields = [
    { label: 'Page URL', value: 'url', type: 'string' as const },
    { label: 'Rank', value: 'rank', type: 'number' as const },
    { label: 'CTR (%)', value: 'ctr', type: 'number' as const },
    { label: 'GSC Impressions', value: 'gscImpressions', type: 'number' as const },
    { label: 'Traffic Value', value: 'value', type: 'number' as const },
    { label: 'Page Group', value: 'group', type: 'select' as const, options: ['Documentation', 'Blog', 'Case Studies', 'Product'] },
    { label: 'Status', value: 'status', type: 'select' as const, options: ['Optimal', 'Rising', 'Stable', 'Alert'] },
  ];

  const SortIcon = ({ field }: { field: string }) => {
    if (sort.field !== field) return null;
    return sort.direction === 'desc' ? <ArrowDown size={14} className="ml-1" /> : <ArrowUp size={14} className="ml-1" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Globe className="text-emerald-500" /> BrightEdge Intelligence
          </h2>
          <p className="text-slate-400 text-sm">Unified GSC data with Page Group tracking and keyword rankings</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm transition-colors font-medium">
            <Layers size={18} />
            <span>Create Page Group</span>
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
                placeholder="Search by URL path..." 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-lg border border-slate-800">
             <span className="text-[10px] font-bold text-slate-500 uppercase px-2">Quick Stats:</span>
             <div className="flex gap-4 px-2">
               <div className="flex flex-col">
                 <span className="text-[10px] text-slate-500 font-bold">AVG RANK</span>
                 <span className="text-sm font-bold text-emerald-400">{(filteredAndSortedData.reduce((acc, curr) => acc + curr.rank, 0) / filteredAndSortedData.length || 0).toFixed(1)}</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] text-slate-500 font-bold">TOTAL GSC</span>
                 <span className="text-sm font-bold">{(filteredAndSortedData.reduce((acc, curr) => acc + curr.gscImpressions, 0) / 1000).toFixed(1)}k</span>
               </div>
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900/50">
              <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('url')}>
                  <div className="flex items-center">Page Path <SortIcon field="url" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('rank')}>
                  <div className="flex items-center">Avg Rank <SortIcon field="rank" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('gscImpressions')}>
                  <div className="flex items-center">Impressions (GSC) <SortIcon field="gscImpressions" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('ctr')}>
                  <div className="flex items-center">CTR <SortIcon field="ctr" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('value')}>
                  <div className="flex items-center">Traffic Value <SortIcon field="value" /></div>
                </th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredAndSortedData.length > 0 ? (
                filteredAndSortedData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                       <div className="flex flex-col">
                         <span className="text-xs font-medium text-blue-400 font-mono">{row.url}</span>
                         <span className="text-[10px] text-slate-500">{row.group}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold">{row.rank}</td>
                    <td className="px-6 py-4 text-sm">{row.gscImpressions.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">{row.ctr}%</td>
                    <td className="px-6 py-4 text-sm text-emerald-400 font-medium">${row.value.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        row.status === 'Optimal' ? 'bg-emerald-500/10 text-emerald-500' :
                        row.status === 'Alert' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No results match your criteria. Try adjusting your filters.
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
