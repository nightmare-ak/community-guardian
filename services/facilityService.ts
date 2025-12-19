
import { Facility, UserRole } from "../types";

const FACILITIES_KEY = 'guardian_facilities_v2';

const INITIAL_FACILITIES: Facility[] = [
  { id: '1', name: 'City Central Hospital', type: 'Hospital', location: { lat: 40.7128, lng: -74.0060 }, contactNumber: '112', address: '123 Medical Plaza', createdByRole: 'Creator' },
  { id: '2', name: 'Community Center Shelter', type: 'Shelter', location: { lat: 40.7228, lng: -74.0160 }, contactNumber: '112', address: '456 Public Square', createdByRole: 'Creator' },
  { id: '3', name: 'Westside Safe Zone', type: 'Safe Zone', location: { lat: 40.7328, lng: -73.9960 }, contactNumber: '112', address: '789 Safety Blvd', createdByRole: 'Creator' },
];

export const facilityService = {
  getFacilities: (): Facility[] => {
    const saved = localStorage.getItem(FACILITIES_KEY);
    if (!saved) {
      localStorage.setItem(FACILITIES_KEY, JSON.stringify(INITIAL_FACILITIES));
      return INITIAL_FACILITIES;
    }
    return JSON.parse(saved);
  },

  addFacility: (facility: Facility) => {
    const facilities = facilityService.getFacilities();
    facilities.push(facility);
    localStorage.setItem(FACILITIES_KEY, JSON.stringify(facilities));
  },

  deleteFacility: (id: string) => {
    const facilities = facilityService.getFacilities().filter(f => f.id !== id);
    localStorage.setItem(FACILITIES_KEY, JSON.stringify(facilities));
  },

  /**
   * Calculates distance between two coordinates in kilometers using Haversine formula
   */
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }
};
