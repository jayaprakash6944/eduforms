import { useState, useEffect, useCallback } from "react";
import { getApplicationsAPI } from "../../utils/api";
import GatePass, { PASS_CATEGORIES } from "./GatePass";
import { useAuth } from "../../contexts/AuthContext";

const STATUS_TABS = ["All","pending","in-review","approved","rejected"];

const StatusBadge = ({ status }) => {
  const map = {
    approved:  { color:"#059669", bg:"#f0fdf4",  label:"Approved"  },
    pending:   { color:"#f59e0b", bg:"#fffbeb",  label:"Pending"   },
    "in-review":{ color:"#2563eb", bg:"#eff6ff", label:"In Review" },
    rejected:  { color:"#dc2626", bg:"#fef2f2",  label:"Rejected"  },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{ background:s.bg, color:s.color, fontSize:11, fontWeight:700,
      padding:"3px 10px", borderRadius:99, display:"inline-flex", alignItems:"center", gap:5 }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:s.color, display:"inline-block" }}/>
      {s.label}
    </span>
  );
};

// ── Application Detail ─────────────────────────────────────────────────────────
function ApplicationDetail({ app, student, onBack, onShowPass }) {
  const stepColors = { approved:"#059669", rejected:"#dc2626", pending:"#f59e0b", waiting:"#d1d5db" };
  const formData   = app.formData instanceof Object ? Object.entries(app.formData) : [];
  const canGetPass = app.status === "approved";
  const hasPass    = canGetPass && (PASS_CATEGORIES.includes(app.category) || true); // all approved get receipt

  return (
    <div style={{ padding:"28px 32px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, margin:0 }}>{app.formName}</h1>
          <p style={{ color:"#8898aa", fontSize:13, marginTop:4 }}>{app.appId}</p>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <StatusBadge status={app.status}/>
          {hasPass && (
            <button onClick={() => onShowPass(app)}
              style={{ padding:"9px 20px", borderRadius:11,
                background:"linear-gradient(135deg,#059669,#047857)",
                color:"white", border:"none", fontWeight:800,
                fontSize:13, cursor:"pointer",
                boxShadow:"0 4px 14px #05966944",
                display:"flex", alignItems:"center", gap:7 }}>
              🎫 View / Print Pass
            </button>
          )}
          <button onClick={onBack}
            style={{ padding:"8px 16px", borderRadius:10, border:"1.5px solid #e8e4dc",
              background:"white", fontSize:13, fontWeight:600, cursor:"pointer" }}>
            ← Back
          </button>
        </div>
      </div>

      {/* Pass available banner */}
      {hasPass && (
        <div style={{ background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",
          border:"1.5px solid #bbf7d0", borderRadius:14,
          padding:"14px 20px", marginBottom:20,
          display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:28 }}>🎫</span>
            <div>
              <div style={{ fontWeight:800, fontSize:15, color:"#166534" }}>
                Approval Pass Available!
              </div>
              <div style={{ fontSize:12, color:"#15803d", marginTop:2 }}>
                Your application is fully approved. Generate your pass to show as proof.
              </div>
            </div>
          </div>
          <button onClick={() => onShowPass(app)}
            style={{ padding:"10px 22px", borderRadius:11,
              background:"linear-gradient(135deg,#059669,#047857)",
              color:"white", border:"none", fontWeight:800,
              fontSize:13, cursor:"pointer",
              boxShadow:"0 4px 14px #05966944" }}>
            🖨️ Print / Show Pass
          </button>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20 }}>
        {/* Timeline */}
        <div style={{ background:"white", borderRadius:16, padding:24,
          boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:20 }}>
            <h3 style={{ fontSize:15, fontWeight:700 }}>Approval Timeline</h3>
            <StatusBadge status={app.status}/>
          </div>

          {(app.steps || []).map((step, i) => (
            <div key={i} style={{ display:"flex", gap:14, marginBottom:20, position:"relative" }}>
              {i < (app.steps.length - 1) && (
                <div style={{ position:"absolute", left:13, top:28, width:2,
                  height:"calc(100% + 8px)",
                  background:step.status === "approved" ? "#059669" : "#e8e4dc" }}/>
              )}
              <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:12, fontWeight:700, color:"white", zIndex:1,
                background:stepColors[step.status] || "#e8e4dc" }}>
                {step.status === "approved" ? "✓" : step.status === "rejected" ? "✗" : i + 1}
              </div>
              <div style={{ flex:1, paddingTop:4 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ fontSize:14, fontWeight:700 }}>{step.name}</div>
                  <div style={{ fontSize:11, color:"#8898aa" }}>
                    {step.date ? new Date(step.date).toLocaleDateString() : "Waiting"}
                  </div>
                </div>
                <div style={{ fontSize:12, color:stepColors[step.status] || "#8898aa",
                  fontWeight:600, marginTop:2 }}>
                  {step.status === "waiting"  ? "⏳ Waiting for previous step"
                   : step.status === "pending" ? "🔄 Currently under review"
                   : step.status === "approved"? "✅ Approved"
                   : "❌ Rejected"}
                </div>
                {step.comment && (
                  <div style={{ background:"#f5f2ed", borderRadius:8, padding:"7px 12px",
                    marginTop:8, fontSize:12, color:"#4a5568", fontStyle:"italic",
                    borderLeft:"3px solid #e8e4dc" }}>
                    💬 "{step.comment}"
                  </div>
                )}
              </div>
            </div>
          ))}

          {app.status === "approved" && (
            <div style={{ marginTop:8, background:"linear-gradient(135deg,#059669,#047857)",
              borderRadius:12, padding:20, color:"white", textAlign:"center" }}>
              <div style={{ fontSize:32, marginBottom:6 }}>🎉</div>
              <div style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>Fully Approved!</div>
              <div style={{ fontSize:12, opacity:0.85, marginBottom:14 }}>
                All {app.steps?.length} approvals complete
              </div>
              <button onClick={() => onShowPass(app)}
                style={{ padding:"10px 24px", borderRadius:10,
                  background:"rgba(255,255,255,0.2)",
                  color:"white", border:"2px solid rgba(255,255,255,0.4)",
                  fontWeight:800, fontSize:13, cursor:"pointer" }}>
                🎫 Open Your Pass →
              </button>
            </div>
          )}

          {app.status === "rejected" && (
            <div style={{ marginTop:8, background:"#fef2f2",
              border:"1.5px solid #fecaca", borderRadius:12, padding:16, textAlign:"center" }}>
              <div style={{ fontSize:28, marginBottom:4 }}>❌</div>
              <div style={{ fontWeight:700, fontSize:14, color:"#dc2626" }}>
                Application Rejected
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Pass quick-launch card */}
          {canGetPass && (
            <div onClick={() => onShowPass(app)}
              style={{ background:"linear-gradient(135deg,#0d1b2a,#1a2f4a)",
                borderRadius:14, padding:20, cursor:"pointer",
                border:"2px solid #059669",
                boxShadow:"0 8px 24px rgba(5,150,105,0.2)",
                transition:"all 0.15s" }}
              onMouseOver={e => e.currentTarget.style.transform="translateY(-2px)"}
              onMouseOut={e  => e.currentTarget.style.transform="none"}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <span style={{ fontSize:28 }}>🎫</span>
                <div>
                  <div style={{ color:"white", fontWeight:800, fontSize:14 }}>
                    Your Pass is Ready
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11, marginTop:2 }}>
                    Tap to view & print
                  </div>
                </div>
              </div>
              <div style={{ background:"#059669", borderRadius:9, padding:"9px",
                textAlign:"center", color:"white", fontWeight:700, fontSize:12 }}>
                🖨️ View / Print Pass
              </div>
            </div>
          )}

          {/* App info */}
          <div style={{ background:"white", borderRadius:14, padding:18,
            boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
            <h4 style={{ fontSize:12, fontWeight:800, color:"#8898aa",
              textTransform:"uppercase", letterSpacing:0.4, marginBottom:12 }}>
              Application Info
            </h4>
            {[
              ["Application ID", app.appId],
              ["Form",           app.formName],
              ["Category",       app.category],
              ["Department",     app.dept],
              ["Submitted",      new Date(app.submittedOn || app.createdAt).toLocaleDateString()],
              ["Steps",          `${(app.steps||[]).filter(s=>s.status==="approved").length} / ${app.steps?.length||0} Approved`],
            ].map(([k, v]) => (
              <div key={k} style={{ marginBottom:10, paddingBottom:10, borderBottom:"1px solid #f5f2ed" }}>
                <div style={{ fontSize:10, color:"#aaa", fontWeight:700, textTransform:"uppercase" }}>{k}</div>
                <div style={{ fontSize:13, fontWeight:600, textTransform:"capitalize", marginTop:2 }}>{v || "—"}</div>
              </div>
            ))}
          </div>

          {/* Form submission data */}
          {formData.length > 0 && (
            <div style={{ background:"white", borderRadius:14, padding:18,
              boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
              <h4 style={{ fontSize:12, fontWeight:800, color:"#8898aa",
                textTransform:"uppercase", letterSpacing:0.4, marginBottom:12 }}>
                Your Submission
              </h4>
              {formData.map(([k, v]) => (
                <div key={k} style={{ marginBottom:10 }}>
                  <div style={{ fontSize:10, color:"#aaa", fontWeight:700, textTransform:"uppercase" }}>{k}</div>
                  <div style={{ fontSize:13, fontWeight:500, marginTop:2 }}>{v || "—"}</div>
                </div>
              ))}
            </div>
          )}

          {/* Progress */}
          <div style={{ background:"white", borderRadius:14, padding:18,
            boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
            <h4 style={{ fontSize:12, fontWeight:800, color:"#8898aa",
              textTransform:"uppercase", letterSpacing:0.4, marginBottom:10 }}>
              Progress
            </h4>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}>
              <span style={{ color:"#8898aa" }}>Steps Done</span>
              <span style={{ fontWeight:700 }}>
                {(app.steps||[]).filter(s=>s.status==="approved").length} / {app.steps?.length}
              </span>
            </div>
            <div style={{ background:"#f5f2ed", borderRadius:99, height:8, overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:99, transition:"width 0.5s",
                background:app.status==="rejected"?"#dc2626":app.status==="approved"?"#059669":"#f59e0b",
                width:`${((app.steps||[]).filter(s=>s.status==="approved").length/(app.steps?.length||1))*100}%`}}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main List ──────────────────────────────────────────────────────────────────
export default function MyApplications() {
  const { user }  = useAuth();
  const isFaculty = user?.role === "faculty";
  const [apps,      setApps]     = useState([]);
  const [loading,   setLoading]  = useState(true);
  const [error,     setError]    = useState("");
  const [activeTab, setActiveTab]= useState("All");
  const [selected,  setSelected] = useState(null);
  const [passApp,   setPassApp]  = useState(null);   // which app to show pass for

  const loadApps = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getApplicationsAPI();
      setApps(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Could not load applications. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadApps(); }, [loadApps]);

  const filtered = activeTab === "All" ? apps : apps.filter(a => a.status === activeTab);
  const stats = {
    total:    apps.length,
    approved: apps.filter(a => a.status === "approved").length,
    pending:  apps.filter(a => ["pending","in-review"].includes(a.status)).length,
    rejected: apps.filter(a => a.status === "rejected").length,
  };

  // Gate pass overlay (renders over everything)
  if (passApp) return (
    <>
      {selected && <ApplicationDetail app={selected} student={user}
        onBack={() => setSelected(null)} onShowPass={setPassApp}/>}
      {!selected && (
        <div style={{ padding:"28px 32px" }}>
          {/* just a backdrop div so closing pass returns to list */}
        </div>
      )}
      <GatePass app={passApp} student={user} onClose={() => setPassApp(null)}/>
    </>
  );

  if (selected) return (
    <ApplicationDetail app={selected} student={user}
      onBack={() => setSelected(null)} onShowPass={setPassApp}/>
  );

  return (
    <div style={{ padding:"28px 32px" }}>
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, margin:0 }}>{isFaculty ? "My Requests" : "My Applications"}</h1>
          <p style={{ color:"#8898aa", fontSize:13, marginTop:4 }}>
            {isFaculty ? "Track all your submitted leave, research and admin requests" : "Track all your submitted form applications"}
          </p>
        </div>
        <button onClick={loadApps}
          style={{ padding:"8px 16px", borderRadius:10, border:"1.5px solid #e8e4dc",
            background:"white", fontSize:13, fontWeight:600, cursor:"pointer" }}>
          🔄 Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {[
          { label:"Total",    count:stats.total,    color:"#6366f1", bg:"#eef2ff" },
          { label:"Approved", count:stats.approved, color:"#059669", bg:"#f0fdf4" },
          { label:"In Review",count:stats.pending,  color:"#f59e0b", bg:"#fffbeb" },
          { label:"Rejected", count:stats.rejected, color:"#dc2626", bg:"#fef2f2" },
        ].map(s => (
          <div key={s.label} style={{ background:"white", borderRadius:12, padding:"14px 18px",
            boxShadow:"0 2px 12px rgba(0,0,0,0.06)", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:s.bg,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:18, fontWeight:800, color:s.color }}>{s.count}</div>
            <div style={{ fontSize:12, color:"#8898aa" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Approved passes quick-launch bar */}
      {stats.approved > 0 && (
        <div style={{ background:"linear-gradient(135deg,#0d1b2a,#1a2f4a)",
          borderRadius:14, padding:"14px 20px", marginBottom:20,
          display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
          <span style={{ fontSize:22 }}>🎫</span>
          <div style={{ flex:1 }}>
            <div style={{ color:"white", fontWeight:700, fontSize:13 }}>
              {stats.approved} Approved Application{stats.approved > 1 ? "s" : ""} — Passes Available
            </div>
            <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11, marginTop:2 }}>
              Tap any approved application below to print your gate pass or proof receipt
            </div>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {apps.filter(a => a.status === "approved").slice(0, 3).map(a => (
              <button key={a._id} onClick={() => setPassApp(a)}
                style={{ padding:"7px 14px", borderRadius:9,
                  background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)",
                  color:"white", fontSize:11, fontWeight:700, cursor:"pointer",
                  display:"flex", alignItems:"center", gap:5,
                  transition:"all 0.15s" }}
                onMouseOver={e => e.currentTarget.style.background="rgba(255,255,255,0.2)"}
                onMouseOut={e  => e.currentTarget.style.background="rgba(255,255,255,0.1)"}>
                {a.icon || "📋"} {a.formName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {STATUS_TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ padding:"6px 14px", borderRadius:99, fontSize:12, fontWeight:600,
              border:"1.5px solid", cursor:"pointer", transition:"all 0.15s",
              borderColor:activeTab===t?"#e85d26":"#e8e4dc",
              background:activeTab===t?"#e85d26":"white",
              color:activeTab===t?"white":"#4a5568", textTransform:"capitalize" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background:"white", borderRadius:16,
        boxShadow:"0 2px 12px rgba(0,0,0,0.06)", overflow:"hidden" }}>
        {loading ? (
          <div style={{ padding:"60px 20px", textAlign:"center", color:"#8898aa" }}>
            ⏳ Loading from database...
          </div>
        ) : error ? (
          <div style={{ padding:"40px 20px", textAlign:"center", color:"#dc2626", fontSize:14 }}>
            ❌ {error}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding:"60px 20px", textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
            <div style={{ fontSize:15, fontWeight:700, marginBottom:4 }}>No applications found</div>
            <div style={{ fontSize:13, color:"#8898aa" }}>
              {activeTab === "All" ? "Submit your first form to get started." : `No ${activeTab} applications.`}
            </div>
          </div>
        ) : (
          <>
            <div style={{ display:"grid",
              gridTemplateColumns:"150px 1fr 110px 160px 110px 130px",
              padding:"10px 18px", background:"#f5f2ed",
              fontSize:11, fontWeight:700, color:"#8898aa",
              textTransform:"uppercase", letterSpacing:0.4 }}>
              <div>ID</div><div>Form</div><div>Submitted</div>
              <div>Progress</div><div>Status</div><div>Actions</div>
            </div>

            {filtered.map(app => {
              const approved  = (app.steps||[]).filter(s=>s.status==="approved").length;
              const total     = app.steps?.length || 1;
              const pct       = (approved / total) * 100;
              const barColor  = app.status==="rejected"?"#dc2626":app.status==="approved"?"#059669":"#f59e0b";
              const isApproved= app.status === "approved";

              return (
                <div key={app._id || app.appId}
                  style={{ display:"grid",
                    gridTemplateColumns:"150px 1fr 110px 160px 110px 130px",
                    padding:"14px 18px", borderBottom:"1px solid #f5f2ed",
                    alignItems:"center", transition:"background 0.15s",
                    background:isApproved?"#f0fdf4":"transparent" }}
                  onMouseOver={e => e.currentTarget.style.background=isApproved?"#dcfce7":"#fafaf8"}
                  onMouseOut={e  => e.currentTarget.style.background=isApproved?"#f0fdf4":"transparent"}>

                  <div style={{ fontSize:12, fontWeight:700, color:"#e85d26" }}>{app.appId}</div>

                  <div>
                    <div style={{ fontSize:13, fontWeight:600 }}>{app.formName}</div>
                    <div style={{ fontSize:11, color:"#8898aa", marginTop:2 }}>{app.category}</div>
                  </div>

                  <div style={{ fontSize:12, color:"#8898aa" }}>
                    {new Date(app.submittedOn||app.createdAt).toLocaleDateString()}
                  </div>

                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ flex:1, background:"#f5f2ed", borderRadius:99, height:6, overflow:"hidden" }}>
                      <div style={{ height:"100%", borderRadius:99, background:barColor,
                        width:`${pct}%`, transition:"width 0.5s" }}/>
                    </div>
                    <span style={{ fontSize:11, color:"#8898aa", fontWeight:600, whiteSpace:"nowrap" }}>
                      {approved}/{total}
                    </span>
                  </div>

                  <StatusBadge status={app.status}/>

                  <div style={{ display:"flex", gap:6 }}>
                    <button onClick={() => setSelected(app)}
                      style={{ padding:"5px 10px", borderRadius:7, border:"1.5px solid #e8e4dc",
                        background:"white", fontSize:11, fontWeight:600,
                        cursor:"pointer", color:"#4a5568" }}>
                      View
                    </button>
                    {isApproved && (
                      <button onClick={() => setPassApp(app)}
                        style={{ padding:"5px 10px", borderRadius:7, border:"none",
                          background:"linear-gradient(135deg,#059669,#047857)",
                          color:"white", fontSize:11, fontWeight:700,
                          cursor:"pointer", boxShadow:"0 2px 6px #05966933" }}>
                        🎫 Pass
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}