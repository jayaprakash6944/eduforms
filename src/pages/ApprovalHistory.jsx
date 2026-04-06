// ─────────────────────────────────────────────────────────────────────────────
// ApprovalHistory.jsx — Mentor / HOD: shows all dept applications they acted on
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";

const BASE  = "http://localhost:5000/api";
const apiFetch = async (path) => {
  const token = localStorage.getItem("token");
  const res   = await fetch(BASE + path, { headers: { Authorization: "Bearer " + token } });
  const data  = await res.json();
  if (!res.ok) throw new Error(data.message || "Error");
  return data;
};

const ROLE_COLORS = { mentor:"#2563eb", hod:"#7c3aed" };

const FINAL_STATUS = {
  approved:    { label:"Fully Approved",  color:"#059669", bg:"#f0fdf4" },
  rejected:    { label:"Rejected",        color:"#dc2626", bg:"#fef2f2" },
  "in-review": { label:"In Review",       color:"#2563eb", bg:"#eff6ff" },
  pending:     { label:"Pending",         color:"#f59e0b", bg:"#fffbeb" },
};

const MY_DECISION = {
  approved: { label:"✓ Approved", color:"#059669", bg:"#f0fdf4" },
  rejected: { label:"✗ Rejected", color:"#dc2626", bg:"#fef2f2" },
};

