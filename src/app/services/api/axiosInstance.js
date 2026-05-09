import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://lexcora-backend.vercel.app/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Bearer token from localStorage on every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// On 401 → clear token and redirect to login
// Only redirect if we actually had a token AND the request is not the auth-check endpoint
api.interceptors.response.use(
  (response) => {
    // Architectural Guard: Normalize response structure
    // We ensure that 'data' is the source of truth, and results/items are mapped back to it.
    if (response.data && typeof response.data === 'object') {
      const body = response.data;
      
      // If 'data' is missing but 'results' or 'items' exists, normalize it
      if (body.data === undefined || body.data === null) {
        if (Array.isArray(body.results)) body.data = body.results;
        else if (Array.isArray(body.items)) body.data = body.items;
        else if (Array.isArray(body.projects)) body.data = body.projects; // Specific to projects endpoint
        else if (Array.isArray(body.cases)) body.data = body.cases;
      }

      // Final safety check: if we're at a collection endpoint, ensure data is an array
      const url = response.config?.url || "";
      const isCollection = !/\/\d+$/.test(url.split('?')[0]); 
      if (isCollection && body.success && (body.data === undefined || body.data === null)) {
        body.data = [];
      }
    }
    return response;
  },
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      const url = error.config?.url || "";
      const isAuthCheck = url.includes("/client-auth/me");
      const hadToken = !!localStorage.getItem("authToken");

      // Only clear + redirect for real session expiry (not the initial /me check)
      if (!isAuthCheck) {
        localStorage.removeItem("authToken");
        if (hadToken && !window.location.pathname.includes("/login")) {
          const currentPath = window.location.pathname;
          window.location.href = `/login?expired=true&redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }
    // Enrich error message with backend response if available
    if (error.response && error.response.data && error.response.data.message) {
      error.message = error.response.data.message;
    }
    return Promise.reject(error);
  }
);

export default api;
