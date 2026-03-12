import { useState, useEffect, useCallback } from "react";
import { getApplicationsAPI } from "../../utils/api";

const STATUS_TABS = ["All","pending","in-review","approved","rejected"];

const StatusBadge = ({ status }) => {
  const map = {
    approved:  { color:"#059669",bg:"#f0fdf4",dot:"#059669",label:"Approved"  },
    pending:   { color:"#f59e0b",bg:"#fffbeb",dot:"#f59e0b",label:"Pending"   },
    "in-review":{ color:"#2563eb",bg:"#eff6ff",dot:"#2563eb",label:"In Review" },
    rejected:  { color:"#dc2626",bg:"#fef2f2",dot:"#dc2626",label:"Rejected"  },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{background:s.bg,color:s.color,fontSize:11,fontWeight:700,
      padding:"3px 10px",borderRadius:99,display:"inline-flex",alignItems:"center",gap:5}}>
      <span style={{width:6,height:6,borderRadius:"50%",background:s.dot,display:"inline-block"}}/>
      {s.label}
    </span>
  );
};

// ── Application Detail ────────────────────────────────────────────────────────
function ApplicationDetail({ app, onBack }) {
  const stepColors = { approved:"#059669",rejected:"#dc2626",pending:"#f59e0b",waiting:"#d1d5db" };
  const formData = app.formData instanceof Object ? Object.entries(app.formData) : [];

  return (
    <div style={{padding:"28px 32px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:800,margin:0}}>{app.formName}</h1>
          <p style={{color:"#8898aa",fontSize:13,marginTop:4}}>{app.appId}</p>
        </div>
        <button onClick={onBack}
          style={{padding:"8px 16px",borderRadius:10,border:"1.5px solid #e8e4dc",
            background:"white",fontSize:13,fontWeight:600,cursor:"pointer"}}>← Back</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
        {/* Timeline */}
        <div style={{background:"white",borderRadius:16,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <h3 style={{fontSize:15,fontWeight:700}}>Approval Timeline</h3>
            <StatusBadge status={app.status} />
          </div>
          {(app.steps||[]).map((step,i) => (
            <div key={i} style={{display:"flex",gap:14,marginBottom:20,position:"relative"}}>
              {i < (app.steps.length-1) && (
                <div style={{position:"absolute",left:14,top:30,width:2,
                  height:"calc(100% + 4px)",
                  background:step.status==="approved"?"#059669":"#e8e4dc"}}/>
              )}
              <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:12,fontWeight:700,color:"white",zIndex:1,
                background:stepColors[step.status]||"#e8e4dc"}}>
                {step.status==="approved"?"✓":step.status==="rejected"?"✗":i+1}
              </div>
              <div style={{flex:1,paddingTop:4}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div style={{fontSize:14,fontWeight:700}}>{step.name}</div>
                  <div style={{fontSize:11,color:"#8898aa"}}>
                    {step.date ? new Date(step.date).toLocaleDateString() : "Waiting"}
                  </div>
                </div>
                <div style={{fontSize:12,color:stepColors[step.status]||"#8898aa",fontWeight:600,marginTop:2}}>
                  {step.status==="waiting"  ? "⏳ Waiting for previous step" :
                   step.status==="pending"  ? "🔄 Currently under review"   :
                   step.status==="approved" ? "✅ Approved"                  : "❌ Rejected"}
                </div>
                {step.comment && (
                  <div style={{background:"#f5f2ed",borderRadius:8,padding:"7px 12px",
                    marginTop:8,fontSize:12,color:"#4a5568",fontStyle:"italic"}}>
                    "{step.comment}"
                  </div>
                )}
              </div>
            </div>
          ))}
          {app.status==="approved" && (
            <div style={{marginTop:8,background:"linear-gradient(135deg,#059669,#047857)",
              borderRadius:12,padding:16,color:"white",textAlign:"center"}}>
              <div style={{fontSize:28,marginBottom:4}}>🎉</div>
              <div style={{fontWeight:800,fontSize:15}}>Fully Approved!</div>
              <div style={{fontSize:12,opacity:0.85}}>All {app.steps?.length} approvals complete</div>
            </div>
          )}
          {app.status==="rejected" && (
            <div style={{marginTop:8,background:"#fef2f2",border:"1.5px solid #fecaca",
              borderRadius:12,padding:16,textAlign:"center"}}>
              <div style={{fontSize:28,marginBottom:4}}>❌</div>
              <div style={{fontWeight:700,fontSize:14,color:"#dc2626"}}>Application Rejected</div>
            </div>
          )}
        </div>

        {/* Info panel */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:"white",borderRadius:14,padding:18,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <h4 style={{fontSize:13,fontWeight:700,marginBottom:12}}>Application Info</h4>
            {[
              ["Application ID",app.appId],
              ["Form",          app.formName],
              ["Submitted",     new Date(app.submittedOn||app.createdAt).toLocaleDateString()],
              ["Department",    app.dept],
              ["Status",        app.status],
            ].map(([k,v])=>(
              <div key={k} style={{marginBottom:10}}>
                <div style={{fontSize:11,color:"#8898aa",fontWeight:600,textTransform:"uppercase"}}>{k}</div>
                <div style={{fontSize:13,fontWeight:600,textTransform:"capitalize"}}>{v}</div>
              </div>
            ))}
          </div>
          {formData.length > 0 && (
            <div style={{background:"white",borderRadius:14,padding:18,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <h4 style={{fontSize:13,fontWeight:700,marginBottom:12}}>Your Submission</h4>
              {formData.map(([k,v])=>(
                <div key={k} style={{marginBottom:8}}>
                  <div style={{fontSize:11,color:"#8898aa",fontWeight:600,textTransform:"uppercase"}}>{k}</div>
                  <div style={{fontSize:13,fontWeight:500}}>{v||"—"}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{background:"white",borderRadius:14,padding:18,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <h4 style={{fontSize:13,fontWeight:700,marginBottom:10}}>Progress</h4>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6}}>
              <span style={{color:"#8898aa"}}>Steps Done</span>
              <span style={{fontWeight:700}}>
                {(app.steps||[]).filter(s=>s.status==="approved").length} / {app.steps?.length}
              </span>
            </div>
            <div style={{background:"#f5f2ed",borderRadius:99,height:8,overflow:"hidden"}}>
              <div style={{height:"100%",borderRadius:99,transition:"width 0.5s",
                background:app.status==="rejected"?"#dc2626":app.status==="approved"?"#059669":"#e85d26",
                width:`${((app.steps||[]).filter(s=>s.status==="approved").length/(app.steps?.length||1))*100}%`}}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main List ─────────────────────────────────────────────────────────────────
export default function MyApplications() {
  const [apps,      setApps]     = useState([]);
  const [loading,   setLoading]  = useState(true);
  const [error,     setError]    = useState("");
  const [activeTab, setActiveTab]= useState("All");
  const [selected,  setSelected] = useState(null);

  // FETCH FROM BACKEND (persists after refresh)
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

  const filtered = activeTab==="All" ? apps : apps.filter(a=>a.status===activeTab);

  const stats = {
    total:    apps.length,
    approved: apps.filter(a=>a.status==="approved").length,
    pending:  apps.filter(a=>["pending","in-review"].includes(a.status)).length,
    rejected: apps.filter(a=>a.status==="rejected").length,
  };

  if (selected) return <ApplicationDetail app={selected} onBack={()=>setSelected(null)} />;

  return (
    <div style={{padding:"28px 32px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:800,margin:0}}>My Applications</h1>
          <p style={{color:"#8898aa",fontSize:13,marginTop:4}}>Track all your submitted form applications</p>
        </div>
        <button onClick={loadApps}
          style={{padding:"8px 16px",borderRadius:10,border:"1.5px solid #e8e4dc",
            background:"white",fontSize:13,fontWeight:600,cursor:"pointer"}}>
          🔄 Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[
          {label:"Total",    count:stats.total,    color:"#6366f1",bg:"#eef2ff"},
          {label:"Approved", count:stats.approved, color:"#059669",bg:"#f0fdf4"},
          {label:"In Review",count:stats.pending,  color:"#f59e0b",bg:"#fffbeb"},
          {label:"Rejected", count:stats.rejected, color:"#dc2626",bg:"#fef2f2"},
        ].map(s=>(
          <div key={s.label} style={{background:"white",borderRadius:12,padding:"14px 18px",
            boxShadow:"0 2px 12px rgba(0,0,0,0.06)",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:10,background:s.bg,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:18,fontWeight:800,color:s.color}}>{s.count}</div>
            <div style={{fontSize:12,color:"#8898aa"}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {STATUS_TABS.map(t=>(
          <button key={t} onClick={()=>setActiveTab(t)}
            style={{padding:"6px 14px",borderRadius:99,fontSize:12,fontWeight:600,
              border:"1.5px solid",cursor:"pointer",transition:"all 0.15s",
              borderColor:activeTab===t?"#e85d26":"#e8e4dc",
              background:activeTab===t?"#e85d26":"white",
              color:activeTab===t?"white":"#4a5568",textTransform:"capitalize"}}>
            {t==="All"?"All":t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{background:"white",borderRadius:16,boxShadow:"0 2px 12px rgba(0,0,0,0.06)",overflow:"hidden"}}>
        {loading ? (
          <div style={{padding:"60px 20px",textAlign:"center",color:"#8898aa"}}>
            Loading from database...
          </div>
        ) : error ? (
          <div style={{padding:"40px 20px",textAlign:"center",color:"#dc2626",fontSize:14}}>
            ❌ {error}
          </div>
        ) : filtered.length===0 ? (
          <div style={{padding:"60px 20px",textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:12}}>📭</div>
            <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>No applications found</div>
            <div style={{fontSize:13,color:"#8898aa"}}>
              {activeTab==="All"?"Submit your first form to get started.":`No ${activeTab} applications.`}
            </div>
          </div>
        ) : (
          <>
            <div style={{display:"grid",gridTemplateColumns:"160px 1fr 120px 180px 110px 90px",
              padding:"10px 18px",background:"#f5f2ed",
              fontSize:11,fontWeight:700,color:"#8898aa",textTransform:"uppercase",letterSpacing:0.4}}>
              <div>ID</div><div>Form</div><div>Submitted</div><div>Progress</div><div>Status</div><div>Action</div>
            </div>
            {filtered.map(app=>{
              const approved=(app.steps||[]).filter(s=>s.status==="approved").length;
              const total   = app.steps?.length||1;
              const pct     = (approved/total)*100;
              const barColor= app.status==="rejected"?"#dc2626":app.status==="approved"?"#059669":"#f59e0b";
              return (
                <div key={app._id||app.appId}
                  style={{display:"grid",gridTemplateColumns:"160px 1fr 120px 180px 110px 90px",
                    padding:"14px 18px",borderBottom:"1px solid #f5f2ed",alignItems:"center",
                    transition:"background 0.15s"}}
                  onMouseOver={e=>e.currentTarget.style.background="#fafaf8"}
                  onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                  <div style={{fontSize:12,fontWeight:700,color:"#e85d26"}}>{app.appId}</div>
                  <div style={{fontSize:13,fontWeight:600}}>{app.formName}</div>
                  <div style={{fontSize:12,color:"#8898aa"}}>
                    {new Date(app.submittedOn||app.createdAt).toLocaleDateString()}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{flex:1,background:"#f5f2ed",borderRadius:99,height:6,overflow:"hidden"}}>
                      <div style={{height:"100%",borderRadius:99,background:barColor,width:`${pct}%`,transition:"width 0.5s"}}/>
                    </div>
                    <span style={{fontSize:11,color:"#8898aa",fontWeight:600,whiteSpace:"nowrap"}}>
                      {approved}/{total}
                    </span>
                  </div>
                  <StatusBadge status={app.status} />
                  <button onClick={()=>setSelected(app)}
                    style={{padding:"5px 12px",borderRadius:8,border:"1.5px solid #e8e4dc",
                      background:"white",fontSize:12,fontWeight:600,cursor:"pointer",color:"#4a5568"}}>
                    View →
                  </button>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}