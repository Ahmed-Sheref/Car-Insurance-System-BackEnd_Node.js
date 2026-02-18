const CUSTOMER_TOKEN_KEY = "customer_token";
const ADMIN_TOKEN_KEY = "admin_token";

export const setCustomerToken = (token) => localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
export const getCustomerToken = () => localStorage.getItem(CUSTOMER_TOKEN_KEY);
export const clearCustomerToken = () => localStorage.removeItem(CUSTOMER_TOKEN_KEY);

export const setAdminToken = (token) => localStorage.setItem(ADMIN_TOKEN_KEY, token);
export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);
export const clearAdminToken = () => localStorage.removeItem(ADMIN_TOKEN_KEY);
