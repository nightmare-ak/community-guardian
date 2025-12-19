
import React from 'react';
import { ShieldCheck, LogOut } from 'lucide-react';
import { authService } from '../services/authService';

interface Props {
  onLogout: () => void;
}

export const Header: React.FC<Props> = ({ onLogout }) => {
  const user = authService.getCurrentUser();

  return (
    <header className="sticky top-0 z-[3000] px-6 py-4 flex items-center justify-between glass">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-red-600 to-red-500 p-2 rounded-xl shadow-lg shadow-red-900/20">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <h1 className="font-black text-xl tracking-tighter text-white">GUARD<span className="text-red-500">IAN</span></h1>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <button 
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            title="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}
    </header>
  );
};
