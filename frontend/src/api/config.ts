// Centralized API Base URL:
// - On Localhost: points to http://localhost:8000
// - On Vercel: points to same origin (relative /api) or custom VITE_API_BASE_URL
export const API_BASE_URL: string = 
  ((import.meta as any).env?.VITE_API_BASE_URL as string) || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '' : 'http://localhost:8000');
