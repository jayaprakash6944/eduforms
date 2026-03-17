// ─────────────────────────────────────────────────────────────────────────────
// LoginPage.jsx  —  Role-specific login with 2FA + forgot password
// Props: role (string), onBack (fn), onRegister (fn)
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { PORTALS } from "./PortalPage";

const BASE = "http://localhost:5000/api";

// ── OTP boxes ─────────────────────────────────────────────────────────────────
function OTPBoxes({ value, onChange }) {
  const refs = Array.from({ length: 6 }, () => useRef());
  const digits = (value + "      ").slice(0, 6).split("");

  useEffect(() => { refs[0].current?.focus(); }, []);

  const handleKey = (i, e) => {
    if (e.key === "Backspace") {
      const next = value.slice(0, i > 0 ? i - 1 : 0) + value.slice(i);
      onChange(next.replace(/\s/g, "").slice(0, 6));
      if (i > 0) refs[i - 1].current.focus();
      return;
    }
    if (/^\d$/.test(e.key)) {
      const arr = (value + "      ").slice(0, 6).split("");
      arr[i] = e.key;
      const next = arr.join("").replace(/\s/g, "").slice(0, 6);
      onChange(next);
      if (i < 5) refs[i + 1].current.focus();
    }
  };

  return (
    <div style={{ display:"flex", gap:10, justifyContent:"center", margin:"20px 0" }}>
      {[0,1,2,3,4,5].map(i => {
        const filled = digits[i] !== " " && digits[i];
        return (
          <input key={i} ref={refs[i]} type="text" inputMode="numeric" maxLength={1}
            value={filled ? digits[i] : ""}
            onKeyDown={e => handleKey(i, e)}
            onChange={() => {}}
            onPaste={e => {
              const p = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
              onChange(p);
              refs[Math.min(p.length, 5)].current?.focus();
              e.preventDefault();
            }}
            style={{ width:48, height:56, textAlign:"center", fontSize:22, fontWeight:800,
              border:filled ? "2px solid" : "1.5px solid #e2e8f0",
              borderColor:filled ? "var(--portal-color,#e85d26)" : "#e2e8f0",
              borderRadius:12, outline:"none",
              background:filled ? "var(--portal-bg,#fff5f0)" : "white",
              color:"#0d1b2a", transition:"all 0.15s" }}
          />
        );
      })}
    </div>
  );
}

// ── Banner ────────────────────────────────────────────────────────────────────
const Banner = ({ msg, type }) => !msg ? null : (
  <div style={{ borderRadius:10, padding:"11px 14px", marginBottom:18, fontSize:13, fontWeight:500,
    background:type==="error"?"#fef2f2":"#f0fdf4",
    border:`1px solid ${type==="error"?"#fecaca":"#bbf7d0"}`,
    color:type==="error"?"#dc2626":"#166534" }}>
    {type==="error" ? "❌ " : "✅ "}{msg}
  </div>
);

