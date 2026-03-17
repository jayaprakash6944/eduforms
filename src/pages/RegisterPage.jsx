// ─────────────────────────────────────────────────────────────────────────────
// RegisterPage.jsx  —  New user registration (Student / Faculty / Mentor / HOD)
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { PORTALS } from "./PortalPage";

const BASE = "http://localhost:5000/api";

const DEPTS = [
  "Computer Science","Information Technology","Electronics","Mechanical",
  "Civil","Chemical","MBA","MCA","Physics","Mathematics","Other",
];
const YEARS = ["1st Year","2nd Year","3rd Year","4th Year","PG 1st Year","PG 2nd Year"];
const DESIGNATIONS = [
  "Professor","Associate Professor","Assistant Professor",
  "Senior Lecturer","Lecturer","Lab Instructor","HOD","Other",
];

export default function RegisterPage({ preRole, onBack, onSuccess }) {
  const portal = PORTALS.find(p => p.role === preRole) || PORTALS[0];

  const [step,        setStep]        = useState(1);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  const [name,        setName]        = useState("");
  const [email,       setEmail]       = useState("");
  const [pass,        setPass]        = useState("");
  const [confPass,    setConfPass]    = useState("");
  const [role,        setRole]        = useState(preRole || "student");
  const [dept,        setDept]        = useState("");
  const [year,        setYear]        = useState("");
  const [rollNo,      setRollNo]      = useState("");
  const [designation, setDesignation] = useState("");
  const [employeeId,  setEmployeeId]  = useState("");
  const [showPass,    setShowPass]    = useState(false);

  const isStudent = role === "student";
  const isFaculty = role === "faculty";
  const isMentor  = role === "mentor";
  const isHOD     = role === "hod";
  const needsDept = isStudent || isFaculty || isMentor || isHOD;

  const cur = PORTALS.find(p => p.role === role) || portal;

  // Password strength
  const strength = pass.length === 0 ? 0
    : pass.length >= 8 && /[A-Z]/.test(pass) && /\d/.test(pass) ? 3
    : pass.length >= 6 ? 2 : 1;
  const strengthLabel = ["","Weak","Medium","Strong 💪"][strength];
  const strengthColor = ["","#dc2626","#f59e0b","#059669"][strength];
  const strengthWidth = ["0%","30%","60%","100%"][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim())    return setError("Full name is required");
    if (!email.trim())   return setError("Email is required");
    if (pass.length < 6) return setError("Password must be at least 6 characters");
    if (pass !== confPass) return setError("Passwords do not match");
    if (needsDept && !dept) return setError("Please select your department");
    if (isStudent && !year) return setError("Please select your year");
    if (isFaculty && !designation) return setError("Please select your designation");

    setLoading(true);
    try {
      const res = await fetch(`${BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, password: pass, role, dept, year,
          rollNo: isStudent ? rollNo : employeeId,
          designation: isFaculty || isHOD ? designation : "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStep(2);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Success ────────────────────────────────────────────────────────────────
  if (step === 2) return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0d1b2a,#1a2f4a)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"white", borderRadius:24, padding:"48px 40px",
        maxWidth:460, width:"100%", textAlign:"center",
        boxShadow:"0 24px 80px rgba(0,0,0,0.3)" }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
        <h2 style={{ fontSize:24, fontWeight:800, color:"#0d1b2a", marginBottom:8 }}>
          Account Created!
        </h2>
        <p style={{ color:"#4a5568", fontSize:14, marginBottom:24 }}>
          Your <strong>{cur.label}</strong> account has been created successfully.
          You can now sign in with your credentials.
        </p>
        <div style={{ background:cur.bg, border:`1.5px solid ${cur.border}`,
          borderRadius:14, padding:"16px 20px", marginBottom:12, textAlign:"left" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#8898aa",
            textTransform:"uppercase", letterSpacing:0.4, marginBottom:10 }}>
            Account Details
          </div>
          {[
            ["Role",        `${cur.icon} ${cur.label}`],
            ["Name",        name],
            ["Email",       email],
            ["Department",  dept || "—"],
            isFaculty && designation ? ["Designation", designation] : null,
            isFaculty && employeeId  ? ["Employee ID", employeeId]  : null,
            isStudent && rollNo      ? ["Roll No",     rollNo]      : null,
          ].filter(Boolean).map(([k,v]) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between",
              padding:"5px 0", borderBottom:"1px solid "+cur.border,
              fontSize:13 }}>
              <span style={{ color:"#8898aa" }}>{k}</span>
              <span style={{ fontWeight:700, color:cur.color }}>{v}</span>
            </div>
          ))}
        </div>
        <button onClick={() => onSuccess(role)}
          style={{ width:"100%", padding:"13px", marginTop:16,
            background:`linear-gradient(135deg,${cur.color},${cur.color}cc)`,
            color:"white", border:"none", borderRadius:12, fontWeight:800,
            fontSize:15, cursor:"pointer", boxShadow:`0 4px 14px ${cur.color}44` }}>
          Sign In Now →
        </button>
      </div>
    </div>
  );

  // ── Form ───────────────────────────────────────────────────────────────────
  const inp = {
    width:"100%", padding:"11px 13px", border:"1.5px solid #e2e8f0",
    borderRadius:10, fontSize:14, outline:"none", boxSizing:"border-box",
    transition:"border-color 0.15s", background:"white",
  };
  const lbl = {
    fontSize:11, fontWeight:700, color:"#8898aa", textTransform:"uppercase",
    letterSpacing:0.8, display:"block", marginBottom:7,
  };
  const focus = (e) => e.target.style.borderColor = cur.color;
  const blur  = (e) => e.target.style.borderColor = "#e2e8f0";

  return (
    <div style={{ minHeight:"100vh",
      background:"linear-gradient(135deg,#0d1b2a 0%,#1a2f4a 100%)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"white", borderRadius:24, padding:"32px 36px",
        maxWidth:560, width:"100%", boxShadow:"0 24px 80px rgba(0,0,0,0.3)" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
          <div style={{ width:52, height:52, borderRadius:13, background:cur.bg,
            border:`1.5px solid ${cur.border}`, display:"flex",
            alignItems:"center", justifyContent:"center", fontSize:26 }}>
            {cur.icon}
          </div>
          <div>
            <div style={{ fontWeight:800, fontSize:18, color:"#0d1b2a" }}>Create Account</div>
            <div style={{ fontSize:12, color:cur.color, fontWeight:600 }}>
              {cur.label} Portal
            </div>
          </div>
          <button onClick={onBack}
            style={{ marginLeft:"auto", background:"none", border:"1.5px solid #e2e8f0",
              borderRadius:8, padding:"6px 14px", fontSize:12, cursor:"pointer", color:"#4a5568" }}>
            ← Back
          </button>
        </div>

        {/* Faculty info banner */}
        {isFaculty && (
          <div style={{ background:"#f0fdf4", border:"1.5px solid #a7f3d0",
            borderRadius:12, padding:"12px 16px", marginBottom:20,
            display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:20 }}>👨‍🏫</span>
            <div style={{ fontSize:13, color:"#065f46" }}>
              <strong>Faculty Portal Registration</strong> — Fill in your academic details below.
              After registration you can apply for leave, research, FDP and admin forms.
            </div>
          </div>
        )}

        {error && (
          <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10,
            padding:"11px 14px", marginBottom:18, fontSize:13,
            color:"#dc2626", fontWeight:500 }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* ── Role selector (only when not coming direct from a portal) ── */}
          {!preRole && (
            <div style={{ marginBottom:20 }}>
              <label style={lbl}>Register As</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {PORTALS.filter(p => p.canRegister).map(p => (
                  <button key={p.role} type="button" onClick={() => setRole(p.role)}
                    style={{ padding:"10px 14px", borderRadius:10,
                      border:`2px solid ${role===p.role ? p.color : "#e2e8f0"}`,
                      background:role===p.role ? p.bg : "white", cursor:"pointer",
                      display:"flex", alignItems:"center", gap:8,
                      fontSize:13, fontWeight:600,
                      color:role===p.role ? p.color : "#4a5568", transition:"all 0.15s" }}>
                    <span style={{ fontSize:16 }}>{p.icon}</span> {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Full Name ── */}
          <div style={{ marginBottom:16 }}>
            <label style={lbl}>Full Name *</label>
            <input value={name} onChange={e=>setName(e.target.value)}
              placeholder="Dr. / Prof. Your Full Name" style={inp}
              onFocus={focus} onBlur={blur}/>
          </div>

          {/* ── College Email ── */}
          <div style={{ marginBottom:16 }}>
            <label style={lbl}>College Email *</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
              placeholder={isFaculty ? "faculty@college.edu" : "you@college.edu"}
              style={inp} onFocus={focus} onBlur={blur}/>
          </div>

          {/* ── Faculty specific fields ── */}
          {isFaculty && (
            <>
              {/* Designation + Department in one row */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
                <div>
                  <label style={lbl}>Designation *</label>
                  <select value={designation} onChange={e=>setDesignation(e.target.value)}
                    style={{...inp, cursor:"pointer"}}>
                    <option value="">Select designation...</option>
                    {DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Department *</label>
                  <select value={dept} onChange={e=>setDept(e.target.value)}
                    style={{...inp, cursor:"pointer"}}>
                    <option value="">Select department...</option>
                    {DEPTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Employee ID */}
              <div style={{ marginBottom:16 }}>
                <label style={lbl}>Employee / Staff ID (optional)</label>
                <input value={employeeId} onChange={e=>setEmployeeId(e.target.value)}
                  placeholder="e.g. FAC-CS-001" style={inp}
                  onFocus={focus} onBlur={blur}/>
              </div>
            </>
          )}

          {/* ── Student specific fields ── */}
          {isStudent && (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
                <div>
                  <label style={lbl}>Department *</label>
                  <select value={dept} onChange={e=>setDept(e.target.value)}
                    style={{...inp, cursor:"pointer"}}>
                    <option value="">Select dept...</option>
                    {DEPTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Year *</label>
                  <select value={year} onChange={e=>setYear(e.target.value)}
                    style={{...inp, cursor:"pointer"}}>
                    <option value="">Select year...</option>
                    {YEARS.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={lbl}>Roll Number (optional)</label>
                <input value={rollNo} onChange={e=>setRollNo(e.target.value)}
                  placeholder="e.g. CS21B047" style={inp}
                  onFocus={focus} onBlur={blur}/>
              </div>
            </>
          )}

          {/* ── Mentor / HOD fields ── */}
          {(isMentor || isHOD) && (
            <>
              <div style={{ marginBottom:16 }}>
                <label style={lbl}>Department *</label>
                <select value={dept} onChange={e=>setDept(e.target.value)}
                  style={{...inp, cursor:"pointer"}}>
                  <option value="">Select department...</option>
                  {DEPTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={lbl}>Staff / Employee ID (optional)</label>
                <input value={employeeId} onChange={e=>setEmployeeId(e.target.value)}
                  placeholder={isHOD ? "e.g. HOD-CS-001" : "e.g. MNT-CS-001"}
                  style={inp} onFocus={focus} onBlur={blur}/>
              </div>
            </>
          )}

          {/* ── Password ── */}
          <div style={{ marginBottom:16 }}>
            <label style={lbl}>Password *</label>
            <div style={{ position:"relative" }}>
              <input type={showPass?"text":"password"} value={pass}
                onChange={e=>setPass(e.target.value)}
                placeholder="Min 6 characters"
                style={{...inp, paddingRight:44}}
                onFocus={focus} onBlur={blur}/>
              <button type="button" onClick={()=>setShowPass(s=>!s)}
                style={{ position:"absolute", right:12, top:"50%",
                  transform:"translateY(-50%)", background:"none",
                  border:"none", cursor:"pointer", fontSize:16, color:"#8898aa" }}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
            {pass && (
              <div style={{ marginTop:6 }}>
                <div style={{ height:3, background:"#f0ebe3",
                  borderRadius:99, overflow:"hidden" }}>
                  <div style={{ width:strengthWidth, height:"100%",
                    background:strengthColor, transition:"width 0.3s" }}/>
                </div>
                <div style={{ fontSize:11, color:strengthColor,
                  fontWeight:600, marginTop:3 }}>{strengthLabel}</div>
              </div>
            )}
          </div>

          {/* ── Confirm Password ── */}
          <div style={{ marginBottom:24 }}>
            <label style={lbl}>Confirm Password *</label>
            <input type={showPass?"text":"password"} value={confPass}
              onChange={e=>setConfPass(e.target.value)}
              placeholder="Repeat your password"
              style={{ ...inp,
                borderColor: confPass && confPass !== pass ? "#dc2626" : "#e2e8f0" }}
              onFocus={focus}
              onBlur={e => e.target.style.borderColor =
                (confPass && confPass !== pass ? "#dc2626" : "#e2e8f0")}/>
            {confPass && confPass !== pass && (
              <div style={{ fontSize:11, color:"#dc2626", marginTop:4, fontWeight:600 }}>
                ⚠ Passwords do not match
              </div>
            )}
          </div>

          <button type="submit" disabled={loading}
            style={{ width:"100%", padding:"13px",
              background:loading ? "#ccc"
                : `linear-gradient(135deg,${cur.color},${cur.color}cc)`,
              color:"white", border:"none", borderRadius:12, fontWeight:800,
              fontSize:15, cursor:loading ? "not-allowed" : "pointer",
              boxShadow:loading ? "none" : `0 4px 14px ${cur.color}44`,
              transition:"all 0.2s" }}>
            {loading ? "⏳ Creating account..." : `Create ${cur.label} Account →`}
          </button>
        </form>

        <div style={{ textAlign:"center", marginTop:18, fontSize:13, color:"#8898aa" }}>
          Already have an account?{" "}
          <button onClick={onBack}
            style={{ background:"none", border:"none", color:cur.color,
              fontWeight:700, cursor:"pointer", textDecoration:"underline" }}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}