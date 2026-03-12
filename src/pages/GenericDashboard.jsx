import { useState, useEffect, useCallback } from "react";
import { getStaffDashboardAPI } from "../utils/api";

export default function GenericDashboard({ user, onNavigate = () => {} }) {
  const [dash,    setDash]    = useState(null);
  const [loading, setLoading] = useState(true);

  const ROLE_GREETS = {
    mentor:             "Review your students' pending form applications.",
    hod:                "Manage departmental applications and approvals.",
    college_admin:      "Oversee all college forms and users.",
    placement_director: "Track student placement applications.",
    college_director:   "Executive overview of all institutional forms.",
  };
  const ROLE_COLORS = {
    mentor:"#2563eb", hod:"#7c3aed", college_admin:"#059669",
    placement_director:"#f59e0b", college_director:"#dc2626",
  };

  const hour = new Date().getHours();
  const greeting = hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";
  const roleColor = ROLE_COLORS[user.role] || "#e85d26";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStaffDashboardAPI();
      setDash(data);
    } catch (err) {
      console.error("Staff dashboard error:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const pending     = dash?.pendingCount    || 0;
  const totalApps   = dash?.totalApps       || 0;
  const approved    = dash?.approved        || 0;
  const rejected    = dash?.rejected        || 0;
  const unread      = dash?.unread          || 0;
  const recentPend  = dash?.recentPending   || [];

  return (
    <div style={{padding:"28px 32px"}}>
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:26,fontWeight:800,color:"#0d1b2a",marginBottom:4}}>
          {greeting}, {user.name?.split(" ")[0]}! 👋
        </h1>
        <p style={{color:"#8898aa",fontSize:14}}>{ROLE_GREETS[user.role]||"Welcome to EduForms."}</p>
      </div>

      {loading ? (
        <div style={{textAlign:"center",padding:"60px 0",color:"#8898aa",fontSize:14}}>
          Loading dashboard data...
        </div>
      ) : (
        <>
          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
            {[
              {icon:"⏳",value:pending,   label:"Pending Your Review",   color:"#f59e0b",bg:"#fffbeb",
               action:()=>onNavigate("pending-approvals")},
              {icon:"📋",value:totalApps, label:"Total Applications",    color:"#6366f1",bg:"#eef2ff",action:null},
              {icon:"✅",value:approved,  label:"Approved",              color:"#059669",bg:"#f0fdf4",action:null},
              {icon:"🔔",value:unread,    label:"Unread Notifications",  color:"#e85d26",bg:"#fff5f0",
               action:()=>onNavigate("notifications")},
            ].map((s,i)=>(
              <div key={i} onClick={s.action||undefined}
                style={{background:"white",borderRadius:14,padding:18,
                  boxShadow:"0 2px 12px rgba(0,0,0,0.06)",display:"flex",alignItems:"center",gap:12,
                  cursor:s.action?"pointer":"default",transition:"all 0.15s"}}
                onMouseOver={e=>{if(s.action)e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseOut={e=>{e.currentTarget.style.transform="none";}}>
                <div style={{width:46,height:46,borderRadius:12,background:s.bg,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{s.icon}</div>
                <div>
                  <div style={{fontSize:26,fontWeight:800,color:s.color}}>{s.value}</div>
                  <div style={{fontSize:11,color:"#8898aa",marginTop:1}}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:16}}>
            {/* Pending Queue */}
            <div style={{background:"white",borderRadius:16,padding:22,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <h3 style={{fontSize:15,fontWeight:700}}>Pending Your Approval</h3>
                {pending>0 && (
                  <button onClick={()=>onNavigate("pending-approvals")}
                    style={{fontSize:12,fontWeight:600,color:"#e85d26",background:"#fff5f0",
                      border:"none",borderRadius:8,padding:"4px 12px",cursor:"pointer"}}>
                    View All ({pending})
                  </button>
                )}
              </div>
              {recentPend.length===0 ? (
                <div style={{textAlign:"center",padding:"32px 0"}}>
                  <div style={{fontSize:36,marginBottom:8}}>🎉</div>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>All caught up!</div>
                  <div style={{fontSize:12,color:"#8898aa"}}>No pending approvals right now.</div>
                </div>
              ) : recentPend.map(app=>(
                <div key={app._id}
                  onClick={()=>onNavigate("pending-approvals")}
                  style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                    padding:"10px 12px",borderRadius:10,marginBottom:6,
                    background:"#f5f2ed",cursor:"pointer",transition:"background 0.15s"}}
                  onMouseOver={e=>e.currentTarget.style.background="#fff5f0"}
                  onMouseOut={e=>e.currentTarget.style.background="#f5f2ed"}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:18}}>{app.icon||"📋"}</span>
                    <div>
                      <div style={{fontSize:13,fontWeight:700}}>{app.formName}</div>
                      <div style={{fontSize:11,color:"#8898aa"}}>
                        {app.student?.name} · {app.student?.rollNo}
                      </div>
                    </div>
                  </div>
                  <span style={{fontSize:11,color:"#e85d26",fontWeight:700}}>Review →</span>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{background:"white",borderRadius:14,padding:18,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                <h4 style={{fontSize:13,fontWeight:700,marginBottom:14}}>System Overview</h4>
                {[
                  {label:"Total Applications", value:totalApps, color:"#6366f1"},
                  {label:"Approved",           value:approved,  color:"#059669"},
                  {label:"Rejected",           value:rejected,  color:"#dc2626"},
                  {label:"Pending (All)",      value:totalApps-approved-rejected, color:"#f59e0b"},
                ].map(s=>(
                  <div key={s.label} style={{display:"flex",justifyContent:"space-between",
                    alignItems:"center",marginBottom:10}}>
                    <span style={{fontSize:12,color:"#8898aa"}}>{s.label}</span>
                    <span style={{fontSize:15,fontWeight:700,color:s.color}}>{s.value}</span>
                  </div>
                ))}
              </div>
              <div style={{background:roleColor,borderRadius:14,padding:18,color:"white"}}>
                <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>Quick Action</div>
                <div style={{fontSize:12,opacity:0.85,marginBottom:12}}>
                  You have {pending} application{pending!==1?"s":""} waiting for your review.
                </div>
                <button onClick={()=>onNavigate("pending-approvals")}
                  style={{padding:"8px 16px",background:"rgba(255,255,255,0.2)",
                    border:"none",borderRadius:8,color:"white",fontWeight:700,
                    fontSize:12,cursor:"pointer",width:"100%"}}>
                  Review Now →
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}