const DevHint = ({ otp }) => !otp ? null : (
  <div style={{ background:"#fffbeb", border:"1.5px dashed #f59e0b", borderRadius:10,
    padding:"10px 14px", marginBottom:16, fontSize:12 }}>
    <div style={{ fontWeight:700, color:"#92400e", marginBottom:4 }}>🛠 Dev Mode — OTP</div>
    <div style={{ fontFamily:"monospace", fontSize:24, fontWeight:900, letterSpacing:8,
      color:"#e85d26", textAlign:"center", padding:"6px 0" }}>{otp}</div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
export default function LoginPage({ role: initialRole, onBack, onRegister }) {
  const { setLoggedInUser } = useAuth();
  const portal = PORTALS.find(p => p.role === initialRole) || PORTALS[0];

  // screens: "login" | "otp" | "forgot" | "reset-otp" | "new-pass" | "done"
  const [screen,     setScreen]     = useState("login");
  const [email,      setEmail]      = useState(portal.demo?.email || "");
  const [password,   setPassword]   = useState("");
  const [otp,        setOtp]        = useState("");
  const [devOtp,     setDevOtp]     = useState("");
  const [newPass,    setNewPass]    = useState("");
  const [confPass,   setConfPass]   = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [resendCd,   setResendCd]   = useState(0);

  useEffect(() => {
    if (resendCd <= 0) return;
    const t = setTimeout(() => setResendCd(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCd]);

  const clear = () => { setError(""); setSuccess(""); };

  // ── Step 1: Login → send OTP ───────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    clear();
    if (!email || !password) return setError("Please enter your email and password");
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/auth/login`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDevOtp(data.devOtp || "");
      setOtp("");
      setScreen("otp");
      setResendCd(30);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify 2FA OTP ─────────────────────────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return setError("Enter the complete 6-digit code");
    clear();
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/auth/verify-otp`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user",  JSON.stringify(data.user));
      setLoggedInUser(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (type = "login") => {
    clear();
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/auth/resend-otp`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ email, type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDevOtp(data.devOtp || "");
      setOtp("");
      setSuccess("New OTP sent!");
      setResendCd(30);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot / Reset flows ───────────────────────────────────────────────────
  const handleForgot = async (e) => {
    e.preventDefault();
    clear();
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/auth/forgot-password`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDevOtp(data.devOtp || "");
      setOtp("");
      setScreen("reset-otp");
      setResendCd(30);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetOTP = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return setError("Enter the complete 6-digit code");
    clear();
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/auth/verify-reset-otp`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResetToken(data.resetToken);
      setNewPass(""); setConfPass("");
      setScreen("new-pass");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    clear();
    if (newPass.length < 6) return setError("Password must be at least 6 characters");
    if (newPass !== confPass) return setError("Passwords do not match");
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/auth/reset-password`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ resetToken, newPassword: newPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setScreen("done");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Shared styles ──────────────────────────────────────────────────────────
  const inputStyle = {
    width:"100%", padding:"12px 14px", border:"1.5px solid #e2e8f0",
    borderRadius:10, fontSize:14, outline:"none", boxSizing:"border-box",
    color:"#0d1b2a", transition:"border-color 0.15s", background:"white",
  };
  const submitBtn = (label) => (
    <button type="submit" disabled={loading}
      style={{ width:"100%", padding:"13px",
        background:loading?"#ccc":`linear-gradient(135deg,${portal.color},${portal.color}cc)`,
        color:"white", border:"none", borderRadius:12, fontWeight:800, fontSize:15,
        cursor:loading?"not-allowed":"pointer",
        boxShadow:loading?"none":`0 4px 14px ${portal.color}44`,
        transition:"all 0.2s" }}>
      {loading ? "⏳ Please wait..." : label}
    </button>
  );

  const backLink = (label, to) => (
    <button type="button" onClick={() => { clear(); setScreen(to); }}
      style={{ background:"none", border:"none", color:"#8898aa", fontSize:13,
        cursor:"pointer", padding:0, marginBottom:20, display:"flex", alignItems:"center", gap:6 }}>
      ← {label}
    </button>
  );

  // ── Screen renderer ────────────────────────────────────────────────────────
  const renderScreen = () => {
    // ── Login ────────────────────────────────────────────────────────────
    if (screen === "login") return (
      <form onSubmit={handleLogin}>
        <Banner msg={error} type="error"/>
        <div style={{ marginBottom:18 }}>
          <label style={{ fontSize:11, fontWeight:700, color:"#8898aa",
            textTransform:"uppercase", letterSpacing:0.8, display:"block", marginBottom:7 }}>
            Email Address
          </label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
            placeholder="you@college.edu" autoFocus style={inputStyle}
            onFocus={e=>e.target.style.borderColor=portal.color}
            onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
        </div>
        <div style={{ marginBottom:6 }}>
          <label style={{ fontSize:11, fontWeight:700, color:"#8898aa",
            textTransform:"uppercase", letterSpacing:0.8, display:"block", marginBottom:7 }}>
            Password
          </label>
          <div style={{ position:"relative" }}>
            <input type={showPass?"text":"password"} value={password}
              onChange={e=>setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{...inputStyle, paddingRight:44}}
              onFocus={e=>e.target.style.borderColor=portal.color}
              onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
            <button type="button" onClick={()=>setShowPass(s=>!s)}
              style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                background:"none", border:"none", cursor:"pointer", fontSize:16, color:"#8898aa" }}>
              {showPass?"🙈":"👁️"}
            </button>
          </div>
        </div>
        <div style={{ textAlign:"right", marginBottom:22 }}>
          <button type="button" onClick={()=>{clear();setScreen("forgot");}}
            style={{ background:"none", border:"none", color:portal.color, fontSize:13,
              fontWeight:600, cursor:"pointer", textDecoration:"underline" }}>
            Forgot Password?
          </button>
        </div>
        {submitBtn(`Sign In as ${portal.label} →`)}

        {/* Demo fill */}
        {portal.demo && (
          <div style={{ marginTop:18, padding:"12px 16px", background:portal.bg,
            borderRadius:12, border:`1px solid ${portal.border}`, textAlign:"center" }}>
            <div style={{ fontSize:11, fontWeight:700, color:portal.color,
              textTransform:"uppercase", letterSpacing:0.6, marginBottom:8 }}>
              Quick Demo Fill
            </div>
            <button type="button"
              onClick={() => { setEmail(portal.demo.email); setPassword(portal.demo.pass); }}
              style={{ padding:"7px 18px", borderRadius:8, border:`1.5px solid ${portal.color}`,
                background:"white", color:portal.color, fontSize:12, fontWeight:700,
                cursor:"pointer", transition:"all 0.15s" }}
              onMouseOver={e=>{e.currentTarget.style.background=portal.color;e.currentTarget.style.color="white";}}
              onMouseOut={e=>{e.currentTarget.style.background="white";e.currentTarget.style.color=portal.color;}}>
              Fill Demo Credentials
            </button>
            <div style={{ fontSize:11, color:"#8898aa", marginTop:6 }}>{portal.demo.email}</div>
          </div>
        )}

        {/* Register link */}
        {portal.canRegister && (
          <div style={{ textAlign:"center", marginTop:18, fontSize:13, color:"#8898aa" }}>
            New {portal.label}?{" "}
            <button type="button" onClick={onRegister}
              style={{ background:"none", border:"none", color:portal.color,
                fontWeight:700, cursor:"pointer", textDecoration:"underline" }}>
              Create Account
            </button>
          </div>
        )}
      </form>
    );

    // ── 2FA OTP ────────────────────────────────────────────────────────────
    if (screen === "otp") return (
      <form onSubmit={handleVerifyOTP}>
        {backLink("Back to login", "login")}
        <div style={{ textAlign:"center", marginBottom:16 }}>
          <div style={{ fontSize:48, marginBottom:10 }}>🔐</div>
          <h3 style={{ fontSize:18, fontWeight:800, color:"#0d1b2a", margin:"0 0 6px" }}>
            Verify Your Identity
          </h3>
          <p style={{ color:"#8898aa", fontSize:13, margin:0 }}>
            Enter the 6-digit code sent to<br/>
            <strong style={{ color:"#0d1b2a" }}>{email}</strong>
          </p>
        </div>
        <Banner msg={error} type="error"/>
        <Banner msg={success} type="success"/>
        <DevHint otp={devOtp}/>
        <OTPBoxes value={otp} onChange={setOtp}/>
        {submitBtn("Verify & Sign In ✓")}
        <div style={{ textAlign:"center", marginTop:16 }}>
          <span style={{ color:"#8898aa", fontSize:13 }}>Didn't get it? </span>
          {resendCd > 0
            ? <span style={{ color:"#aaa", fontSize:13 }}>Resend in {resendCd}s</span>
            : <button type="button" onClick={()=>handleResend("login")}
                style={{ background:"none", border:"none", color:portal.color,
                  fontSize:13, fontWeight:700, cursor:"pointer", textDecoration:"underline" }}>
                Resend OTP
              </button>}
        </div>
      </form>
    );

    // ── Forgot ─────────────────────────────────────────────────────────────
    if (screen === "forgot") return (
      <form onSubmit={handleForgot}>
        {backLink("Back to login", "login")}
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:48, marginBottom:10 }}>🔑</div>
          <h3 style={{ fontSize:18, fontWeight:800, color:"#0d1b2a", margin:"0 0 6px" }}>
            Forgot Password?
          </h3>
          <p style={{ color:"#8898aa", fontSize:13 }}>
            Enter your registered email and we'll send a reset code.
          </p>
        </div>
        <Banner msg={error} type="error"/>
        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:11, fontWeight:700, color:"#8898aa",
            textTransform:"uppercase", letterSpacing:0.8, display:"block", marginBottom:7 }}>
            Registered Email
          </label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
            placeholder="you@college.edu" autoFocus style={inputStyle}
            onFocus={e=>e.target.style.borderColor=portal.color}
            onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
        </div>
        {submitBtn("Send Reset Code →")}
      </form>
    );

    // ── Reset OTP ──────────────────────────────────────────────────────────
    if (screen === "reset-otp") return (
      <form onSubmit={handleVerifyResetOTP}>
        {backLink("Back", "forgot")}
        <div style={{ textAlign:"center", marginBottom:12 }}>
          <div style={{ fontSize:48, marginBottom:10 }}>📧</div>
          <h3 style={{ fontSize:18, fontWeight:800, color:"#0d1b2a", margin:"0 0 6px" }}>
            Check Your Email
          </h3>
          <p style={{ color:"#8898aa", fontSize:13, margin:0 }}>
            Reset code sent to<br/>
            <strong style={{ color:"#0d1b2a" }}>{email}</strong>
          </p>
        </div>
        <Banner msg={error} type="error"/>
        <Banner msg={success} type="success"/>
        <DevHint otp={devOtp}/>
        <OTPBoxes value={otp} onChange={setOtp}/>
        {submitBtn("Verify Code →")}
        <div style={{ textAlign:"center", marginTop:16 }}>
          <span style={{ color:"#8898aa", fontSize:13 }}>Didn't get it? </span>
          {resendCd > 0
            ? <span style={{ color:"#aaa", fontSize:13 }}>Resend in {resendCd}s</span>
            : <button type="button" onClick={()=>handleResend("reset")}
                style={{ background:"none", border:"none", color:portal.color,
                  fontSize:13, fontWeight:700, cursor:"pointer", textDecoration:"underline" }}>
                Resend Code
              </button>}
        </div>
      </form>
    );

    // ── New Password ───────────────────────────────────────────────────────
    if (screen === "new-pass") return (
      <form onSubmit={handleResetPassword}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:48, marginBottom:10 }}>🛡️</div>
          <h3 style={{ fontSize:18, fontWeight:800, color:"#0d1b2a", margin:"0 0 6px" }}>
            Set New Password
          </h3>
        </div>
        <Banner msg={error} type="error"/>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:11, fontWeight:700, color:"#8898aa",
            textTransform:"uppercase", letterSpacing:0.8, display:"block", marginBottom:7 }}>
            New Password
          </label>
          <input type="password" value={newPass} onChange={e=>setNewPass(e.target.value)}
            placeholder="Min 6 characters" autoFocus style={inputStyle}
            onFocus={e=>e.target.style.borderColor=portal.color}
            onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
        </div>
        <div style={{ marginBottom:24 }}>
          <label style={{ fontSize:11, fontWeight:700, color:"#8898aa",
            textTransform:"uppercase", letterSpacing:0.8, display:"block", marginBottom:7 }}>
            Confirm Password
          </label>
          <input type="password" value={confPass} onChange={e=>setConfPass(e.target.value)}
            placeholder="Repeat new password" style={inputStyle}
            onFocus={e=>e.target.style.borderColor=portal.color}
            onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
        </div>
        {submitBtn("Reset Password ✓")}
      </form>
    );

    // ── Done ────────────────────────────────────────────────────────────────
    if (screen === "done") return (
      <div style={{ textAlign:"center", padding:"20px 0" }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
        <h3 style={{ fontSize:20, fontWeight:800, color:"#0d1b2a", margin:"0 0 10px" }}>
          Password Reset!
        </h3>
        <p style={{ color:"#4a5568", fontSize:14, marginBottom:28 }}>
          Your password has been updated. You can now sign in.
        </p>
        <button onClick={() => { clear(); setPassword(""); setOtp(""); setScreen("login"); }}
          style={{ padding:"13px 32px",
            background:`linear-gradient(135deg,${portal.color},${portal.color}cc)`,
            color:"white", border:"none", borderRadius:12, fontWeight:800,
            fontSize:15, cursor:"pointer",
            boxShadow:`0 4px 14px ${portal.color}44` }}>
          Sign In Now →
        </button>
      </div>
    );
  };

  // ── Layout ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0d1b2a 0%,#1a2f4a 100%)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:480 }}>

        {/* Role badge + back to portal */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:40, height:40, borderRadius:10,
              background:portal.bg, border:`1.5px solid ${portal.border}`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
              {portal.icon}
            </div>
            <div>
              <div style={{ color:"white", fontWeight:700, fontSize:14 }}>{portal.label} Portal</div>
              <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>{portal.tagline}</div>
            </div>
          </div>
          <button onClick={onBack}
            style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)",
              color:"rgba(255,255,255,0.6)", borderRadius:8, padding:"6px 14px",
              fontSize:12, cursor:"pointer", transition:"all 0.15s" }}
            onMouseOver={e=>{e.currentTarget.style.background="rgba(255,255,255,0.15)";}}
            onMouseOut={e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)";}}>
            ← All Portals
          </button>
        </div>

        {/* Card */}
        <div style={{ background:"white", borderRadius:24, padding:36,
          boxShadow:"0 24px 80px rgba(0,0,0,0.3)" }}>

          {/* Top accent bar */}
          <div style={{ height:4, background:`linear-gradient(90deg,${portal.color},${portal.color}88)`,
            borderRadius:99, marginBottom:28, marginLeft:-36, marginRight:-36, marginTop:-36,
            borderTopLeftRadius:24, borderTopRightRadius:24 }}/>

          {screen === "login" && (
            <div style={{ marginBottom:24 }}>
              <h2 style={{ fontSize:22, fontWeight:800, color:"#0d1b2a", margin:"0 0 4px" }}>
                Welcome back
              </h2>
              <p style={{ color:"#8898aa", fontSize:13, margin:0 }}>
                Sign in to your <span style={{ color:portal.color, fontWeight:600 }}>{portal.label}</span> account
              </p>
            </div>
          )}

          {renderScreen()}
        </div>
      </div>
    </div>
  );
}