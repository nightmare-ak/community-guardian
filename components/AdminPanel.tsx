
import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { UserProfile, UserRole } from '../types';
import { Search, ShieldCheck, UserCog, UserCheck, ShieldAlert, Landmark, UserMinus } from 'lucide-react';

interface Props {
  currentUser: UserProfile;
}

export const AdminPanel: React.FC<Props> = ({ currentUser }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setProfiles(authService.getProfiles());
  }, []);

  const handleRoleUpdate = (userId: string, role: UserRole) => {
    authService.updateRole(userId, role);
    setProfiles(authService.getProfiles());
  };

  const filtered = profiles.filter(p => 
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold flex items-center gap-3 uppercase tracking-tighter">
          <ShieldCheck className="text-blue-400 w-8 h-8" />
          Network <span className="text-blue-400">Control</span>
        </h2>
        <p className="text-slate-400">Creator privilege: manage node roles and verification authority.</p>
      </div>

      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
        <input 
          type="text"
          placeholder="Filter node identities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/50 border border-white/5 rounded-3xl py-5 pl-14 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all text-sm font-medium"
        />
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500 italic">No nodes identified in current sector.</div>
        ) : (
          filtered.map(profile => (
            <div key={profile.id} className="glass-card rounded-[2rem] p-6 flex items-center justify-between animate-in fade-in zoom-in-95 border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-5">
                <img src={profile.photoURL} className="w-14 h-14 rounded-2xl shadow-xl ring-2 ring-white/5" alt={profile.displayName} />
                <div>
                  <h4 className="font-bold text-slate-100">{profile.displayName}</h4>
                  <p className="text-xs text-slate-500 font-mono">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                  profile.role === 'Creator' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                  profile.role === 'Admin' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  profile.role === 'Authority' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                  'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {profile.role}
                </div>

                {currentUser.role === 'Creator' && profile.role !== 'Creator' && (
                  <div className="flex gap-2 ml-4 border-l border-white/5 pl-4">
                    <button 
                      onClick={() => handleRoleUpdate(profile.id, profile.role === 'Admin' ? 'User' : 'Admin')}
                      className={`p-3 rounded-2xl transition-all bouncy ${
                        profile.role === 'Admin' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                      }`}
                      title={profile.role === 'Admin' ? "Revoke Admin" : "Grant Admin"}
                    >
                      {profile.role === 'Admin' ? <UserMinus className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                    </button>
                    <button 
                      onClick={() => handleRoleUpdate(profile.id, profile.role === 'Authority' ? 'User' : 'Authority')}
                      className={`p-3 rounded-2xl transition-all bouncy ${
                        profile.role === 'Authority' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'
                      }`}
                      title={profile.role === 'Authority' ? "Revoke Authority" : "Grant Authority"}
                    >
                      {profile.role === 'Authority' ? <UserMinus className="w-5 h-5" /> : <Landmark className="w-5 h-5" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {currentUser.role !== 'Creator' && (
        <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl text-blue-400 text-xs font-bold flex items-center gap-4 leading-relaxed">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          ADMIN PROTOCOL: You can view identity metadata for verification, but role elevation is restricted to the network Creator.
        </div>
      )}
    </div>
  );
};
