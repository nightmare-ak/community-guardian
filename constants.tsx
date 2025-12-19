
import React from 'react';
import { 
  ShieldAlert, Flame, Droplets, Car, Construction, AlertCircle, 
  Hospital, Home, Shield, Landmark 
} from 'lucide-react';
import { Shelter } from './types';

export const CREATOR_EMAIL = 'adityakanojiya2526@gmail.com';

export const SEVERITY_COLORS = {
  LOW: '#facc15',    // Yellow
  MEDIUM: '#fb923c', // Orange
  HIGH: '#ef4444',   // Red (Neon)
};

export const EMERGENCY_NUMBERS: Record<string, string> = {
  'US': '911',
  'IN': '112',
  'GB': '999',
  'EU': '112',
  'DEFAULT': '112'
};

export const getSeverityColor = (severity: number) => {
  if (severity >= 8) return SEVERITY_COLORS.HIGH;
  if (severity >= 4) return SEVERITY_COLORS.MEDIUM;
  return SEVERITY_COLORS.LOW;
};

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Fire: <Flame className="w-5 h-5" />,
  Flood: <Droplets className="w-5 h-5" />,
  Accident: <Car className="w-5 h-5" />,
  Roadblock: <Construction className="w-5 h-5" />,
  Other: <AlertCircle className="w-5 h-5" />,
};

export const SHELTER_ICONS: Record<string, React.ReactNode> = {
  Hospital: <Hospital className="w-5 h-5 text-blue-400" />,
  Shelter: <Home className="w-5 h-5 text-emerald-400" />,
  Police: <Shield className="w-5 h-5 text-indigo-400" />,
  'Safe Zone': <Landmark className="w-5 h-5 text-cyan-400" />,
};

export const MOCK_SHELTERS: Shelter[] = [
  { id: '1', name: 'City Central Hospital', type: 'Hospital', distance: '0.5 miles away', address: '123 Medical Plaza' },
  { id: '2', name: 'Community Center Shelter', type: 'Shelter', distance: '1.2 miles away', address: '456 Public Square' },
  { id: '3', name: 'Westside Safe Zone', type: 'Safe Zone', distance: '2.4 miles away', address: '789 Safety Blvd' },
];
