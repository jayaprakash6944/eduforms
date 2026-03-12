// ─────────────────────────────────────────────────────────────────────────────
// StudentDashboard.jsx — Live stats from MongoDB
// ─────────────────────────────────────────────────────────────────────────────
import { useAuth } from "../../contexts/AuthContext";
import { useApp }  from "../../contexts/AppContext";

const DEADLINES = [
  { name:"Exam Fee Payment",   date:"Jan 25, 2025", daysLeft:5  },
  { name:"Scholarship Form",   date:"Feb 1, 2025",  daysLeft:12 },
  { name:"Hostel Room Renewal",date:"Feb 10, 2025", daysLeft:21 },
];

function StatCard({ icon, value, label, color, bg }) {
  return (
    <div style={{background:"white",borderRadius:16,padding:"20px",boxShadow:"0 2px 12px rgba(13,27,42,0.06)",display:"flex",alignItems:"center",gap:14}}>
      <div style={{width:48,height:48,borderRadius:12,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{icon}</div>
      <div>
        <div style={{fontSize:26,fontWeight:800,color}}>{value}</div>
        <div style={{fontSize:12,color:"#8898aa",fontWeight:500,marginTop:1}}>{label}</div>
      </div>
    </div>
  );
}

function StatusDot({ status }) {
  const map = {
    approved:  {color:"#059669",bg:"#f0fdf4",label:"Approved"},
    pending:   {color:"#f59e0b",bg:"#fffbeb",label:"Pending"},
    "in-review":{color:"#2563eb",bg:"#eff6ff",label:"In Review"},
    rejected:  {color:"#dc2626",bg:"#fef2f2",label:"Rejected"},
  };
  const s = map[status]||map.pending;
  return (
    <span style={{background:s.bg,color:s.color,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:99,display:"inline-flex",alignItems:"center",gap:5}}>
      <span style={{width:6,height:6,borderRadius:"50%",background:s.color,display:"inline-block"}}/>{s.label}
    </span>
  );
}

export default function StudentDashboard({ onNavigate = () => {} }) {
  const { user }   = useAuth();
  const { applications, notifications, unreadCount, forms, loadingApps } = useApp();

  // Stats from real data
  const stats = {
    total:    applications.length,
    approved: applications.filter(a=>a.status==="approved").length,
    pending:  applications.filter(a=>["pending","in-review"].includes(a.status)).length,
    rejected: applications.filter(a=>a.status==="rejected").length,
  };

  const recentApps   = applications.slice(0,3);
  const recentNotifs = notifications.slice(0,3);
  const quickForms   = forms.filter(f=>f.popular).slice(0,4);

  const hour     = new Date().getHours();
  const greeting = hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";

  return (
    <div style={{padding:"28px 32px"}}>
      {/* Header */}
      <div style={{marginBottom:28}}>
        <h1 style={{fontSize:26,fontWeight:800,color:"#0d1b2a",marginBottom:4}}>
          {greeting}, {user.name?.split(" ")[0]}! 👋
        </h1>
        <p style={{color:"#8898aa",fontSize:14}}>
          {user.dept} · {user.year} · {user.rollNo}
        </p>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28}}>
        <StatCard icon="📋" value={stats.total}    label="Total Applications" color="#6366f1" bg="#eef2ff"/>
        <StatCard icon="✅" value={stats.approved} label="Approved"           color="#059669" bg="#f0fdf4"/>
        <StatCard icon="⏳" value={stats.pending}  label="In Progress"        color="#f59e0b" bg="#fffbeb"/>
        <StatCard icon="❌" value={stats.rejected} label="Rejected"           color="#dc2626" bg="#fef2f2"/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:20,marginBottom:20}}>

        {/* Recent Applications */}
        <div style={{background:"white",borderRadius:18,padding:24,boxShadow:"0 2px 12px rgba(13,27,42,0.06)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <h3 style={{fontSize:16,fontWeight:700}}>Recent Applications</h3>
            <button onClick={()=>onNavigate("my-applications")}
              style={{fontSize:12,fontWeight:600,color:"#e85d26",background:"#fff5f0",border:"none",borderRadius:8,padding:"5px 12px",cursor:"pointer"}}>
              View All
            </button>
          </div>
          {loadingApps ? (
            <div style={{textAlign:"center",padding:"20px",color:"#8898aa",fontSize:13}}>⏳ Loading...</div>
          ) : recentApps.length===0 ? (
            <div style={{textAlign:"center",padding:"30px 0",color:"#8898aa",fontSize:13}}>
              <div style={{fontSize:32,marginBottom:8}}>📭</div>
              No applications yet.{" "}
              <span style={{color:"#e85d26",cursor:"pointer",fontWeight:600}} onClick={()=>onNavigate("browse-forms")}>Browse forms →</span>
            </div>
          ) : recentApps.map(app => (
            <div key={app._id||app.appId} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid #f5f2ed"}}>
              <div>
                <div style={{fontSize:14,fontWeight:600}}>{app.formName}</div>
                <div style={{fontSize:11,color:"#8898aa",marginTop:2}}>
                  {app.appId} · {app.submittedOn?new Date(app.submittedOn).toLocaleDateString():"—"}
                </div>
              </div>
              <StatusDot status={app.status}/>
            </div>
          ))}
        </div>

        {/* Quick Apply */}
        <div style={{background:"white",borderRadius:18,padding:24,boxShadow:"0 2px 12px rgba(13,27,42,0.06)"}}>
          <h3 style={{fontSize:16,fontWeight:700,marginBottom:16}}>Quick Apply</h3>
          {quickForms.length===0 ? (
            <div style={{color:"#8898aa",fontSize:13,textAlign:"center",padding:"20px 0"}}>Loading forms...</div>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {quickForms.map(f => (
                <div key={f._id}
                  onClick={()=>onNavigate("browse-forms")}
                  style={{background:"#f5f2ed",borderRadius:12,padding:"14px",cursor:"pointer",transition:"all 0.15s"}}
                  onMouseOver={e=>{e.currentTarget.style.background=f.color+"15";e.currentTarget.style.transform="translateY(-2px)";}}
                  onMouseOut={e=>{e.currentTarget.style.background="#f5f2ed";e.currentTarget.style.transform="none";}}>
                  <div style={{fontSize:22,marginBottom:6}}>{f.icon}</div>
                  <div style={{fontSize:12,fontWeight:700,marginBottom:2}}>{f.name}</div>
                  <div style={{fontSize:10,color:"#8898aa"}}>⏱ {f.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:20}}>

        {/* Notifications preview */}
        <div style={{background:"white",borderRadius:18,padding:24,boxShadow:"0 2px 12px rgba(13,27,42,0.06)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <h3 style={{fontSize:16,fontWeight:700}}>Notifications</h3>
              {unreadCount>0 && (
                <span style={{background:"#e85d26",color:"white",fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:99}}>
                  {unreadCount} New
                </span>
              )}
            </div>
            <button onClick={()=>onNavigate("notifications")}
              style={{fontSize:12,fontWeight:600,color:"#e85d26",background:"#fff5f0",border:"none",borderRadius:8,padding:"5px 12px",cursor:"pointer"}}>
              View All
            </button>
          </div>
          {recentNotifs.length===0 ? (
            <div style={{textAlign:"center",padding:"30px 0",color:"#8898aa",fontSize:13}}>No notifications yet</div>
          ) : recentNotifs.map(n => (
            <div key={n._id||n.id} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:"1px solid #f5f2ed",alignItems:"flex-start"}}>
              <div style={{width:34,height:34,borderRadius:10,background:n.read?"#f5f2ed":"#fff5f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>
                {n.icon||"🔔"}
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:n.read?500:700}}>{n.title}</div>
                <div style={{fontSize:11,color:"#8898aa",marginTop:2}}>{n.time || new Date(n.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Deadlines */}
        <div style={{background:"#0d1b2a",borderRadius:18,padding:24}}>
          <h3 style={{fontSize:16,fontWeight:700,color:"white",marginBottom:16}}>🚨 Upcoming Deadlines</h3>
          {DEADLINES.map(d => (
            <div key={d.name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:"white"}}>{d.name}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:2}}>{d.date}</div>
              </div>
              <span style={{background:d.daysLeft<=7?"#e85d26":d.daysLeft<=14?"#f59e0b":"#059669",color:"white",fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:99}}>
                {d.daysLeft}d left
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}