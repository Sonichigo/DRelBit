
import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Loader2 } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'loading';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    if (type !== 'loading') {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  const config = {
    success: { icon: <CheckCircle2 className="text-emerald-500" />, bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    error: { icon: <AlertCircle className="text-rose-500" />, bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    info: { icon: <Info className="text-blue-500" />, bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    loading: { icon: <Loader2 className="text-blue-500 animate-spin" />, bg: 'bg-slate-800/50', border: 'border-slate-700' },
  };

  const { icon, bg, border } = config[type];

  return (
    <div className={`fixed bottom-8 right-8 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl border ${bg} ${border} backdrop-blur-md shadow-2xl animate-in slide-in-from-right-10 duration-300`}>
      {icon}
      <span className="text-sm font-medium text-slate-100">{message}</span>
      {type !== 'loading' && (
        <button onClick={onClose} className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-500 hover:text-white">
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default Toast;
