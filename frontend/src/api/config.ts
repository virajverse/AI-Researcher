// Centralized API Base URL
// - Defaults to VITE_API_BASE_URL environment variable (e.g. https://your-backend.onrender.com)
// - Falls back to http://localhost:8000 for local development
export const API_BASE_URL: string = 
  ((import.meta as any).env?.VITE_API_BASE_URL as string)?.replace(/\/$/, '') || 'http://localhost:8000';
