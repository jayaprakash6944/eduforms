import { createContext, useContext, useState, useEffect } from "react";
import { loginAPI, logoutAPI, getMeAPI } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);   // check stored token on mount

  // On app load – restore session from localStorage token
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");
      const stored = localStorage.getItem("user");
      if (token && stored) {
        try {
          const { user: freshUser } = await getMeAPI();
          setUser(freshUser);
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    const loggedInUser = await loginAPI(email, password);  // throws on error
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = () => {
    logoutAPI();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);