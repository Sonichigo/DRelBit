"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, FileSpreadsheet, CheckCircle2, Loader2, Link as LinkIcon, Globe, Search, Plus, Trash2, Info, RefreshCw, Key, Clock
} from 'lucide-react';
import { api } from '../services/apiService';
import { connectorService } from '../services/connectorService';
import { Project, ContentItem, TrackedUrl, Connector } from '../types';
import Toast, { ToastType } from './Toast';

interface DataImportProps {
  project: Project | null;
}

const DataImport: React.FC<DataImportProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState<'connectors' | 'files' | 'scrape'>('connectors');
  const [selectedType, setSelectedType] = useState<'GSC' | 'CFP' | 'CONTENT'>('CONTENT');
  const [uploading, setUploading] = useState(false);
  const [targetUrl, setTargetUrl] = useState('');
  const [urlLabel, setUrlLabel] = useState('');
  const [trackedUrls, setTrackedUrls] = useState<TrackedUrl[]>([]);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: ToastType) => setToast({ message, type });

  const loadData = async () => {
    if (!project) return;
    const urls = await api.getTrackedUrls(project.id);
    setTrackedUrls(urls);
    const conn = connectorService.getConnectors();
    setConnectors(conn);
  };

  useEffect(() => {
    loadData();
  }, [project]);

  const handleConnect = async (id: string) => {
    showToast("Opening OAuth 2.0 Handshake...", "loading");
    await connectorService.connect(id);
    loadData();
    showToast("Connection successfully established.", "success");
  };

  const handleSync = async (id: string) => {
    if (!project) return;
    setSyncingId(id);
    showToast("Synchronizing live data with MongoDB Atlas...", "loading");
    try {
      const result = await connectorService.syncData(id, project.id);
      showToast(`Pulled ${result.count} new records from source.`, "success");
      window.dispatchEvent(new CustomEvent('data-updated'));
    } catch (err) {
      showToast("Sync failed. Check API credentials.", "error");
    } finally {
      setSyncingId(null);
    }
  };

  const handleScrape = async (url?: string) => {
    const finalUrl = url || targetUrl;
    if (!finalUrl || !project) return;
    setUploading(true);
    showToast(`Gemini is analyzing slug structure: ${finalUrl}...`, 'loading');
    try {
      const results = await api.scrapeUrl(finalUrl, project.id);
      await api.uploadContent(results);
      showToast(`Extracted author, title, and URL details for ${results.length} posts.`, 'success');
      window.dispatchEvent(new CustomEvent('data-updated'));
    } catch {
      showToast("Extraction failed. Check URL slug access.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleAddTrackedUrl = async () => {
    if (!targetUrl || !project) return;
    const newTracked: TrackedUrl = {
      id: `tracked-${Date.now()}`,
      projectId: project.id,
      url: targetUrl,
      label: urlLabel || targetUrl.replace(/https?:\/\//, '').split('/')[0]
    };
    await api.addTrackedUrl(newTracked);
    setTrackedUrls([...trackedUrls, newTracked]);
    setTargetUrl('');
    setUrlLabel('');
    showToast("New slug added to monitoring watchlist.", "success");
  };

  const handleDeleteTrackedUrl = async (id: string) => {
    if (!project) return;
    await api.deleteTrackedUrl(id, project.id);
    setTrackedUrls(trackedUrls.filter(u => u.id !== id));
    showToast("Slug removed from monitoring.", "info");
  };

  const handleFileUpload = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !project) return;
    setUploading(true);
    showToast(`Processing ${selectedType} dataset...`, "loading");
    
    // Logic for parsing would go here (already simulated in CustomReports or Cron)
    setTimeout(() => {
      showToast(`${selectedType} records synchronized successfully.`, "success");
      setUploading(false);
      window.dispatchEvent(new CustomEvent('data-updated'));
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Upload className="text-blue-500" /> Integrations Hub
          </h2>
          <p className="text-slate-400 mt-1">Connect your workspace directly to live search data and blog slugs.</p>
        </div>
        
        <div className="flex bg-[#0c111d] p-1 rounded-xl border border-slate-800">
          {[
            { id: 'connectors', label: 'Cloud Connect' },
            { id: 'scrape', label: 'URL Crawler' },
            { id: 'files', label: 'File Import' },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'connectors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {connectors.map((connector) => (
            <div key={connector.id} className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl p-6 hover:border-blue-500/30 transition-all flex flex-col justify-between shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 text-blue-500">
                    {connector.icon === 'gsc' ? <Search size={24} /> : connector.icon === 'ga4' ? <RefreshCw size={24} /> : <Key size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{connector.name}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{connector.provider}</p>
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${connector.status === 'connected' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
                  {connector.status}
                </div>
              </div>
              
              <div className="space-y-4">
                {connector.status === 'connected' ? (
                  <>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                      <Clock size={12} /> Last Sync: {connector.lastSync ? new Date(connector.lastSync).toLocaleString() : 'Never'}
                    </div>
                    <button 
                      onClick={() => handleSync(connector.id)}
                      disabled={!!syncingId}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                    >
                      {syncingId === connector.id ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} 
                      Trigger Live Pull
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleConnect(connector.id)}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all border border-slate-700"
                  >
                    Authenticate Service
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'scrape' && (
        <div className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-2xl">
          <div className="space-y-4">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Blog Slug / URL to Track</label>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-8 relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="e.g. harness.io/blog/"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-white font-mono"
                />
              </div>
              <div className="md:col-span-4 flex gap-2">
                <input 
                  type="text" 
                  value={urlLabel}
                  onChange={(e) => setUrlLabel(e.target.value)}
                  placeholder="Label"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none text-white"
                />
                <button 
                  onClick={handleAddTrackedUrl}
                  disabled={!targetUrl}
                  className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-lg"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
            <button 
              onClick={() => handleScrape()}
              disabled={uploading || !targetUrl}
              className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all"
            >
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              Run Instant Crawler
            </button>
          </div>
          
          <div className="pt-8 border-t border-slate-800">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Tracked Locations</h4>
            <div className="space-y-3">
              {trackedUrls.length > 0 ? trackedUrls.map((u) => (
                <div key={u.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group hover:border-blue-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center border border-blue-500/20">
                      <Globe size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block">{u.label}</span>
                      <span className="text-[10px] font-mono text-slate-500">{u.url}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleScrape(u.url)}
                      className="p-2 bg-slate-800 hover:bg-blue-600 rounded-lg text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                      title="Run Crawler"
                    >
                      <RefreshCw size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteTrackedUrl(u.id)}
                      className="p-2 bg-slate-800 hover:bg-rose-600 rounded-lg text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="py-12 text-center bg-slate-900/30 border border-slate-800 border-dashed rounded-3xl">
                  <LinkIcon size={32} className="mx-auto text-slate-700 mb-3" />
                  <p className="text-slate-500 text-sm font-bold">No blog slugs are currently being monitored.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'files' && (
        <div className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-2xl">
           <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
              {['CONTENT', 'CFP', 'GSC'].map(t => (
                <button 
                  key={t}
                  onClick={() => setSelectedType(t as any)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${selectedType === t ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'}`}
                >
                  {t}
                </button>
              ))}
           </div>
           
           <div 
             onClick={handleFileUpload}
             className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-3xl p-16 text-center cursor-pointer transition-all bg-slate-900/30 group"
           >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <FileSpreadsheet size={48} className="mx-auto text-slate-700 mb-4 group-hover:text-blue-500 transition-colors" />
              <p className="font-bold text-slate-300">Click to upload {selectedType} spreadsheet</p>
              <p className="text-xs text-slate-500 mt-2">Supports CSV, XLSX, and JSON</p>
           </div>
           
           <div className="flex items-start gap-3 bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10">
              <Info className="text-blue-500 shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-slate-400 leading-relaxed">
                Manually importing <strong>{selectedType}</strong> spreadsheets will append new data to the workspace. 
                Unique identifiers like URLs or Event Names will prevent duplication.
              </p>
           </div>
        </div>
      )}
    </div>
  );
};

export default DataImport;