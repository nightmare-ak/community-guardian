
import React, { useState, useEffect } from 'react';
import { facilityService } from '../services/facilityService';
import { authService } from '../services/authService';
import { Facility } from '../types';
import { Plus, MapPin, Trash2, Hospital, Home, Shield, Landmark, Loader2, Phone } from 'lucide-react';

export const AuthorityPanel: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Hospital' as Facility['type'],
    address: '',
    contactNumber: '',
  });
  const [currentLoc, setCurrentLoc] = useState<{lat: number, lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    setFacilities(facilityService.getFacilities());
  }, []);

  const handleCaptureLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition((pos) => {
      setCurrentLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      setIsLocating(false);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLoc || !currentUser) return;

    const newFacility: Facility = {
      id: crypto.randomUUID(),
      name: formData.name,
      type: formData.type,
      location: currentLoc,
      address: formData.address,
      contactNumber: formData.contactNumber,
      createdByRole: currentUser.role
    };

    facilityService.addFacility(newFacility);
    setFacilities(facilityService.getFacilities());
    setIsAdding(false);
    setFormData({ name: '', type: 'Hospital', address: '', contactNumber: '' });
    setCurrentLoc(null);
  };

  const handleDelete = (id: string) => {
    facilityService.deleteFacility(id);
    setFacilities(facilityService.getFacilities());
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Infrastructure <span className="text-purple-400">Manager</span></h2>
          <p className="text-slate-500 text-sm">Update safe zones and medical points for the community.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-2xl shadow-xl shadow-purple-900/20 transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
        >
          <Plus className="w-5 h-5" /> Add Facility
        </button>
      </div>

      {isAdding && (
        <div className="glass-card rounded-[2.5rem] p-8 space-y-6 border-purple-500/20 animate-in slide-in-from-top-4">
          <h3 className="text-xl font-bold text-white tracking-tight">Register New Facility</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Facility Name</label>
              <input 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 px-5 text-white outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                placeholder="e.g. Westside Emergency Clinic"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Type</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as Facility['type']})}
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 px-5 text-white outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none"
              >
                <option value="Hospital">Hospital</option>
                <option value="Shelter">Shelter</option>
                <option value="Police">Police Station</option>
                <option value="Safe Zone">General Safe Zone</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Address</label>
              <input 
                required
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 px-5 text-white outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                placeholder="123 Street Name, City"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  required
                  value={formData.contactNumber}
                  onChange={e => setFormData({...formData, contactNumber: e.target.value})}
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-5 text-white outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  placeholder="Emergency Hotline"
                />
              </div>
            </div>

            <div className="md:col-span-2">
               <button 
                type="button"
                onClick={handleCaptureLocation}
                disabled={isLocating}
                className={`w-full py-5 rounded-2xl border-2 border-dashed flex items-center justify-center gap-3 font-black transition-all ${
                  currentLoc ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
               >
                 {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                 {currentLoc ? 'Location Verified' : 'Tag Current GPS Coordinates'}
               </button>
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button 
                type="submit"
                disabled={!currentLoc}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-purple-900/20 transition-all uppercase text-xs tracking-widest disabled:opacity-50"
              >
                Publish Facility
              </button>
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-8 bg-white/5 text-slate-400 font-bold py-4 rounded-2xl hover:bg-white/10 transition-all uppercase text-[10px] tracking-widest"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facilities.map(facility => (
          <div key={facility.id} className="glass-card p-6 rounded-[2.5rem] flex items-center justify-between border-white/5 group">
             <div className="flex items-center gap-4">
               <div className="p-4 bg-slate-900 rounded-2xl text-purple-400 border border-white/5">
                 {facility.type === 'Hospital' && <Hospital className="w-6 h-6" />}
                 {facility.type === 'Shelter' && <Home className="w-6 h-6" />}
                 {facility.type === 'Police' && <Shield className="w-6 h-6" />}
                 {facility.type === 'Safe Zone' && <Landmark className="w-6 h-6" />}
               </div>
               <div>
                 <h4 className="font-bold text-white">{facility.name}</h4>
                 <div className="flex items-center gap-2 mt-1">
                   <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{facility.type}</p>
                   {facility.createdByRole && (
                     <span className="text-[8px] px-2 py-0.5 rounded-full bg-white/5 text-slate-600 border border-white/5 uppercase">By {facility.createdByRole}</span>
                   )}
                 </div>
               </div>
             </div>
             <button 
              onClick={() => handleDelete(facility.id)}
              className="p-3 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
             >
               <Trash2 className="w-5 h-5" />
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};
