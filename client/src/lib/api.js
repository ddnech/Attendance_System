import axios from "axios";

// "/api" works both in dev (Vite proxy) and in Docker (nginx proxy).
// Set VITE_API_URL only if the API lives on a different address.
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({ baseURL });

export const TOKEN_KEY = "attendance.token";
export const USER_KEY = "attendance.user";

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// When the token expires, clear the session and send the person back to the login page.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginCall = error.config?.url?.includes("/auth/login");
    if (error.response?.status === 401 && !isLoginCall && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.assign("/?expired=1");
    }
    return Promise.reject(error);
  }
);

/** Pulls a readable message out of an axios error. */
export function errorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error?.response) return "Can't reach the server. Is the API running?";
  return error.response.data?.message || error.response.data?.errors?.[0]?.msg || fallback;
}

export default api;
