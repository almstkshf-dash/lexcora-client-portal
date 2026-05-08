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
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// On 401 → clear token and redirect to login
// Only redirect if we actually had a token (i.e. session expired), not on initial unauthenticated load
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      const hadToken = !!localStorage.getItem("authToken");
      localStorage.removeItem("authToken");
      if (hadToken && !window.location.pathname.includes("/login")) {
        const currentPath = window.location.pathname;
        window.location.href = `/login?expired=true&redirect=${encodeURIComponent(currentPath)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
