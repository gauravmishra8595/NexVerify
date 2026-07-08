import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access");

      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (process.env.NODE_ENV === "development") {
      console.log("REQUEST:", config.method, `${config.baseURL ?? ""}${config.url ?? ""}`, config.data);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === "development") {
      console.log("SUCCESS RESPONSE:", response.data);
    }

    return response;
  },
  (error) => {
    if (process.env.NODE_ENV === "development") {
      console.log("ERROR RESPONSE:", error.response?.status, error.response?.data);
    }

    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Access token missing/expired/invalid - send the user back to login.
      // (A refresh-token flow can replace this once /api/auth/refresh/ exists.)
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
