
import { Report } from "../types";
import { authService } from "./authService";

const STORAGE_KEY = 'community_guardian_reports';

export const reportService = {
  getReports: (): Report[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  addReport: (report: Report) => {
    const reports = reportService.getReports();
    reports.push(report);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  },

  getVerifiedReports: (): Report[] => {
    return reportService.getReports().filter(r => r.status === 'verified');
  },

  createReportTemplate: (data: any): Report => {
    const user = authService.getCurrentUser();
    return {
      id: crypto.randomUUID(),
      userId: user?.id || 'anon',
      userEmail: user?.email || 'anon@guardian.protocol',
      userDisplayName: user?.displayName || 'Anonymous Guardian',
      location: data.location,
      imageUrl: data.media,
      mediaType: data.mediaType,
      description: data.description,
      status: 'verified',
      severity: data.verification.severity,
      category: data.verification.category,
      summary: data.verification.summary,
      timestamp: Date.now()
    };
  }
};
