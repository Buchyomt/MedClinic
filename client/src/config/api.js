// Centralized API Base URL configuration for MedClinic
// In local development, falls back to http://localhost:5000
// In production on Vercel, set VITE_API_BASE_URL in your Vercel Project Environment Variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
