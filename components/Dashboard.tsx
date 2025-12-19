
import React, { useState, useEffect } from 'react';
import { 
  Map, Camera, Hospital, ChevronRight, ShieldCheck, 
  Activity, PhoneCall, Settings, ShieldAlert, Zap, Users, Landmark
} from 'lucide-react';
import { UserProfile, canAccessAuthorityDashboard } from '../types';
import { EMERGENCY_NUMBERS } from '../constants';

interface Props {
  user: UserProfile;
  onNavigate: (tab: number) => void;
  pendingSyncCount: number;
}

export const Dashboard: React.FC<Props> = ({ user, onNavigate, pendingSyncCount }) => {
  const [emergencyPhone, setEmergencyPhone] = useState(EMERGENCY_NUMBERS.DEFAULT);

  useEffect(() => {
    // Basic country detection for emergency numbers
    const locale = navigator.language.split('-')[1] || 'DEFAULT';
    setEmergencyPhone(EMERGENCY_NUMBERS[locale] || EMERGENCY_NUMBERS.DEFAULT);
  }, []);

  const isCreator = user.role === 'Creator';
  const isAdmin = user.role === 'Admin';
  
  // Rules: 
  // - Creator/Admin/Authority can see Infrastructure Manager
  const canManageInfrastructure = canAccessAuthorityDashboard(user.role);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Guardian Protocol Alpha</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-white">
            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{user.displayName.split(' ')[0]}</span>
          </h2>
          <p className="text-slate-400 text-sm">Your presence strengthens community resilience.</p>
        </div>
        
        {/* Quick Identity Display */}
        <div className="hidden sm:flex items-center gap-3 glass-card px-4 py-2 rounded-2xl border-white/10">
          <div className="text-right">
            <p className="text-xs font-bold text-white">{user.role}</p>
            <p className="text-[10px] text-slate-400">Authenticated Node</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg">
            {user.role[0]}
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-6 grid-rows-3 gap-4 h-auto md:h-[500px]">
        
        {/* Main Action: Report (Large Bento) */}
        <button 
          onClick={() => onNavigate(1)}
          className="md:col-span-4 md:row-span-2 group relative overflow-hidden glass-card rounded-[2.5rem] p-10 text-left transition-all hover:scale-[1.01] hover:shadow-red-500/10 border-white/5 bouncy"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Camera className="w-40 h-40" />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="w-14 h-14 bg-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mb-6 border border-red-500/30">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black mb-2 text-white">Report Hazard</h3>
              <p className="text-slate-400 max-w-xs leading-relaxed">Broadcast verified crisis events to the network with neural identity protection.</p>
            </div>
            <div className="flex items-center gap-2 text-red-400 font-black text-xs uppercase tracking-[0.2em] mt-8 group-hover:translate-x-1 transition-transform">
              Deploy Sentinel Alert <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        {/* Action: Map (Medium Bento) */}
        <button 
          onClick={() => onNavigate(0)}
          className="md:col-span-2 md:row-span-1 group relative overflow-hidden glass-card rounded-[2.5rem] p-6 text-left transition-all hover:scale-[1.01] border-white/5 bouncy"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/30">
              <Map className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white">Crisis Map</h3>
          </div>
          <p className="text-xs text-slate-400">Heatmap of verified community risks.</p>
          <div className="absolute bottom-4 right-6 group-hover:translate-x-1 transition-transform">
             <ChevronRight className="text-slate-600" />
          </div>
        </button>

        {/* Action: Shelters (Small Bento) */}
        <button 
          onClick={() => onNavigate(2)}
          className="md:col-span-2 md:row-span-1 group relative overflow-hidden glass-card rounded-[2.5rem] p-6 text-left transition-all hover:scale-[1.01] border-white/5 bouncy"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/30">
              <Hospital className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white">Safe Zones</h3>
          </div>
          <p className="text-xs text-slate-400">Nearest medical and shelter relief nodes.</p>
        </button>

        {/* Dynamic Helpline Card (Full Width Bottom) */}
        <div className="md:col-span-3 md:row-span-1 glass-card rounded-[2.5rem] p-8 flex items-center justify-between border-l-4 border-l-blue-600 border-white/5">
           <div className="flex items-center gap-6">
             <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-900/40 relative">
               <div className="absolute inset-0 bg-blue-600 blur-lg opacity-20" />
               <PhoneCall className="w-7 h-7 relative z-10" />
             </div>
             <div>
               <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Local Helpline</p>
               <p className="text-3xl font-black text-white tracking-tighter">{emergencyPhone}</p>
             </div>
           </div>
           <a 
            href={`tel:${emergencyPhone}`}
            className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 shadow-inner"
           >
             Direct Call
           </a>
        </div>

        {/* Unified Management Bento based on Authority/Admin/Creator */}
        {canManageInfrastructure && (
           <button 
            onClick={() => {
              // Priority routing: 
              // Creator/Admin -> AdminPanel (3)
              // Authority -> AuthorityPanel (4)
              if (isCreator || isAdmin) onNavigate(3);
              else onNavigate(4);
            }}
            className="md:col-span-3 md:row-span-1 group relative overflow-hidden bg-gradient-to-br from-slate-900 to-[#020617] rounded-[2.5rem] p-8 text-left transition-all hover:scale-[1.01] border border-blue-500/20 bouncy shadow-2xl shadow-blue-900/10"
           >
             <div className="flex items-center gap-6 text-white">
               <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center">
                 {isCreator ? <Users className="w-7 h-7 text-indigo-400" /> : 
                  isAdmin ? <Settings className="w-7 h-7 text-blue-400" /> : 
                  <Landmark className="w-7 h-7 text-purple-400" />}
               </div>
               <div>
                 <h3 className="font-black text-xl tracking-tight text-white">
                    {isCreator ? 'Network Hub' : 
                     isAdmin ? 'Verification Hub' : 'Infrastructure'}
                 </h3>
                 <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mt-1">
                    {user.role === 'Authority' ? 'Authority Privileges' : 'Elevation Access'}
                 </p>
               </div>
             </div>
             {/* Secondary Button for Authorities if Creator/Admin */}
             {(isCreator || isAdmin) && (
               <div className="absolute top-4 right-4">
                 <button 
                   onClick={(e) => { e.stopPropagation(); onNavigate(4); }}
                   className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                   title="Manage Shelters"
                 >
                   <Landmark className="w-4 h-4 text-purple-400" />
                 </button>
               </div>
             )}
             <div className="absolute bottom-8 right-8 text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-6 h-6" />
             </div>
           </button>
        )}
      </div>

      {pendingSyncCount > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-3xl flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-4">
            <Activity className="text-amber-500 w-6 h-6" />
            <p className="text-sm font-bold text-amber-200 tracking-wide uppercase text-[10px] tracking-widest">{pendingSyncCount} Reports in Offline Buffer</p>
          </div>
          <span className="text-amber-500 font-black text-[10px] uppercase tracking-widest">Waiting for Signal</span>
        </div>
      )}
    </div>
  );
};
