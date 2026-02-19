import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const DEMOS = [
  { label: "Student",       email: "student@college.edu",   password: "student123",   icon: "🎓" },
  { label: "Mentor",        email: "mentor@college.edu",    password: "mentor123",    icon: "👨‍🏫" },
  { label: "HOD",           email: "hod@college.edu",       password: "hod123",       icon: "🏛️" },
  { label: "Admin",         email: "admin@college.edu",     password: "admin123",     icon: "⚙️" },
  { label: "Placement Dir.",email: "placement@college.edu", password: "placement123", icon: "💼" },
  { label: "College Dir.",  email: "director@college.edu",  password: "director123",  icon: "👨‍💼" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 700));
    const ok = login(email, password);
    if (!ok) { setError("Invalid credentials. Use a demo account below."); setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "linear-gradient(135deg, #0d1b2a 0%, #1e2d42 50%, #0d1b2a 100%)", position: "relative", overflow: "hidden" }}>
      {/* Decorative blobs */}
      <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,93,38,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -150, left: -100, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />

      {/* Left panel */}
      <div className="fade-in" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px", maxWidth: 560 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #e85d26, #f07a47)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🎓</div>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 18, letterSpacing: -0.3 }}>EduForms</div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>Digital College Management</div>
          </div>
        </div>
        <h1 style={{ color: "white", fontSize: 46, fontWeight: 800, lineHeight: 1.15, letterSpacing: -1.5, marginBottom: 20 }}>
          Forms.<br /><span style={{ color: "#e85d26" }}>Simplified.</span><br />Finally.
        </h1>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, lineHeight: 1.7, maxWidth: 380 }}>
          One platform for every document request — certificates, leaves, placements, hostel, and more. Apply, track, and receive approvals digitally.
        </p>
        <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 18 }}>
          {[["⚡", "Instant Notifications", "Track every approval in real-time"], ["🔐", "Secure & Paperless", "End-to-end digital workflow"], ["📊", "Analytics Dashboard", "Insights for administrators"]].map(([ic, t, s]) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 22 }}>{ic}</span>
              <div>
                <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 500 }}>{t}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel – login card */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div className="slide-in" style={{ background: "rgba(255,255,255,0.98)", borderRadius: 24, padding: "44px 40px", width: "100%", maxWidth: 440, boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0d1b2a", letterSpacing: -0.5 }}>Welcome back</h2>
            <p style={{ color: "#8898aa", fontSize: 14, marginTop: 4 }}>Sign in to your institutional account</p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 6, letterSpacing: 0.3, textTransform: "uppercase" }}>Email Address</label>
              <input type="email" placeholder="you@college.edu" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 6, letterSpacing: 0.3, textTransform: "uppercase" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#8898aa", fontSize: 16, padding: 4 }}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            {error && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 12, marginTop: 8 }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px", background: loading ? "#ccc" : "linear-gradient(135deg, #e85d26, #c74d1a)", color: "white", borderRadius: 12, fontWeight: 700, fontSize: 15, marginTop: 12, cursor: loading ? "not-allowed" : "pointer", border: "none" }}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <div style={{ marginTop: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1, height: 1, background: "#e8e4dc" }} />
              <span style={{ fontSize: 11, color: "#8898aa", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Quick Demo Login</span>
              <div style={{ flex: 1, height: 1, background: "#e8e4dc" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {DEMOS.map(d => (
                <button key={d.label} type="button"
                  onClick={() => { setEmail(d.email); setPassword(d.password); }}
                  style={{ padding: "8px 10px", background: "#f5f2ed", border: "1.5px solid #e8e4dc", borderRadius: 10, fontSize: 12, fontWeight: 600, color: "#4a5568", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", transition: "all 0.15s" }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = "#e85d26"; e.currentTarget.style.background = "#fff5f0"; }}
                  onMouseOut={e  => { e.currentTarget.style.borderColor = "#e8e4dc"; e.currentTarget.style.background = "#f5f2ed"; }}
                >
                  <span>{d.icon}</span>{d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
