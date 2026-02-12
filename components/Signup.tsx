
import React, { useState } from 'react';
import { User } from '../types';
import { Shield, Lock, User as UserIcon, Loader2, Info, ChevronDown } from 'lucide-react';

interface SignupProps {
  onSignup: (user: User) => void;
  onToggle: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup, onToggle }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<User['role']>('editor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      // Simulate checking if user exists
      const existingUsers = JSON.parse(localStorage.getItem('omni_users') || '[]');
      const userExists = existingUsers.some((u: any) => u.username.toLowerCase() === username.toLowerCase());

      if (userExists) {
        setError('Username already taken.');
        setLoading(false);
        return;
      }

      // Create new user with "salted" password simulation
      const newUser = { 
        username, 
        password, // In a real app, this would be a hash
        role 
      };

      existingUsers.push(newUser);
      localStorage.setItem('omni_users', JSON.stringify(existingUsers));
      
      onSignup({ username, role });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-emerald-900/40">
            <UserIcon className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 mt-2">Join OmniContent Pro intelligence platform</p>
        </div>

        <div className="bg-[#1e293b] border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all text-white placeholder-slate-600"
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Workspace Role</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all text-white appearance-none cursor-pointer"
                >
                  <option value="admin">Administrator</option>
                  <option value="editor">Content Editor</option>
                  <option value="viewer">Viewer Only</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all text-white placeholder-slate-600"
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
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Register & Log In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={onToggle}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Already have an account? <span className="text-emerald-400 font-bold">Sign in</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
