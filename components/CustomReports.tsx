
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, FileText, Download, Trash2, Calendar, Loader2, X, FileSpreadsheet, Info, Upload, Eye, CheckCircle2, AlertCircle, FileUp
} from 'lucide-react';
import { api } from '../services/apiService';
import { Project, Report, ContentItem } from '../types';
import * as XLSX from 'xlsx';
import Toast, { ToastType } from './Toast';

interface CustomReportsProps {
  project: Project | null;
}

const CustomReports: React.FC<CustomReportsProps> = ({ project }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportName, setReportName] = useState('');
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: ToastType) => setToast({ message, type });

  const load = async () => {
    if (!project) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.getReports(project.id);
      setReports(res || []);
    } catch (err) {
      console.error("Report sync failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [project]);

  const handleOpenImportModal = (report: Report) => {
    setSelectedReport(report);
    setFile(null);
    setIsImportModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUploadData = async () => {
    if (!file || !project || !selectedReport) return;
    setImporting(true);
    showToast("Normalizing unique URLs...", "loading");

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array', cellDates: true });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      // Deduplicate locally first based on URL (description)
      const uniqueItemsMap = new Map<string, ContentItem>();

      jsonData.forEach((row, idx) => {
        const findVal = (keys: string[]) => {
          const key = Object.keys(row).find(k => {
            const clean = k.toLowerCase().replace(/[^a-z0-9]/g, '');
            return keys.some(t => clean.includes(t.replace(/[^a-z0-9]/g, '')));
          });
          return key ? row[key] : null;
        };

        const parseNum = (val: any) => {
          if (typeof val === 'number') return val;
          const n = parseFloat(String(val || '0').replace(/[^\d.-]/g, ''));
          return isNaN(n) ? 0 : n;
        };

        const desc = findVal(['page', 'url', 'description', 'title']) || `Untitled-${idx}`;
        
        const item: ContentItem = {
          id: `rep-import-${Date.now()}-${idx}`,
          projectId: project.id,
          date: findVal(['date', 'timestamp', 'day']) || new Date().toISOString().split('T')[0],
          platform: 'SEO',
          type: findVal(['type', 'format']) || 'Imported Content',
          author: findVal(['author', 'owner']) || 'System',
          description: desc,
          impressions: Math.abs(parseNum(findVal(['impressions', 'reach', 'impressionschange']))),
          views: Math.abs(parseNum(findVal(['views', 'clicks', 'clickschange']))),
          engagement: Math.abs(parseNum(findVal(['engagement', 'ctr', 'ctrchange', 'tracked'])))
        };

        // Always use the latest entry in the sheet for a specific URL
        uniqueItemsMap.set(desc, item);
      });

      const finalItems = Array.from(uniqueItemsMap.values());

      await api.uploadContent(finalItems);
      showToast(`Sync complete: ${finalItems.length} unique URLs updated.`, "success");
      setIsImportModalOpen(false);
      load();
      window.dispatchEvent(new CustomEvent('data-updated'));
    } catch (err) {
      showToast("Data mismatch detected in headers.", "error");
    } finally {
      setImporting(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !reportName) return;
    const newReport: Report = {
      id: `rep-${Date.now()}`,
      projectId: project.id,
      title: reportName,
      type: 'SEO Performance Rollup',
      createdAt: new Date().toISOString().split('T')[0],
      sources: ['GSC', 'SEO'],
      metrics: ['Views', 'Impressions', 'CTR']
    };
    await api.saveReport(newReport);
    setReports([...reports, newReport]);
    setReportName('');
    setIsModalOpen(false);
    showToast("Report Blueprint added.", "success");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this report blueprint?")) return;
    await api.deleteReport(id);
    setReports(reports.filter(r => r.id !== id));
  };

  const handleExport = async (report: Report) => {
    setExporting(report.id);
    const data = await api.getContent(report.projectId);
    const headers = ['Date', 'Platform', 'Description', 'Impressions', 'Views', 'Engagement'];
    const csv = [headers.join(','), ...data.map(i => [i.date, i.platform, `"${i.description}"`, i.impressions, i.views, i.engagement].join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title}.csv`;
    a.click();
    setExporting(null);
  };

  if (loading) return <div className="text-center py-20 text-slate-500 font-bold">Syncing reports...</div>;

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Performance Hub</h2>
          <p className="text-slate-400">Map and ingest unique search data into your dashboard.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
          <Plus size={18} /> New Blueprint
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map(report => (
          <div key={report.id} className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl p-8 hover:border-blue-500/30 transition-all">
            <div className="flex justify-between mb-6">
              <FileSpreadsheet className="text-blue-500" size={32} />
              <button onClick={() => handleDelete(report.id)} className="text-slate-600 hover:text-red-500"><Trash2 size={18} /></button>
            </div>
            <h3 className="text-xl font-bold">{report.title}</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 mb-6">{report.type}</p>
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <button onClick={() => handleOpenImportModal(report)} className="py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                <Upload size={16} /> Ingest
              </button>
              <button onClick={() => handleExport(report)} className="py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                {exporting === report.id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} Export
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-[#1e293b] border border-slate-700 w-full max-w-md rounded-3xl p-8">
            <h3 className="text-lg font-bold mb-6">Create Data Blueprint</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <input value={reportName} onChange={e => setReportName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3" placeholder="Blueprint Name" required />
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-800 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 rounded-xl font-bold">Initialize</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-[#1e293b] border border-slate-700 w-full max-w-xl rounded-3xl p-8">
            <h3 className="text-lg font-bold mb-2">Upload Data: {selectedReport?.title}</h3>
            <p className="text-sm text-slate-400 mb-8">Duplicates will be overwritten. We only track unique URLs.</p>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center cursor-pointer hover:bg-slate-900/50 transition-all">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv,.xlsx" />
              <FileUp size={48} className="mx-auto text-blue-500 mb-4" />
              <p className="font-bold">{file ? file.name : "Select Spreadsheet"}</p>
            </div>
            <div className="flex gap-4 mt-8">
              <button type="button" onClick={() => setIsImportModalOpen(false)} className="flex-1 py-3 bg-slate-800 rounded-xl">Cancel</button>
              <button onClick={handleUploadData} disabled={!file || importing} className="flex-1 py-3 bg-blue-600 rounded-xl font-bold flex items-center justify-center gap-2">
                {importing ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />} Commit Ingestion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomReports;
