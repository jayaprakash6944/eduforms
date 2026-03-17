// ─────────────────────────────────────────────────────────────────────────────
// FeedbackAdmin.jsx  —  Admin view: read, respond & resolve all feedback
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from "react";
import { useApp } from "../../contexts/AppContext";

const BASE  = "http://localhost:5000/api";
const token = () => localStorage.getItem("token");
const apiFetch = async (path, opts={}) => {
  const res  = await fetch(BASE+path, {
    ...opts, headers:{ Authorization:"Bearer "+token(), "Content-Type":"application/json", ...(opts.headers||{}) }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message||"Error");
  return data;
};

const TYPES = [
  { value:"missing_form", label:"Missing Form",  icon:"📋", color:"#e85d26" },
  { value:"form_issue",   label:"Form Issue",     icon:"⚠️", color:"#f59e0b" },
  { value:"suggestion",   label:"Suggestion",     icon:"💡", color:"#2563eb" },
  { value:"bug_report",   label:"Bug Report",     icon:"🐛", color:"#dc2626" },
  { value:"other",        label:"Other",          icon:"📝", color:"#374151" },
];
const STATUSES = [
  { value:"open",        label:"Open",        color:"#f59e0b", bg:"#fffbeb" },
  { value:"in-progress", label:"In Progress", color:"#2563eb", bg:"#eff6ff" },
  { value:"resolved",    label:"Resolved",    color:"#059669", bg:"#f0fdf4" },
  { value:"closed",      label:"Closed",      color:"#374151", bg:"#f9fafb" },
];
const PRIORITIES = {
  low:    { label:"Low",    color:"#059669", bg:"#f0fdf4" },
  medium: { label:"Medium", color:"#f59e0b", bg:"#fffbeb" },
  high:   { label:"High",   color:"#dc2626", bg:"#fef2f2" },
};
const ROLE_COLORS = { student:"#e85d26", faculty:"#059669", mentor:"#2563eb", hod:"#7c3aed" };

export default function FeedbackAdmin() {
  const { refetchFeedbackCount } = useApp();
  const [items,    setItems]    = useState([]);
  const [stats,    setStats]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [search,   setSearch]   = useState("");
  const [typeF,    setTypeF]    = useState("all");
  const [statusF,  setStatusF]  = useState("all");
  const [toast,    setToast]    = useState("");

  // Respond modal state
  const [adminNote, setAdminNote] = useState("");
  const [newStatus, setNewStatus] = useState("open");
  const [saving,    setSaving]    = useState(false);

  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(""),3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [data, statsData] = await Promise.all([
        apiFetch("/feedback"),
        apiFetch("/feedback/stats"),
      ]);
      setItems(Array.isArray(data) ? data : []);
      setStats(statsData);
    } catch { setItems([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRespond = async () => {
    setSaving(true);
    try {
      await apiFetch(`/feedback/${selected._id}`, {
        method:"PUT",
        body: JSON.stringify({ status: newStatus, adminNote }),
      });
      showToast("✅ Response saved! User will see your note.");
      setSelected(null);
      setAdminNote(""); setNewStatus("open");
      await load();
      refetchFeedbackCount(); // refresh sidebar badge
    } catch (e) { showToast("❌ "+e.message); }
    finally { setSaving(false); }
  };

  const filtered = items.filter(fb =>
    (typeF   === "all" || fb.type   === typeF) &&
    (statusF === "all" || fb.status === statusF) &&
    (fb.subject?.toLowerCase().includes(search.toLowerCase()) ||
     fb.userName?.toLowerCase().includes(search.toLowerCase()) ||
     fb.message?.toLowerCase().includes(search.toLowerCase()) ||
     fb.formName?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ padding:"28px 32px" }}>

      {/* Respond modal */}
      {selected && (
        <div style={{ position:"fixed", inset:0, background:"rgba(13,27,42,0.75)",
          zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
          onClick={()=>setSelected(null)}>
          <div style={{ background:"white", borderRadius:20, width:"100%", maxWidth:580,
            maxHeight:"90vh", overflowY:"auto", boxShadow:"0 32px 80px rgba(0,0,0,0.4)" }}
            onClick={e=>e.stopPropagation()}>

            <div style={{ background:"#0d1b2a", borderRadius:"20px 20px 0 0",
              padding:"18px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ color:"white", fontWeight:800, fontSize:16 }}>Respond to Feedback</div>
                <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12, marginTop:2 }}>
                  From: {selected.userName} · {selected.userEmail}
                </div>
              </div>
              <button onClick={()=>setSelected(null)}
                style={{ background:"rgba(255,255,255,0.1)", border:"none",
                  color:"white", borderRadius:8, padding:"6px 14px", cursor:"pointer" }}>✕</button>
            </div>

            <div style={{ padding:24 }}>
              {/* Original feedback */}
              <div style={{ background:"#f9fafb", border:"1px solid #e2e8f0",
                borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
                <div style={{ fontWeight:800, fontSize:14, marginBottom:6 }}>{selected.subject}</div>
                <div style={{ fontSize:13, color:"#4a5568", lineHeight:1.7, marginBottom:10 }}>
                  {selected.message}
                </div>
                {selected.formName && (
                  <div style={{ fontSize:12, color:"#8898aa" }}>Form: {selected.formName}</div>
                )}
                <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap" }}>
                  {(() => { const t=TYPES.find(x=>x.value===selected.type)||TYPES[4]; return (
                    <span style={{ background:t.color+"15", color:t.color,
                      fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:99 }}>
                      {t.icon} {t.label}
                    </span>
                  );})()}
                  {(() => { const p=PRIORITIES[selected.priority]||PRIORITIES.medium; return (
                    <span style={{ background:p.bg, color:p.color,
                      fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:99 }}>
                      {p.label} Priority
                    </span>
                  );})()}
                  {selected.userDept && (
                    <span style={{ background:"#f5f2ed", color:"#4a5568",
                      fontSize:11, padding:"2px 8px", borderRadius:99 }}>
                      {selected.userDept}
                    </span>
                  )}
                </div>
              </div>

              {/* Admin note */}
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:11, fontWeight:700, color:"#8898aa",
                  textTransform:"uppercase", letterSpacing:0.5, display:"block", marginBottom:7 }}>
                  Your Response / Note
                </label>
                <textarea value={adminNote} onChange={e=>setAdminNote(e.target.value)}
                  defaultValue={selected.adminNote||""}
                  placeholder="Write your response to the user, or note what action will be taken..."
                  rows={4}
                  style={{ width:"100%", padding:"11px 13px", border:"1.5px solid #e2e8f0",
                    borderRadius:10, fontSize:13, resize:"vertical", outline:"none",
                    boxSizing:"border-box" }}/>
              </div>

              {/* Update status */}
              <div style={{ marginBottom:24 }}>
                <label style={{ fontSize:11, fontWeight:700, color:"#8898aa",
                  textTransform:"uppercase", letterSpacing:0.5, display:"block", marginBottom:10 }}>
                  Update Status
                </label>
                <div style={{ display:"flex", gap:8 }}>
                  {STATUSES.map(s => (
                    <button key={s.value} type="button" onClick={()=>setNewStatus(s.value)}
                      style={{ padding:"8px 16px", borderRadius:99, fontWeight:700,
                        fontSize:12, cursor:"pointer", border:"1.5px solid",
                        background:newStatus===s.value?s.color:"white",
                        color:newStatus===s.value?"white":s.color,
                        borderColor:s.color, transition:"all 0.15s" }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display:"flex", gap:10 }}>
                <button onClick={handleRespond} disabled={saving}
                  style={{ flex:1, padding:"12px",
                    background:saving?"#ccc":"linear-gradient(135deg,#374151,#0d1b2a)",
                    color:"white", border:"none", borderRadius:11,
                    fontWeight:800, fontSize:14, cursor:saving?"not-allowed":"pointer" }}>
                  {saving?"⏳ Saving...":"💾 Save Response"}
                </button>
                <button onClick={()=>setSelected(null)}
                  style={{ padding:"12px 20px", background:"white",
                    border:"1.5px solid #e2e8f0", borderRadius:11,
                    fontWeight:600, cursor:"pointer" }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position:"fixed", top:24, right:24, background:"#0d1b2a",
          color:"white", borderRadius:12, padding:"12px 20px",
          fontSize:14, fontWeight:600, zIndex:9998 }}>{toast}</div>
      )}

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, margin:0 }}>Feedback Management</h1>
          <p style={{ color:"#8898aa", fontSize:13, marginTop:4 }}>
            Review and respond to feedback from students and faculty
          </p>
        </div>
        <button onClick={load}
          style={{ padding:"8px 16px", borderRadius:10, border:"1.5px solid #e8e4dc",
            background:"white", fontSize:13, fontWeight:600, cursor:"pointer" }}>🔄 Refresh</button>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
          {[
            { l:"Total",       v:stats.total,      c:"#374151", b:"#f9fafb", icon:"📬" },
            { l:"Open",        v:stats.open,        c:"#f59e0b", b:"#fffbeb", icon:"🔓" },
            { l:"In Progress", v:stats.inProgress,  c:"#2563eb", b:"#eff6ff", icon:"⚙️" },
            { l:"Resolved",    v:stats.resolved,    c:"#059669", b:"#f0fdf4", icon:"✅" },
          ].map(s=>(
            <div key={s.l} style={{ background:"white", borderRadius:14, padding:18,
              boxShadow:"0 2px 12px rgba(0,0,0,0.06)", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:44, height:44, borderRadius:11, background:s.b,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize:24, fontWeight:800, color:s.c }}>{s.v}</div>
                <div style={{ fontSize:12, color:"#8898aa" }}>{s.l}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <div style={{ background:"white", borderRadius:10, padding:"9px 14px",
          display:"flex", gap:8, alignItems:"center", flex:1, minWidth:220,
          boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
          <span>🔍</span>
          <input placeholder="Search by subject, user, form name..." value={search}
            onChange={e=>setSearch(e.target.value)}
            style={{ border:"none", outline:"none", background:"transparent", fontSize:13, flex:1 }}/>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          <button onClick={()=>setTypeF("all")}
            style={{ padding:"6px 12px", borderRadius:99, fontSize:11, fontWeight:600,
              border:"1.5px solid", cursor:"pointer",
              background:typeF==="all"?"#374151":"white",
              color:typeF==="all"?"white":"#4a5568",
              borderColor:typeF==="all"?"#374151":"#e2e8f0" }}>All Types</button>
          {TYPES.map(t=>(
            <button key={t.value} onClick={()=>setTypeF(t.value)}
              style={{ padding:"6px 12px", borderRadius:99, fontSize:11, fontWeight:600,
                border:"1.5px solid", cursor:"pointer",
                background:typeF===t.value?t.color:"white",
                color:typeF===t.value?"white":t.color,
                borderColor:t.color }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {["all",...STATUSES.map(s=>s.value)].map(s=>{
            const st = STATUSES.find(x=>x.value===s);
            return (
              <button key={s} onClick={()=>setStatusF(s)}
                style={{ padding:"6px 12px", borderRadius:99, fontSize:11, fontWeight:600,
                  border:"1.5px solid", cursor:"pointer",
                  background:statusF===s?(st?.color||"#374151"):"white",
                  color:statusF===s?"white":(st?.color||"#374151"),
                  borderColor:st?.color||"#374151" }}>
                {s==="all"?"All Status":st?.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ background:"white", borderRadius:16, padding:"60px 20px",
          textAlign:"center", color:"#8898aa" }}>⏳ Loading feedback...</div>
      ) : filtered.length === 0 ? (
        <div style={{ background:"white", borderRadius:16, padding:"60px 20px",
          textAlign:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
          <div style={{ fontSize:15, fontWeight:700 }}>No feedback found</div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filtered.map(fb => {
            const t  = TYPES.find(x=>x.value===fb.type)||TYPES[4];
            const st = STATUSES.find(x=>x.value===fb.status)||STATUSES[0];
            const pr = PRIORITIES[fb.priority]||PRIORITIES.medium;
            const rc = ROLE_COLORS[fb.userRole]||"#374151";
            return (
              <div key={fb._id} style={{ background:"white", borderRadius:14,
                padding:"18px 22px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)",
                display:"flex", alignItems:"center", gap:14,
                border:`1.5px solid ${fb.status==="open"?"#fde68a":"transparent"}`,
                transition:"all 0.15s" }}
                onMouseOver={e=>{e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.1)";}}
                onMouseOut={e=>{e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.06)";}}>

                <div style={{ width:46, height:46, borderRadius:12, background:t.color+"15",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:24, flexShrink:0 }}>{t.icon}</div>

                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#0d1b2a",
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {fb.subject}
                  </div>
                  <div style={{ fontSize:12, color:"#4a5568", marginTop:2,
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {fb.message}
                  </div>
                  <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
                    <span style={{ background:rc+"15", color:rc, fontSize:10,
                      fontWeight:700, padding:"2px 7px", borderRadius:99 }}>
                      {fb.userName} · {fb.userRole}
                    </span>
                    {fb.userDept && (
                      <span style={{ background:"#f5f2ed", color:"#8898aa",
                        fontSize:10, padding:"2px 7px", borderRadius:99 }}>
                        {fb.userDept}
                      </span>
                    )}
                    <span style={{ background:t.color+"15", color:t.color,
                      fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:99 }}>
                      {t.label}
                    </span>
                    <span style={{ background:pr.bg, color:pr.color,
                      fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:99 }}>
                      {pr.label}
                    </span>
                    {fb.formName && (
                      <span style={{ background:"#eff6ff", color:"#2563eb",
                        fontSize:10, padding:"2px 7px", borderRadius:99 }}>
                        📋 {fb.formName}
                      </span>
                    )}
                    {fb.rating && (
                      <span style={{ fontSize:10, color:"#f59e0b" }}>
                        {"⭐".repeat(fb.rating)}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ textAlign:"right", flexShrink:0, marginRight:8 }}>
                  <span style={{ background:st.bg, color:st.color, fontSize:11,
                    fontWeight:700, padding:"4px 12px", borderRadius:99,
                    display:"block", marginBottom:4 }}>{st.label}</span>
                  <div style={{ fontSize:11, color:"#8898aa" }}>
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <button onClick={()=>{
                  setSelected(fb);
                  setAdminNote(fb.adminNote||"");
                  setNewStatus(fb.status||"open");
                }}
                  style={{ padding:"9px 18px", borderRadius:10,
                    background:"#0d1b2a", color:"white", border:"none",
                    fontWeight:700, fontSize:13, cursor:"pointer",
                    flexShrink:0, transition:"all 0.15s" }}
                  onMouseOver={e=>e.currentTarget.style.background="#374151"}
                  onMouseOut={e=>e.currentTarget.style.background="#0d1b2a"}>
                  Respond →
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}