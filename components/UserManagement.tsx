
import React from 'react';
import { Shield, ShieldCheck, ShieldAlert, Mail, MoreVertical, Plus } from 'lucide-react';

const UserManagement: React.FC = () => {
  const users = [
    { name: 'Admin User', email: 'admin@omnicontent.pro', role: 'Super Admin', status: 'Active', lastLogin: '10 mins ago' },
    { name: 'Ricardo Ferreira', email: 'ricardo@omnicontent.pro', role: 'Editor', status: 'Active', lastLogin: '2 hours ago' },
    { name: 'Guy Royse', email: 'guy@omnicontent.pro', role: 'Viewer', status: 'Offline', lastLogin: '1 day ago' },
    { name: 'Bhavana Giri', email: 'bhavana@omnicontent.pro', role: 'Editor', status: 'Active', lastLogin: '5 mins ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Access Control</h2>
          <p className="text-slate-400 text-sm">Manage team members and their permission levels</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <Plus size={18} /> Invite Member
        </button>
      </div>

      <div className="bg-[#1e293b]/50 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900/50">
            <tr className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Login</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map((user, idx) => (
              <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{user.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Mail size={12} /> {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {user.role === 'Super Admin' ? <ShieldCheck className="text-blue-400" size={16} /> : <Shield className="text-slate-400" size={16} />}
                    <span className="text-xs font-medium">{user.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">{user.lastLogin}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center">
              <ShieldAlert size={20} />
            </div>
            <h3 className="font-bold">Security Compliance</h3>
          </div>
          <p className="text-sm text-slate-400 mb-6">Your workspace security settings are currently optimized for multi-user collaboration.</p>
          <ul className="space-y-3">
            {[
              '2FA Enforcement (Active)',
              'Salted Password Hashing (SHA-256)',
              'Brute Force Protection (Active)',
              'RBAC Policy Enabled'
            ].map((policy, i) => (
              <li key={i} className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                <ShieldCheck size={14} /> {policy}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="font-bold mb-4">Audit Log Preview</h3>
          <div className="space-y-3">
            {[
              { action: 'Admin logged in', time: '10 mins ago', user: 'Admin' },
              { action: 'Updated GSC mapping', time: '45 mins ago', user: 'Ricardo' },
              { action: 'Exported YouTube report', time: '2 hours ago', user: 'Bhavana' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between text-[11px] p-2 bg-slate-900/50 rounded-lg border border-slate-800">
                <span className="text-slate-300 font-medium">{log.action}</span>
                <span className="text-slate-500">{log.time}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-xs text-blue-400 font-bold hover:underline">View Full Logs</button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
