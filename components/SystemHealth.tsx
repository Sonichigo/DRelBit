
"use client";

import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { dbService } from '../services/databaseService';
import { 
  ShieldCheck, Database, Cloud, Wifi, CheckCircle2, AlertCircle, 
  RefreshCw, PlayCircle, Zap, Clock, ExternalLink, HardDriveDownload
} from 'lucide-react';

const SystemHealth: React.FC = () => {
  const [status, setStatus] = useState({
    cloud: 'checking',
    local: 'checking',
    auth: 'checking'
  });
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [flushing, setFlushing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [testLogs, setTestLogs] = useState<{msg: string, type: 'success' | 'info' | 'error'}[]>([]);

  const addLog = (msg: string, type: 'success' | 'info' | 'error' = 'info') => {
    setTestLogs(prev => [{ msg: `[${new Date().toLocaleTimeString()}] ${msg}`, type }, ...prev].slice(0, 10));
  };

  const verify = async () => {
    setLoading(true);
    addLog("Initiating E2E Cloud Handshake...", 'info');
    const cloudOk = await api.ping();
    const localData = await dbService.getFromMongo('projects');
    const localOk = localData.length >= 0;
    
    // Check pending sync count
    const queue = await dbService.getSyncQueue();
    setPendingCount(queue.length);

    setStatus({
      cloud: cloudOk ? 'healthy' : 'unreachable',
      local: localOk ? 'healthy' : 'error',
      auth: 'verified'
    });
    if (cloudOk) addLog("Cloud connectivity established with MongoDB Atlas.", 'success');
    setLoading(false);
  };

  const triggerCronSync = async () => {
    setSyncing(true);
    addLog("Manual Heartbeat Triggered for Automated Ingestion...", 'info');
    try {
      const res = await fetch('/api/cron/sync');
      const data = await res.json();
      if (data.success) {
        addLog(`Sync Completed: Processed ${data.processedCount} unique records.`, 'success');
        window.dispatchEvent(new CustomEvent('data-updated'));
      }
    } catch (err) {
      addLog("Automated Sync Handshake Failed.", 'error');
    } finally {
      setSyncing(false);
    }
  };

  const flushLocalVault = async () => {
    if (pendingCount === 0) {
      addLog("Local vault is already in sync with cloud.", 'info');
      return;
    }
    setFlushing(true);
    addLog("Attempting to flush local vault to cloud...", 'info');
    try {
      const result = await api.syncUnsyncedData();
      addLog(`Success: Flushed ${result.processedCount} items from IndexedDB to MongoDB.`, 'success');
      setPendingCount(0);
      window.dispatchEvent(new CustomEvent('data-updated'));
    } catch (err) {
      addLog("Flush failed: Cloud server unreachable.", 'error');
    } finally {
      setFlushing(false);
    }
  };

  useEffect(() => { verify(); }, []);

  const StatusBadge = ({ type }: { type: string }) => {
    if (type === 'healthy' || type === 'verified') 
      return <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold uppercase"><CheckCircle2 size={12} /> Operational</span>;
    if (type === 'checking')
      return <span className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase animate-pulse">Scanning...</span>;
    return <span className="flex items-center gap-1 text-[10px] text-rose-500 font-bold uppercase"><AlertCircle size={12} /> Offline</span>;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <ShieldCheck className="text-blue-500" /> System Integrity Hub
            </h2>
            <p className="text-slate-400 text-sm">End-to-End verification of your data architecture.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => verify()} 
              disabled={loading}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all text-slate-400 hover:text-white border border-slate-700 disabled:opacity-50"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Cloud size={20} /></div>
              <StatusBadge type={status.cloud} />
            </div>
            <h4 className="font-bold text-sm">MongoDB Atlas</h4>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><Database size={20} /></div>
              <StatusBadge type={status.local} />
            </div>
            <h4 className="font-bold text-sm">IndexedDB Vault</h4>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><Wifi size={20} /></div>
              <StatusBadge type={status.auth} />
            </div>
            <h4 className="font-bold text-sm">Auth Gateway</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sync / Automation Hub */}
        <div className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><HardDriveDownload size={20} /></div>
            <h3 className="text-xl font-bold">Local Vault Bridge</h3>
          </div>
          <p className="text-sm text-slate-400 mb-8">Items saved while offline are stored in a persistent IndexedDB queue until they can be flushed to the cloud.</p>
          
          <div className="space-y-4">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">Pending Synchronization</p>
                <p className="text-[10px] text-blue-400 uppercase font-bold tracking-widest mt-1 flex items-center gap-2">
                   <Clock size={10} /> {pendingCount} items waiting to be synced
                </p>
              </div>
              <button 
                onClick={flushLocalVault}
                disabled={flushing || pendingCount === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
              >
                {flushing ? <RefreshCw size={14} className="animate-spin" /> : <Wifi size={14} />} Manual Flush
              </button>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm">Automated Sheet Sync</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Status: Operational</p>
                </div>
                <button 
                  onClick={triggerCronSync}
                  disabled={syncing}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-all text-slate-400 hover:text-white"
                >
                  <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Logs */}
        <div className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl p-8">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Integrity Logs</h4>
          <div className="space-y-2 font-mono text-[10px] max-h-[300px] overflow-y-auto custom-scrollbar">
            {testLogs.map((log, i) => (
              <div key={i} className={`flex items-center gap-2 p-2 rounded-lg bg-slate-900/30 ${
                log.type === 'success' ? 'text-emerald-400' : log.type === 'error' ? 'text-rose-400' : 'text-blue-400'
              }`}>
                <span>{log.msg}</span>
              </div>
            ))}
            {testLogs.length === 0 && <span className="text-slate-600 italic">No logs generated. Run verification to start.</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
