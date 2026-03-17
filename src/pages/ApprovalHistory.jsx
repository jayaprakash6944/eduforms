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
const STATUS_MAP  = {
  approved:    { label:"Approved",  color:"#059669", bg:"#f0fdf4" },
  rejected:    { label:"Rejected",  color:"#dc2626", bg:"#fef2f2" },
  "in-review": { label:"In Review", color:"#2563eb", bg:"#eff6ff" },
  pending:     { label:"Pending",   color:"#f59e0b", bg:"#fffbeb" },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] || STATUS_MAP.pending;
  return (
    <span style={{ background:s.bg, color:s.color, fontSize:11, fontWeight:700,
      padding:"3px 10px", borderRadius:99, display:"inline-flex", alignItems:"center", gap:5 }}>
      <span style={{ width:6,height:6,borderRadius:"50%",background:s.color }}/>
      {s.label}
    </span>
  );
};

// ── Detail view ───────────────────────────────────────────────────────────────
function HistoryDetail({ app, onBack, myRole }) {
  const formData  = app.formData instanceof Object ? Object.entries(app.formData) : [];
  const myStep    = (app.steps||[]).find(s => s.role === myRole);
  const stepColor = myStep?.status === "approved" ? "#059669" : myStep?.status === "rejected" ? "#dc2626" : "#8898aa";
  const accentColor = ROLE_COLORS[myRole] || "#374151";

  return (
    <div style={{ padding:"28px 32px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, margin:0 }}>{app.formName}</h1>
          <p style={{ color:"#8898aa", fontSize:13, marginTop:4 }}>
            {app.appId} · Submitted by {app.student?.name}
          </p>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <StatusBadge status={app.status}/>
          <button onClick={onBack}
            style={{ padding:"8px 16px", borderRadius:10, border:"1.5px solid #e8e4dc",
              background:"white", fontSize:13, fontWeight:600, cursor:"pointer" }}>
            ← Back
          </button>
        </div>
      </div>

      {/* My action banner */}
      {myStep && (
        <div style={{ background:myStep.status==="approved"?"#f0fdf4":"#fef2f2",
          border:`1.5px solid ${stepColor}44`, borderRadius:14,
          padding:"14px 20px", marginBottom:20,
          display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:28 }}>{myStep.status==="approved"?"✅":"❌"}</span>
          <div>
            <div style={{ fontWeight:800, fontSize:15, color:stepColor }}>
              You {myStep.status==="approved"?"Approved":"Rejected"} this application
            </div>
            <div style={{ fontSize:12, color:"#4a5568", marginTop:2 }}>
              {myStep.date ? new Date(myStep.date).toLocaleString() : "—"}
              {myStep.comment ? ` · Remark: "${myStep.comment}"` : ""}
            </div>
          </div>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* Form data */}
          <div style={{ background:"white", borderRadius:16, padding:24,
            boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>Form Details</h3>
            {formData.length === 0 ? (
              <div style={{ color:"#aaa", fontSize:13 }}>No form data</div>
            ) : (
              <div style={{ background:"#f9fafb", borderRadius:12, overflow:"hidden",
                border:"1px solid #e8e4dc" }}>
                {formData.map(([k,v],i) => (
                  <div key={k} style={{ display:"flex", padding:"10px 16px",
                    background:i%2===0?"white":"#f9fafb", borderBottom:"1px solid #f0ebe3" }}>
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
            <h3 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>Full Approval Chain</h3>
            {(app.steps||[]).map((s,i) => {
              const isMe  = s.role === myRole;
              const c     = s.status==="approved"?"#059669":s.status==="rejected"?"#dc2626":
                            s.status==="pending"?accentColor:"#d1d5db";
              return (
                <div key={i} style={{ display:"flex", gap:14, marginBottom:14,
                  padding:isMe?"12px":"8px 12px", borderRadius:12,
                  background:isMe?accentColor+"0d":"transparent",
                  border:isMe?`1.5px solid ${accentColor}33`:"none" }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:c,
                    color:"white", display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:12, fontWeight:800, flexShrink:0 }}>
                    {s.status==="approved"?"✓":s.status==="rejected"?"✗":i+1}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <div style={{ fontSize:14, fontWeight:700 }}>
                        {s.name}
                        {isMe && <span style={{ marginLeft:8, fontSize:10, background:accentColor,
                          color:"white", padding:"2px 7px", borderRadius:99 }}>You</span>}
                      </div>
                      {s.date && <span style={{ fontSize:11, color:"#8898aa" }}>
                        {new Date(s.date).toLocaleDateString()}
                      </span>}
                    </div>
                    <div style={{ fontSize:12, color:c, fontWeight:600, marginTop:2 }}>
                      {s.status==="waiting"?"⏳ Waiting":s.status==="pending"?"🔄 Pending":
                       s.status==="approved"?"✅ Approved":"❌ Rejected"}
                    </div>
                    {s.comment && (
                      <div style={{ background:"#f5f2ed", borderRadius:8, padding:"6px 10px",
                        marginTop:6, fontSize:12, color:"#4a5568",
                        borderLeft:`3px solid ${c}` }}>
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
                  <span style={{ fontSize:22 }}>{f.mimetype==="application/pdf"?"📄":"🖼️"}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600 }}>{f.originalName||f.filename}</div>
                  </div>
                  <a href={`http://localhost:5000/uploads/${f.filename}`}
                    target="_blank" rel="noreferrer"
                    style={{ padding:"5px 14px", borderRadius:8, background:"#f5f2ed",
                      color:"#374151", fontSize:12, fontWeight:700, textDecoration:"none" }}>
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
            boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
            <h4 style={{ fontSize:12, fontWeight:800, color:"#8898aa",
              textTransform:"uppercase", letterSpacing:0.4, marginBottom:14 }}>
              Student
            </h4>
            <div style={{ textAlign:"center", marginBottom:16 }}>
              <div style={{ width:50, height:50, borderRadius:"50%", background:"#e85d26",
                color:"white", display:"flex", alignItems:"center", justifyContent:"center",
                fontWeight:800, fontSize:18, margin:"0 auto 8px" }}>
                {(app.student?.name||"S").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
              </div>
              <div style={{ fontWeight:700, fontSize:15 }}>{app.student?.name}</div>
              <div style={{ fontSize:12, color:"#8898aa" }}>{app.student?.rollNo}</div>
            </div>
            {[["Department",app.student?.dept||app.dept],
              ["Year",       app.student?.year],
              ["Email",      app.student?.email],
              ["Form",       app.formName],
              ["Category",   app.category],
              ["Submitted",  new Date(app.submittedOn||app.createdAt).toLocaleDateString()],
            ].filter(([,v])=>v).map(([k,v]) => (
              <div key={k} style={{ marginBottom:8, paddingBottom:8, borderBottom:"1px solid #f5f2ed" }}>
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
  const { user } = useAuth();
  const role      = user?.role;
  const accentColor = ROLE_COLORS[role] || "#374151";

  const [apps,      setApps]    = useState([]);
  const [loading,   setLoading] = useState(true);
  const [error,     setError]   = useState("");
  const [search,    setSearch]  = useState("");
  const [statusF,   setStatusF] = useState("All");
  const [selected,  setSelected]= useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await apiFetch("/applications?history=true");
      setApps(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Could not load history. Is the backend running?");
    } finally {
      setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = apps.filter(a =>
    (statusF === "All" || a.status === statusF) &&
    (a.formName?.toLowerCase().includes(search.toLowerCase()) ||
     a.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
     a.appId?.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    total:    apps.length,
    approved: apps.filter(a => {
      const myStep = (a.steps||[]).find(s=>s.role===role);
      return myStep?.status === "approved";
    }).length,
    rejected: apps.filter(a => {
      const myStep = (a.steps||[]).find(s=>s.role===role);
      return myStep?.status === "rejected";
    }).length,
  };

  if (selected) return (
    <HistoryDetail app={selected} onBack={()=>setSelected(null)} myRole={role}/>
  );

  return (
    <div style={{ padding:"28px 32px" }}>
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, margin:0 }}>Approval History</h1>
          <p style={{ color:"#8898aa", fontSize:13, marginTop:4 }}>
            Applications you have reviewed from {user?.dept || "your department"}
          </p>
        </div>
        <button onClick={load}
          style={{ padding:"8px 16px", borderRadius:10, border:"1.5px solid #e8e4dc",
            background:"white", fontSize:13, fontWeight:600, cursor:"pointer" }}>
          🔄 Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:20 }}>
        {[
          { icon:"📋", value:stats.total,    label:"Total Reviewed",  color:"#374151", bg:"#f9fafb" },
          { icon:"✅", value:stats.approved, label:"You Approved",    color:"#059669", bg:"#f0fdf4" },
          { icon:"❌", value:stats.rejected, label:"You Rejected",    color:"#dc2626", bg:"#fef2f2" },
        ].map(s => (
          <div key={s.label} style={{ background:"white", borderRadius:14, padding:20,
            boxShadow:"0 2px 12px rgba(0,0,0,0.06)", display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:11, background:s.bg,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:24, fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:12, color:"#8898aa" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <div style={{ background:"white", borderRadius:10, padding:"9px 14px",
          display:"flex", gap:8, alignItems:"center", flex:1, minWidth:220,
          boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
          <span>🔍</span>
          <input placeholder="Search by form, student name or app ID..." value={search}
            onChange={e=>setSearch(e.target.value)}
            style={{ border:"none", outline:"none", background:"transparent", fontSize:13, flex:1 }}/>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {["All","approved","rejected","in-review"].map(s => (
            <button key={s} onClick={()=>setStatusF(s)}
              style={{ padding:"6px 14px", borderRadius:99, fontSize:12, fontWeight:600,
                border:"1.5px solid", cursor:"pointer", textTransform:"capitalize",
                background:statusF===s?accentColor:"white",
                color:statusF===s?"white":accentColor,
                borderColor:accentColor }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {error && (
        <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10,
          padding:"12px 16px", marginBottom:16, fontSize:13, color:"#dc2626" }}>
          ❌ {error}
        </div>
      )}

      {loading ? (
        <div style={{ background:"white", borderRadius:16, padding:"60px 20px",
          textAlign:"center", color:"#8898aa" }}>⏳ Loading history...</div>
      ) : filtered.length === 0 ? (
        <div style={{ background:"white", borderRadius:16, padding:"60px 20px",
          textAlign:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📜</div>
          <div style={{ fontSize:16, fontWeight:700, marginBottom:4 }}>No history yet</div>
          <div style={{ fontSize:13, color:"#8898aa" }}>
            Applications you approve or reject will appear here
          </div>
        </div>
      ) : (
        <div style={{ background:"white", borderRadius:16, overflow:"hidden",
          boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
          {/* Table header */}
          <div style={{ display:"grid",
            gridTemplateColumns:"140px 1fr 1.2fr 120px 110px 110px 90px",
            padding:"10px 20px", background:"#f5f2ed",
            fontSize:11, fontWeight:700, color:"#8898aa",
            textTransform:"uppercase", letterSpacing:0.4 }}>
            <div>App ID</div>
            <div>Form</div>
            <div>Student</div>
            <div>Department</div>
            <div>My Decision</div>
            <div>Final Status</div>
            <div>Action</div>
          </div>

          {filtered.map((app, idx) => {
            const myStep   = (app.steps||[]).find(s => s.role === role);
            const myAction = myStep?.status;
            const myColor  = myAction==="approved"?"#059669":myAction==="rejected"?"#dc2626":"#8898aa";
            const myBg     = myAction==="approved"?"#f0fdf4":myAction==="rejected"?"#fef2f2":"#f9fafb";
            return (
              <div key={app._id}
                style={{ display:"grid",
                  gridTemplateColumns:"140px 1fr 1.2fr 120px 110px 110px 90px",
                  padding:"13px 20px", borderBottom:"1px solid #f5f2ed",
                  alignItems:"center", transition:"background 0.1s" }}
                onMouseOver={e=>e.currentTarget.style.background="#fafaf8"}
                onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                <div style={{ fontSize:12, fontWeight:700, color:accentColor }}>{app.appId}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600 }}>{app.formName}</div>
                  <div style={{ fontSize:10, color:"#8898aa" }}>{app.category}</div>
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600 }}>{app.student?.name}</div>
                  <div style={{ fontSize:10, color:"#8898aa" }}>{app.student?.rollNo}</div>
                </div>
                <div style={{ fontSize:12, color:"#4a5568" }}>
                  {app.student?.dept || app.dept || "—"}
                </div>
                <div>
                  <span style={{ background:myBg, color:myColor, fontSize:11,
                    fontWeight:700, padding:"3px 10px", borderRadius:99,
                    textTransform:"capitalize" }}>
                    {myAction==="approved"?"✓ Approved":myAction==="rejected"?"✗ Rejected":"—"}
                  </span>
                </div>
                <StatusBadge status={app.status}/>
                <button onClick={()=>setSelected(app)}
                  style={{ padding:"5px 12px", borderRadius:8,
                    border:`1.5px solid ${accentColor}`,
                    background:"white", fontSize:11, fontWeight:700,
                    cursor:"pointer", color:accentColor,
                    transition:"all 0.15s" }}
                  onMouseOver={e=>{e.currentTarget.style.background=accentColor;e.currentTarget.style.color="white";}}
                  onMouseOut={e=>{e.currentTarget.style.background="white";e.currentTarget.style.color=accentColor;}}>
                  View →
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}