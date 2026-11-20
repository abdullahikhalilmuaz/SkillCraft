import axios from "axios";

const api = axios.create({
  baseURL: "https://skillcraft-backend-server.onrender.com/api",
  // baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT to every protected request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Handle expired/invalid JWT & Suspended Accounts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    // ✅ FIX 1: Don't force a reload if the login request itself fails (Wrong Password)
    const isAuthRoute =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register");

    // ✅ FIX 2: Added 403 so suspended students get kicked out if their session is active
    if ((status === 401 || status === 403) && !isAuthRoute) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    // Always reject so the Login.jsx catch block can read the error message
    return Promise.reject(error);
  },
);

export default api;
