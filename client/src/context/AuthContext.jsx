
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Authentication token
  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  );

  // Logged-in user
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(
    Boolean(localStorage.getItem("token"))
  );

  // Save user details
  const saveUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  // Login
  const login = useCallback((authToken, userData) => {
    localStorage.setItem("token", authToken);
    setToken(authToken);

    if (userData) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("otpEmail");
    sessionStorage.removeItem("otpChallengeToken");

    setToken(null);
    setUser(null);
    setLoading(false);
  }, []);

  // Fetch logged-in user's profile
  const fetchCurrentUser = useCallback(async () => {
    const savedToken = localStorage.getItem("token");

    if (!savedToken) {
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/user/me");

      const userData =
        response.data?.data?.user ||
        response.data?.user ||
        response.data?.data ||
        response.data;
if (!userData || !userData.id) {
  logout();
  return;
}

saveUser(userData);
setToken(savedToken);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout, saveUser]);

  // Restore session on page refresh
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout,
        saveUser,
        fetchCurrentUser,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom authentication hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
