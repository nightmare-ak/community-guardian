
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Report, UserRole, canViewClearEvidence, canViewRealIdentity } from '../types';
import { getSeverityColor, CATEGORY_ICONS } from '../constants';
import { Calendar, User, ShieldCheck, Mail, Lock, Eye } from 'lucide-react';

interface Props {
  reports: Report[];
  userLocation: [number, number];
  currentRole: UserRole;
}

const createCustomIcon = (severity: number) => {
  const color = getSeverityColor(severity);
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid #020617;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

const ChangeView: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const formatEventTime = (timestamp: number) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(new Date(timestamp));
};

export const ReportMap: React.FC<Props> = ({ reports, userLocation, currentRole }) => {
  const isHighTier = canViewRealIdentity(currentRole);
  const canSeeClearly = canViewClearEvidence(currentRole);

  return (
    <div className="w-full h-full relative p-4">
      <MapContainer 
        center={userLocation} 
        zoom={13} 
        scrollWheelZoom={true}
        className="h-full w-full shadow-2xl shadow-black/50 overflow-hidden"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
        />
        <ChangeView center={userLocation} />
        
        {reports.map((report) => (
          <Marker 
            key={report.id} 
            position={[report.location.lat, report.location.lng]}
            icon={createCustomIcon(report.severity)}
          >
            <Popup className="m3-popup custom-leaflet-popup">
              <div className="w-72 p-1 font-sans text-slate-100 bg-slate-950 rounded-2xl overflow-hidden">
                <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-950">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 shadow-inner">
                      {CATEGORY_ICONS[report.category]}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white leading-none mb-1">{report.category}</h3>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black uppercase text-red-400 tracking-widest">Severity {report.severity}/10</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative w-full h-36 rounded-2xl mb-4 overflow-hidden border border-white/5 shadow-2xl group">
                    <img 
                      src={report.imageUrl} 
                      alt="Crisis Evidence" 
                      className={`w-full h-full object-cover transition-all duration-700 ${!canSeeClearly ? 'blur-md grayscale' : ''}`}
                    />
                    {!canSeeClearly && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-[2px]">
                        <Lock className="w-6 h-6 text-white/50 mb-1" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/70">Privacy Protected</span>
                        <span className="text-[7px] font-bold text-white/40 mt-1">Verification Access Required</span>
                      </div>
                    )}
                    {canSeeClearly && (
                      <div className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-300 mb-4 italic leading-relaxed">"{report.summary}"</p>
                  
                  <div className="space-y-2 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      <Calendar className="w-3 h-3" />
                      {formatEventTime(report.timestamp)}
                    </div>

                    <div className="flex flex-col gap-1 p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-blue-400" />
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">
                          {isHighTier ? report.userDisplayName : "Anonymous Guardian"}
                        </span>
                        {!isHighTier && (
                          <span title="Identity Masked">
                            <ShieldCheck className="w-3 h-3 text-slate-500" />
                          </span>
                        )}
                      </div>
                      
                      {isHighTier && (
                        <div className="flex items-center gap-2 mt-1 border-t border-white/5 pt-1">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span className="text-[9px] font-mono text-slate-500 break-all">{report.userEmail}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
