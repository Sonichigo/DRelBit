
import React, { useState, useEffect } from 'react';
import { 
  Cloud, RefreshCw, Link2, Link2Off, CheckCircle2, 
  AlertCircle, Loader2, Database, Zap, ExternalLink, 
  ShieldCheck, ArrowRight, Settings
} from 'lucide-react';
import { connectorService } from '../services/connectorService';
import { Connector } from '../types';

const DataImport: React.FC = () => {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  useEffect(() => {
    setConnectors(connectorService.getConnectors());
  }, []);

  const handleConnect = async (id: string) => {
    setConnectingId(id);
    await connectorService.connect(id);
    setConnectors(connectorService.getConnectors());
    setConnectingId(null);
  };

  const handleSync = async (id: string) => {
    setSyncingId(id);
    await connectorService.syncData(id);
    setConnectors(connectorService.getConnectors());
    setSyncingId(null);
  };

  const getProviderColor = (provider: string) => {
    switch(provider) {
      case 'google': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'brightedge': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'github': return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold mb-2">Integrations Hub</h2>
          <p className="text-slate-400">Connect directly to source APIs for real-time automated data synchronization.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase">AES-256 Encrypted</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {connectors.map((connector) => (
          <div key={connector.id} className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${getProviderColor(connector.provider)}`}>
                  <Cloud size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{connector.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2 h-2 rounded-full ${connector.status === 'connected' ? 'bg-emerald-500' : 'bg-slate-600'}`}></span>
                    <span className="text-xs text-slate-500 font-medium capitalize">{connector.status}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-slate-600 hover:text-white transition-colors">
                <Settings size={18} />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Last Successful Sync</span>
                <span className="text-slate-300 font-mono">
                  {connector.lastSync ? new Date(connector.lastSync).toLocaleString() : 'Never'}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">API Health</span>
                <span className="text-emerald-400 font-bold">99.9% Uptime</span>
              </div>
            </div>

            <div className="flex gap-3">
              {connector.status === 'connected' ? (
                <>
                  <button 
                    onClick={() => handleSync(connector.id)}
                    disabled={!!syncingId}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                  >
                    {syncingId === connector.id ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                    Sync Now
                  </button>
                  <button 
                    onClick={() => connectorService.disconnect(connector.id).then(() => setConnectors(connectorService.getConnectors()))}
                    className="px-4 py-3 bg-slate-800 hover:bg-rose-500/10 hover:text-rose-500 text-slate-400 rounded-xl transition-all border border-slate-700"
                  >
                    <Link2Off size={18} />
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => handleConnect(connector.id)}
                  disabled={!!connectingId}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all border border-slate-700 flex items-center justify-center gap-2"
                >
                  {connectingId === connector.id ? <Loader2 size={18} className="animate-spin" /> : <Link2 size={18} />}
                  Connect Plugin
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Manual Import Utility */}
        <div className="md:col-span-2 mt-8 p-8 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-800 rounded-xl text-slate-500">
              <Database size={24} />
            </div>
            <div>
              <h4 className="font-bold">Legacy CSV Import</h4>
              <p className="text-sm text-slate-500">Still using spreadsheets? Upload manually to the staging area.</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-sm font-bold rounded-xl transition-all border border-slate-700">
            Open Staging <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
            <Zap size={20} />
          </div>
          <h4 className="font-bold">Real-time Webhooks</h4>
          <p className="text-xs text-slate-400 leading-relaxed">Incoming data is processed via serverless functions and normalized before hitting MongoDB.</p>
        </div>
        <div className="space-y-4">
          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <h4 className="font-bold">Secure Scopes</h4>
          <p className="text-xs text-slate-400 leading-relaxed">We only request read-only access to your Search Console and Analytics data. Your secrets are never stored.</p>
        </div>
        <div className="space-y-4">
          <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
            <RefreshCw size={20} />
          </div>
          <h4 className="font-bold">Auto-Invalidation</h4>
          <p className="text-xs text-slate-400 leading-relaxed">The PostgreSQL cache is automatically flushed whenever a plugin detects a significant data shift.</p>
        </div>
      </div>
    </div>
  );
};

export default DataImport;
