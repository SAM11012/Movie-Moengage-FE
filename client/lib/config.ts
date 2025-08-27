// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||"https://movie-monengae-be.onrender.com";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  
  // Movie endpoints
  MOVIES_TRENDING: `${API_BASE_URL}/api/movies/trending`,
  MOVIES_SEARCH: `${API_BASE_URL}/api/movies/search`,
  MOVIE_DETAILS: (id: string) => `${API_BASE_URL}/api/movies/${id}`,
  
  // Analytics endpoints
  ANALYTICS_DASHBOARD: `${API_BASE_URL}/api/analytics/dashboard`,
} as const;
