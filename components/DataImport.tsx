
import React, { useState, useEffect } from 'react';
import { 
  Cloud, RefreshCw, Link2, Link2Off, CheckCircle2, 
  AlertCircle, Loader2, Database, Zap, ExternalLink, 
  ShieldCheck, ArrowRight, Settings, Server, Activity, 
  Terminal, Lock, Terminal as TerminalIcon
} from 'lucide-react';
import { connectorService } from '../services/connectorService';
import { dbService } from '../services/databaseService';
import { Connector, ConnectionLog } from '../types';

const DataImport: React.FC = () => {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'plugins' | 'infrastructure'>('plugins');
  const [testLogs, setTestLogs] = useState<ConnectionLog[]>([]);
  const [isTesting, setIsTesting] = useState<string | null>(null);

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

  const runDiagnostics = async (dbId: 'mongodb' | 'postgresql') => {
    setIsTesting(dbId);
    setTestLogs([]);
    const logs = await dbService.testRemoteConnection(dbId);
    setTestLogs(logs);
    setIsTesting(null);
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
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Integrations & Core</h2>
          <p className="text-slate-400">Manage third-party API plugins and core database infrastructure.</p>
        </div>
        <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-800">
          <button 
            onClick={() => setActiveTab('plugins')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'plugins' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-white'}`}
          >
            API Plugins
          </button>
          <button 
            onClick={() => setActiveTab('infrastructure')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'infrastructure' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-white'}`}
          >
            Infrastructure
          </button>
        </div>
      </div>

      {activeTab === 'plugins' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* MongoDB Card */}
            <div className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Database size={120} />
              </div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                  <Database size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">MongoDB Atlas</h3>
                  <p className="text-sm text-slate-400">Primary Document Store (JSON Persistence)</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Connection String (process.env.MONGODB_URI)</label>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-mono text-xs text-blue-400 break-all">
                    {dbService.getEnv().MONGODB_URI}
                  </div>
                </div>

                <div className="flex items-center justify-between py-4 border-y border-slate-800/50">
                  <div className="flex items-center gap-3">
                    <Activity size={18} className="text-emerald-500" />
                    <span className="text-sm font-medium">Cluster Health</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-500">99.99% Online</span>
                </div>

                <button 
                  onClick={() => runDiagnostics('mongodb')}
                  disabled={!!isTesting}
                  className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all border border-slate-700 flex items-center justify-center gap-3"
                >
                  {isTesting === 'mongodb' ? <Loader2 size={20} className="animate-spin" /> : <TerminalIcon size={20} />}
                  Run Connection Diagnostic
                </button>
              </div>
            </div>

            {/* PostgreSQL Card */}
            <div className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap size={120} />
              </div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20">
                  <Zap size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">PostgreSQL (Neon)</h3>
                  <p className="text-sm text-slate-400">Relational Performance Cache</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Connection String (process.env.POSTGRES_URL)</label>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-mono text-xs text-blue-400 break-all">
                    {dbService.getEnv().POSTGRES_URL}
                  </div>
                </div>

                <div className="flex items-center justify-between py-4 border-y border-slate-800/50">
                  <div className="flex items-center gap-3">
                    <Activity size={18} className="text-blue-500" />
                    <span className="text-sm font-medium">Read Latency</span>
                  </div>
                  <span className="text-sm font-bold text-blue-500">12ms (Cache Hit)</span>
                </div>

                <button 
                  onClick={() => runDiagnostics('postgresql')}
                  disabled={!!isTesting}
                  className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all border border-slate-700 flex items-center justify-center gap-3"
                >
                  {isTesting === 'postgresql' ? <Loader2 size={20} className="animate-spin" /> : <TerminalIcon size={20} />}
                  Test Query Pipeline
                </button>
              </div>
            </div>
          </div>

          {/* Diagnostic Console */}
          {(testLogs.length > 0 || isTesting) && (
            <div className="bg-black/80 rounded-3xl border border-slate-800 p-6 font-mono text-sm overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                <Terminal size={16} className="text-slate-500" />
                <span className="text-xs font-bold text-slate-500 uppercase">System Diagnostic Console</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {testLogs.map((log, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                    <span className={
                      log.type === 'success' ? 'text-emerald-400' : 
                      log.type === 'error' ? 'text-rose-400' : 'text-slate-300'
                    }>
                      {log.type === 'success' ? '✓ ' : log.type === 'error' ? '✗ ' : '> '}
                      {log.message}
                    </span>
                  </div>
                ))}
                {isTesting && (
                  <div className="flex gap-4 animate-pulse">
                    <span className="text-slate-600 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                    <span className="text-blue-400">Awaiting remote response...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataImport;
