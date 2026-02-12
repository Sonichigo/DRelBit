
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';

const DataImport: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const simulateUpload = () => {
    setStatus('uploading');
    setTimeout(() => {
      setStatus('success');
      // In a real app, this would send the file to a backend to parse and save to MongoDB
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">Import Spreadsheet Data</h2>
        <p className="text-slate-400">Upload your CSV or XLSX files to sync content metrics from BrightEdge, YouTube, or custom logs.</p>
      </div>

      <div className="bg-[#1e293b] border-2 border-dashed border-slate-700 rounded-3xl p-10 flex flex-col items-center justify-center transition-all hover:border-blue-500/50 group">
        {!file && status === 'idle' && (
          <label 
            className={`w-full h-full flex flex-col items-center cursor-pointer ${dragActive ? 'bg-blue-500/5' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-slate-400 group-hover:text-blue-400">
              <Upload size={32} />
            </div>
            <p className="text-lg font-medium mb-1">Click to upload or drag and drop</p>
            <p className="text-slate-500 text-sm">Supported formats: .csv, .xlsx, .tsv</p>
            <input type="file" className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
          </label>
        )}

        {file && status === 'idle' && (
          <div className="w-full">
            <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-2xl border border-slate-700 mb-6">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 flex items-center justify-center rounded-xl">
                <FileText size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <button onClick={() => setFile(null)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-500">
                <X size={18} />
              </button>
            </div>
            <button 
              onClick={simulateUpload}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20"
            >
              Process & Import Data
            </button>
          </div>
        )}

        {status === 'uploading' && (
          <div className="flex flex-col items-center py-10">
            <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
            <p className="text-lg font-bold">Parsing Data...</p>
            <p className="text-sm text-slate-400">Validating columns and mapping to database schemas</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center py-10 animate-in fade-in zoom-in">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={32} />
            </div>
            <p className="text-xl font-bold text-white mb-2">Sync Completed!</p>
            <p className="text-sm text-slate-400 mb-8 text-center max-w-xs">1,240 rows were successfully imported into the dashboard content database.</p>
            <button 
              onClick={() => {setFile(null); setStatus('idle');}}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
            >
              Upload Another File
            </button>
          </div>
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-[#1e293b]/50 border border-slate-800 rounded-2xl">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <AlertCircle size={18} className="text-blue-400" />
            Import Mapping
          </h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex justify-between"><span>Column A</span> <span className="text-white font-mono">Platform</span></li>
            <li className="flex justify-between"><span>Column B</span> <span className="text-white font-mono">Impressions</span></li>
            <li className="flex justify-between"><span>Column C</span> <span className="text-white font-mono">Views</span></li>
            <li className="flex justify-between"><span>Column D</span> <span className="text-white font-mono">Author</span></li>
          </ul>
        </div>
        <div className="p-6 bg-[#1e293b]/50 border border-slate-800 rounded-2xl">
          <h4 className="font-bold mb-4">Integrations Available</h4>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-slate-700">Google Search Console</span>
            <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-slate-700">BrightEdge Data Cube</span>
            <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-slate-700">YouTube API</span>
            <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-slate-700">LinkedIn Analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataImport;
