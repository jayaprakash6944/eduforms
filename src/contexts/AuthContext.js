import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
const BASE = "http://localhost:5000/api";

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on page load / refresh
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setLoading(false); return; }
      try {
        const res  = await fetch(`${BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Token invalid");
        const data = await res.json();
        setUser(data.user);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  // Standard login — used for demo quick-login ONLY
  // Real login is done in LoginPage (2FA flow) which calls setUser directly
  const login = async (email, password) => {
    const res  = await fetch(`${BASE}/auth/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    // This returns OTP flow info, not a token
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Called by LoginPage after OTP verification succeeds
  const setLoggedInUser = (userData) => {
    setUser(userData);
  };

  if (loading) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
        height:"100vh", flexDirection:"column", gap:16,
        background:"linear-gradient(135deg,#0d1b2a,#1a2f4a)", color:"rgba(255,255,255,0.6)" }}>
        <div style={{ fontSize:48 }}>🎓</div>
        <div style={{ fontSize:16, fontWeight:600, color:"white" }}>Loading EduForms...</div>
        <div style={{ width:200, height:3, background:"rgba(255,255,255,0.1)", borderRadius:99, overflow:"hidden" }}>
          <div style={{ width:"60%", height:"100%", background:"#e85d26", borderRadius:99,
            animation:"none" }}/>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, setLoggedInUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};