import axios from "axios";
import {
  getCustomerToken,
  getAdminToken,
  clearCustomerToken,
  clearAdminToken,
} from "../auth/authStore";

// Backend API (must be running on this URL for login and SSO to work)
export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:3000/api/v1";

export const customerHttp = axios.create({ baseURL: API_BASE });
export const adminHttp = axios.create({ baseURL: API_BASE });

customerHttp.interceptors.request.use((config) => {
  const token = getCustomerToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminHttp.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, clear token so user is sent to login by protected routes
customerHttp.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) clearCustomerToken();
    return Promise.reject(err);
  }
);

adminHttp.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) clearAdminToken();
    return Promise.reject(err);
  }
);

