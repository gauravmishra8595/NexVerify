import axios from "axios";

/**
 * Separate axios instance + token storage for the admin panel.
 * Keeps admin sessions isolated from candidate sessions in the same
 * browser (different localStorage keys, different 401 redirect target).
 */
const adminApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/admin-panel",
  headers: {
    "Content-Type": "application/json",
  },
});

adminApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_access");

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin_access");
      localStorage.removeItem("admin_refresh");
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export default adminApi;
