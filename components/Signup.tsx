
import React, { useState } from 'react';
import { User } from '../types';
import { Shield, Lock, User as UserIcon, Loader2, Info, Fingerprint } from 'lucide-react';
import Toast, { ToastType } from './Toast';

interface SignupProps {
  onSignup: (user: User) => void;
  onToggle: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup, onToggle }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType) => setToast({ message, type });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    showToast("Provisioning cloud identity...", "loading");

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: 'editor' }),
      });

      if (response.ok) {
        const userData = await response.json();
        showToast("Identity Registered! Initializing DB...", "success");
        setTimeout(() => onSignup(userData), 800);
      } else {
        const errData = await response.json();
        showToast(errData.error || 'Registration failed.', "error");
      }
    } catch (err) {
      showToast('Atlas Connection Error. Check IP Access List.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6 relative">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-emerald-900/40">
            <Fingerprint className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Cloud Enrollment</h1>
          <p className="text-slate-400 mt-2 text-sm px-8">Provision your identity in our global MongoDB cluster.</p>
        </div>

        <div className="bg-[#1e293b] border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
          
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all text-white placeholder-slate-600 text-sm"
                  placeholder="Username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all text-white placeholder-slate-600 text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 text-sm mt-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Register Identity'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={onToggle}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Already have an account? <span className="text-emerald-400 font-bold">Login here</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