// ── Detail View ───────────────────────────────────────────────────────────────
function HistoryDetail({ app, onBack, myRole }) {
  const accentColor = ROLE_COLORS[myRole] || "#374151";
  const formData  = app.formData instanceof Object ? Object.entries(app.formData) : [];
  const myStep    = (app.steps||[]).find(s => s.role === myRole);
  const stepColor = myStep?.status === "approved" ? "#059669"
                  : myStep?.status === "rejected"  ? "#dc2626" : "#8898aa";

  return (
    <div style={{ padding:"28px 32px" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, margin:0 }}>{app.formName}</h1>
          <p style={{ color:"#8898aa", fontSize:13, marginTop:4 }}>
            {app.appId} · Submitted by {app.student?.name} ({app.student?.rollNo})
          </p>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <button onClick={onBack}
            style={{ padding:"8px 18px", borderRadius:10,
              border:"1.5px solid #e8e4dc", background:"white",
              fontSize:13, fontWeight:600, cursor:"pointer" }}>
            ← Back to History
          </button>
        </div>
      </div>

      {/* My decision banner */}
      {myStep && (
        <div style={{ background:myStep.status==="approved"?"#f0fdf4":"#fef2f2",
          border:`1.5px solid ${stepColor}44`, borderRadius:14,
          padding:"16px 22px", marginBottom:22,
          display:"flex", alignItems:"center", gap:14 }}>
          <span style={{ fontSize:36 }}>
            {myStep.status==="approved" ? "✅" : "❌"}
          </span>
          <div>
            <div style={{ fontWeight:800, fontSize:16, color:stepColor }}>
              You {myStep.status==="approved" ? "Approved" : "Rejected"} this application
            </div>
            <div style={{ fontSize:13, color:"#4a5568", marginTop:4 }}>
              {myStep.date ? new Date(myStep.date).toLocaleString("en-IN") : "Date not recorded"}
            </div>
            {myStep.comment && (
              <div style={{ marginTop:8, background:"white",
                border:`1px solid ${stepColor}44`, borderRadius:8,
                padding:"8px 12px", fontSize:13, color:stepColor, fontWeight:600 }}>
                💬 Your remark: "{myStep.comment}"
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20 }}>
        {/* Left column */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* Form data */}
          <div style={{ background:"white", borderRadius:16, padding:24,
            boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>
              Submitted Form Data
            </h3>
            {formData.length === 0 ? (
              <div style={{ color:"#aaa", fontSize:13 }}>No form data</div>
            ) : (
              <div style={{ background:"#f9fafb", borderRadius:12,
                overflow:"hidden", border:"1px solid #e8e4dc" }}>
                {formData.map(([k,v],i) => (
                  <div key={k} style={{ display:"flex", padding:"10px 16px",
                    background:i%2===0?"white":"#f9fafb",
                    borderBottom:"1px solid #f0ebe3" }}>
                    <span style={{ fontSize:12, color:"#8898aa", fontWeight:600,
                      width:"40%", textTransform:"capitalize" }}>{k}</span>
                    <span style={{ fontSize:13, fontWeight:600 }}>{v||"—"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Full approval chain */}
          <div style={{ background:"white", borderRadius:16, padding:24,
            boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>
              Approval Chain
            </h3>
            {(app.steps||[]).map((s,i) => {
              const isMe = s.role === myRole;
              const c = s.status==="approved" ? "#059669"
                      : s.status==="rejected" ? "#dc2626"
                      : s.status==="pending"  ? accentColor
                      : "#d1d5db";
              return (
                <div key={i} style={{ display:"flex", gap:14, marginBottom:14,
                  padding: isMe ? "14px" : "8px 12px",
                  borderRadius:12,
                  background: isMe ? accentColor+"0d" : "transparent",
                  border: isMe ? `1.5px solid ${accentColor}33` : "none" }}>
                  <div style={{ width:30, height:30, borderRadius:"50%", background:c,
                    color:"white", display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:13, fontWeight:800, flexShrink:0 }}>
                    {s.status==="approved" ? "✓" : s.status==="rejected" ? "✗" : i+1}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between",
                      alignItems:"center" }}>
                      <div style={{ fontSize:14, fontWeight:700 }}>
                        {s.name}
                        {isMe && (
                          <span style={{ marginLeft:8, fontSize:10, background:accentColor,
                            color:"white", padding:"2px 8px", borderRadius:99 }}>
                            You
                          </span>
                        )}
                      </div>
                      {s.date && (
                        <span style={{ fontSize:11, color:"#8898aa" }}>
                          {new Date(s.date).toLocaleDateString("en-IN")}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize:12, color:c, fontWeight:600, marginTop:3 }}>
                      {s.status==="waiting"  ? "⏳ Waiting"
                     : s.status==="pending"  ? "🔄 Under Review"
                     : s.status==="approved" ? "✅ Approved"
                     :                         "❌ Rejected"}
                    </div>
                    {s.comment && (
                      <div style={{ background:"#f5f2ed", borderRadius:8,
                        padding:"6px 10px", marginTop:6, fontSize:12,
                        color:"#4a5568", borderLeft:`3px solid ${c}` }}>
                        💬 "{s.comment}"
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Attachments */}
          {app.attachments?.length > 0 && (
            <div style={{ background:"white", borderRadius:16, padding:24,
              boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:14 }}>
                Supporting Documents ({app.attachments.length})
              </h3>
              {app.attachments.map((f,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12,
                  padding:"10px 0", borderBottom:"1px solid #f5f2ed" }}>
                  <span style={{ fontSize:22 }}>
                    {f.mimetype==="application/pdf" ? "📄" : "🖼️"}
                  </span>
                  <span style={{ flex:1, fontSize:13, fontWeight:600 }}>
                    {f.originalName||f.filename}
                  </span>
                  <a href={`http://localhost:5000/uploads/${f.filename}`}
                    target="_blank" rel="noreferrer"
                    style={{ padding:"5px 14px", borderRadius:8, background:"#f5f2ed",
                      color:"#374151", fontSize:12, fontWeight:700,
                      textDecoration:"none" }}>
                    View ↗
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Student info */}
        <div>
          <div style={{ background:"white", borderRadius:14, padding:20,
            boxShadow:"0 2px 12px rgba(0,0,0,0.06)", position:"sticky", top:20 }}>
            <h4 style={{ fontSize:12, fontWeight:800, color:"#8898aa",
              textTransform:"uppercase", letterSpacing:0.4, marginBottom:14 }}>
              Student Info
            </h4>
            <div style={{ textAlign:"center", marginBottom:16 }}>
              <div style={{ width:52, height:52, borderRadius:"50%",
                background:"#e85d26", color:"white",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontWeight:800, fontSize:18, margin:"0 auto 8px" }}>
                {(app.student?.name||"S").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
              </div>
              <div style={{ fontWeight:700, fontSize:15 }}>{app.student?.name}</div>
              <div style={{ fontSize:12, color:"#8898aa" }}>{app.student?.rollNo}</div>
            </div>
            {[
              ["Department", app.student?.dept || app.dept],
              ["Year",       app.student?.year],
              ["Email",      app.student?.email],
              ["Form",       app.formName],
              ["Category",   app.category],
              ["Submitted",  new Date(app.submittedOn||app.createdAt).toLocaleDateString("en-IN")],
              ["Final Status", (FINAL_STATUS[app.status]?.label || app.status)],
            ].filter(([,v])=>v).map(([k,v]) => (
              <div key={k} style={{ marginBottom:9, paddingBottom:9,
                borderBottom:"1px solid #f5f2ed" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#aaa",
                  textTransform:"uppercase", letterSpacing:0.3 }}>{k}</div>
                <div style={{ fontSize:13, fontWeight:600, marginTop:2 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main List ─────────────────────────────────────────────────────────────────
export default function ApprovalHistory() {
  const { user }      = useAuth();
  const role          = user?.role;
  const dept          = user?.dept;
  const accentColor   = ROLE_COLORS[role] || "#374151";

  const [apps,     setApps]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [search,   setSearch]   = useState("");
  // Filter by MY decision (not final app status)
  const [decisionF, setDecisionF] = useState("all");
  const [selected, setSelected]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await apiFetch("/applications?history=true");
      setApps(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load history. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Stats based on MY decision
  const stats = {
    total:    apps.length,
    approved: apps.filter(a => (a.steps||[]).find(s=>s.role===role)?.status === "approved").length,
    rejected: apps.filter(a => (a.steps||[]).find(s=>s.role===role)?.status === "rejected").length,
  };

  // Filter by MY decision and search
  const filtered = apps.filter(a => {
    const myStep   = (a.steps||[]).find(s => s.role === role);
    const myAction = myStep?.status;

    const matchDecision = decisionF === "all" || myAction === decisionF;
    const matchSearch   =
      a.formName?.toLowerCase().includes(search.toLowerCase()) ||
      a.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.appId?.toLowerCase().includes(search.toLowerCase()) ||
      a.student?.rollNo?.toLowerCase().includes(search.toLowerCase());

    return matchDecision && matchSearch;
  });

  if (selected) return (
    <HistoryDetail app={selected} onBack={()=>setSelected(null)} myRole={role}/>
  );

  return (
    <div style={{ padding:"28px 32px" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, margin:0 }}>
            Approval History
          </h1>
          <p style={{ color:"#8898aa", fontSize:13, marginTop:4 }}>
            {dept ? `${dept} department` : "Your department"} · Applications you have reviewed
          </p>
        </div>
        <button onClick={load}
          style={{ padding:"8px 16px", borderRadius:10,
            border:"1.5px solid #e8e4dc", background:"white",
            fontSize:13, fontWeight:600, cursor:"pointer" }}>
          🔄 Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)",
        gap:14, marginBottom:20 }}>
        {[
          { icon:"📋", value:stats.total,    label:"Total Reviewed",  color:"#374151", bg:"#f9fafb" },
          { icon:"✅", value:stats.approved, label:"You Approved",    color:"#059669", bg:"#f0fdf4" },
          { icon:"❌", value:stats.rejected, label:"You Rejected",    color:"#dc2626", bg:"#fef2f2" },
        ].map(s => (
          <div key={s.label} style={{ background:"white", borderRadius:14, padding:20,
            boxShadow:"0 2px 12px rgba(0,0,0,0.06)",
            display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:11, background:s.bg,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:22 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:28, fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:12, color:"#8898aa" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filter by MY decision */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <div style={{ background:"white", borderRadius:10, padding:"9px 14px",
          display:"flex", gap:8, alignItems:"center", flex:1, minWidth:220,
          boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
          <span>🔍</span>
          <input placeholder="Search by form, student name, roll no or app ID..."
            value={search} onChange={e=>setSearch(e.target.value)}
            style={{ border:"none", outline:"none", background:"transparent",
              fontSize:13, flex:1 }}/>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {[
            { value:"all",      label:"All" },
            { value:"approved", label:"I Approved" },
            { value:"rejected", label:"I Rejected" },
          ].map(f => (
            <button key={f.value} onClick={()=>setDecisionF(f.value)}
              style={{ padding:"6px 16px", borderRadius:99, fontSize:12,
                fontWeight:600, border:"1.5px solid", cursor:"pointer",
                background: decisionF===f.value ? accentColor : "white",
                color:      decisionF===f.value ? "white"      : accentColor,
                borderColor: accentColor }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background:"#fef2f2", border:"1px solid #fecaca",
          borderRadius:10, padding:"12px 16px", marginBottom:16,
          fontSize:13, color:"#dc2626" }}>❌ {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ background:"white", borderRadius:16, padding:"60px 20px",
          textAlign:"center", color:"#8898aa" }}>⏳ Loading history...</div>

      ) : filtered.length === 0 ? (
        <div style={{ background:"white", borderRadius:16, padding:"60px 20px",
          textAlign:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📜</div>
          <div style={{ fontSize:16, fontWeight:700, marginBottom:4 }}>
            {apps.length === 0 ? "No approvals yet" : "No results for this filter"}
          </div>
          <div style={{ fontSize:13, color:"#8898aa" }}>
            {apps.length === 0
              ? "Applications you approve or reject from your department will appear here"
              : "Try changing the filter above"}
          </div>
        </div>

      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filtered.map(app => {
            const myStep    = (app.steps||[]).find(s => s.role === role);
            const myAction  = myStep?.status;
            const myDecision= MY_DECISION[myAction];
            const finalSt   = FINAL_STATUS[app.status] || FINAL_STATUS.pending;

            return (
              <div key={app._id}
                style={{ background:"white", borderRadius:14, padding:"18px 22px",
                  boxShadow:"0 2px 12px rgba(0,0,0,0.06)",
                  border:`1.5px solid ${myAction==="approved"?"#bbf7d0":myAction==="rejected"?"#fecaca":"transparent"}`,
                  transition:"all 0.15s" }}
                onMouseOver={e=>e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.1)"}
                onMouseOut={e=>e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.06)"}>

                <div style={{ display:"flex", alignItems:"flex-start", gap:16 }}>

                  {/* Decision icon */}
                  <div style={{ width:44, height:44, borderRadius:12, flexShrink:0,
                    background: myAction==="approved"?"#f0fdf4":"#fef2f2",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:22 }}>
                    {myAction==="approved" ? "✅" : "❌"}
                  </div>

                  {/* Main content */}
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between",
                      alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
                      <div>
                        <div style={{ fontSize:15, fontWeight:800, color:"#0d1b2a" }}>
                          {app.formName}
                        </div>
                        <div style={{ fontSize:12, color:"#8898aa", marginTop:3 }}>
                          {app.appId} · {app.category}
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        {/* MY decision badge */}
                        {myDecision && (
                          <span style={{ background:myDecision.bg, color:myDecision.color,
                            fontSize:12, fontWeight:800, padding:"4px 12px",
                            borderRadius:99, border:`1px solid ${myDecision.color}33` }}>
                            {myDecision.label}
                          </span>
                        )}
                        {/* Final app status */}
                        <span style={{ background:finalSt.bg, color:finalSt.color,
                          fontSize:11, fontWeight:600, padding:"3px 10px",
                          borderRadius:99 }}>
                          {finalSt.label}
                        </span>
                      </div>
                    </div>

                    {/* Student row */}
                    <div style={{ display:"flex", gap:20, marginTop:10,
                      flexWrap:"wrap", alignItems:"center" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:30, height:30, borderRadius:"50%",
                          background:"#e85d26", color:"white",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:11, fontWeight:800, flexShrink:0 }}>
                          {(app.student?.name||"S").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:700 }}>
                            {app.student?.name}
                          </div>
                          <div style={{ fontSize:11, color:"#8898aa" }}>
                            {app.student?.rollNo}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize:12, color:"#4a5568",
                        background:"#f5f2ed", padding:"3px 10px", borderRadius:99 }}>
                        📍 {app.student?.dept || app.dept || "—"}
                      </div>
                      {myStep?.date && (
                        <div style={{ fontSize:11, color:"#8898aa" }}>
                          🕐 {new Date(myStep.date).toLocaleDateString("en-IN")}
                        </div>
                      )}
                    </div>

                    {/* My remark if any */}
                    {myStep?.comment && (
                      <div style={{ marginTop:10, background:"#f9fafb",
                        border:`1px solid ${myDecision?.color||"#e8e4dc"}33`,
                        borderLeft:`3px solid ${myDecision?.color||"#8898aa"}`,
                        borderRadius:8, padding:"7px 12px",
                        fontSize:12, color:"#4a5568" }}>
                        💬 <span style={{ fontWeight:600 }}>Your remark:</span> "{myStep.comment}"
                      </div>
                    )}
                  </div>

                  {/* View button */}
                  <button onClick={()=>setSelected(app)}
                    style={{ padding:"9px 18px", borderRadius:10,
                      border:`1.5px solid ${accentColor}`,
                      background:"white", color:accentColor,
                      fontSize:13, fontWeight:700, cursor:"pointer",
                      flexShrink:0, alignSelf:"center", transition:"all 0.15s" }}
                    onMouseOver={e=>{e.currentTarget.style.background=accentColor;e.currentTarget.style.color="white";}}
                    onMouseOut={e=>{e.currentTarget.style.background="white";e.currentTarget.style.color=accentColor;}}>
                    View →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}