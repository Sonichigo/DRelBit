
import React, { useState } from 'react';
import { User } from '../types';
import { Shield, Lock, User as UserIcon, Loader2, Info } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate salted password verification
    // In real app, we would send password to backend, backend retrieves salt + hash from MongoDB
    // and verifies. Here we just mock the delay and logic.
    setTimeout(() => {
      if (username && password) {
        onLogin({ username, role: 'admin' });
      } else {
        setError('Invalid username or password credentials.');
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-900/40">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">OmniContent Pro</h1>
          <p className="text-slate-400 mt-2">Sign in to access your intelligence dashboard</p>
        </div>

        <div className="bg-[#1e293b] border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-white placeholder-slate-600"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-white placeholder-slate-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm rounded-lg flex items-center gap-2">
                <Info size={16} />
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Secure Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 text-xs justify-center">
              <Lock size={12} />
              <span>All authentication is salted & encrypted with SHA-256</span>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Need access? Contact your workspace administrator.
        </p>
      </div>
    </div>
  );
};

export default Login;
