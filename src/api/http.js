import axios from "axios";
import { getCustomerToken, getAdminToken } from "../auth/authStore";

const API_BASE = "http://localhost:3000/api";

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
