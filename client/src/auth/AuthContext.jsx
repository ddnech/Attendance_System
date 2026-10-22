import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router";
import api, { TOKEN_KEY, USER_KEY } from "../lib/api";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = JSON.parse(localStorage.getItem(USER_KEY) || "null");
    return token && user ? user : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // The session survives a page refresh because it lives in localStorage.
  const [user, setUser] = useState(readStoredUser);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Only renders its children when logged in (and, if `role` is given, with that role).
 * role is "admin" or "staff".
 */
export function RequireAuth({ role, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/" replace state={{ from: location.pathname }} />;
  if (role && user.role !== role) return <Navigate to="/home" replace />;
  return children;
}
