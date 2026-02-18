import axios from "axios";
import {
  getCustomerToken,
  getAdminToken,
  clearCustomerToken,
  clearAdminToken,
} from "../auth/authStore";

// Backend mounts auth at /api/v1/auth (logIn, signUp, google). Use same base for customer/admin APIs.
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api/v1";

export const api = axios.create({ baseURL: API_BASE });

// Customer-scoped client: sends customer_token
export const customerApi = axios.create({ baseURL: API_BASE });
customerApi.interceptors.request.use((config) => {
  const token = getCustomerToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
customerApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      clearCustomerToken();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// Admin-scoped client: sends admin_token
export const adminApi = axios.create({ baseURL: API_BASE });
adminApi.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      clearAdminToken();
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

export default api;
