
import React, { useState, useRef } from 'react';
import { 
  Upload, FileSpreadsheet, CheckCircle2, Loader2, Info, AlertCircle, X
} from 'lucide-react';
import { api } from '../services/apiService';
import { Project, ContentItem } from '../types';
import Toast, { ToastType } from './Toast';

interface DataImportProps {
  project: Project | null;
}

const DataImport: React.FC<DataImportProps> = ({ project }) => {
  const [selectedType, setSelectedType] = useState<'GSC' | 'GA4' | 'BRIGHTEDGE' | 'SEO'>('SEO');
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: ToastType) => setToast({ message, type });

  const parseCSV = (text: string): any[] => {
    // Basic CSV parser that handles quoted strings (common in SEO keywords column)
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));
    
    return lines.slice(1).map(line => {
      // Split by comma but ignore commas inside quotes
      const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      const obj: any = {};
      headers.forEach((header, i) => {
        let val = (values[i] || '').trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        obj[header] = val;
      });
      return obj;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !project) return;
    setUploading(true);
    showToast("Committing data to Atlas cluster...", "loading");
    
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      
      const contentItems: ContentItem[] = rows.map((row, idx) => {
        const getVal = (keys: string[]) => {
          const key = Object.keys(row).find(k => keys.includes(k));
          return row[key || ''] || '0';
        };

        const parseNum = (v: string) => Math.abs(parseFloat(String(v || '0').replace(/[^\d.-]/g, ''))) || 0;

        return {
          id: `direct-${Date.now()}-${idx}`,
          projectId: project.id,
          date: row.date || new Date().toISOString().split('T')[0],
          platform: selectedType,
          type: 'SEO Audit',
          author: 'System',
          description: row.page || row.url || row.description || 'Imported SEO Entry',
          impressions: parseNum(getVal(['impressionschange', 'impressions', 'reach'])),
          views: parseNum(getVal(['clickschange', 'views', 'clicks'])),
          engagement: parseNum(getVal(['ctrchange', 'tracked', 'engagement']))
        };
      });

      await api.uploadContent(contentItems);
      showToast("Data commitment successful.", "success");
      setSuccess(true);
      setFile(null);
      window.dispatchEvent(new CustomEvent('data-updated'));
    } catch (err) {
      showToast("Mapping failed. Check header alignment.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold">Data Ingestion</h2>
          <p className="text-slate-400">Directly ingest CSV logs into your MongoDB workspace.</p>
        </div>
        <div className="bg-slate-800/50 p-1 rounded-xl border border-slate-800 flex gap-1">
          {['GSC', 'GA4', 'SEO'].map(t => (
            <button key={t} onClick={() => setSelectedType(t as any)} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all ${selectedType === t ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl p-12 text-center relative overflow-hidden">
        <div onClick={() => !uploading && fileInputRef.current?.click()} className={`border-2 border-dashed rounded-3xl p-16 transition-all cursor-pointer ${file ? 'bg-blue-500/5 border-blue-500' : 'border-slate-800 bg-slate-900/50'}`}>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv" />
          <FileSpreadsheet size={40} className={`mx-auto mb-4 ${file ? 'text-blue-500' : 'text-slate-600'}`} />
          <h3 className="text-xl font-bold">{file ? file.name : "Select SEO Log"}</h3>
        </div>

        {file && !success && (
          <button onClick={handleUpload} disabled={uploading} className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3">
            {uploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />} Commit Workspace
          </button>
        )}
      </div>
    </div>
  );
};

export default DataImport;
