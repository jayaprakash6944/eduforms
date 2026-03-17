import { useAuth } from "../../contexts/AuthContext";
import { useApp }  from "../../contexts/AppContext";
import { MOCK_SCHEDULE } from "../../data/mockData";

const TODAY = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];
const DAYS  = ["Monday","Tuesday","Wednesday","Thursday","Friday"];

function StatCard({ icon, value, label, color, bg }) {
  return (
    <div style={{ background:"white", borderRadius:16, padding:20, boxShadow:"0 2px 12px rgba(13,27,42,0.06)", display:"flex", alignItems:"center", gap:14 }}>
      <div style={{ width:48, height:48, borderRadius:12, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{icon}</div>
      <div>
        <div style={{ fontSize:26, fontWeight:800, color }}>{value}</div>
        <div style={{ fontSize:12, color:"#8898aa", fontWeight:500, marginTop:1 }}>{label}</div>
      </div>
    </div>
  );
}

function StatusDot({ status }) {
  const map = { approved:{color:"#059669",bg:"#f0fdf4",label:"Approved"}, pending:{color:"#f59e0b",bg:"#fffbeb",label:"Pending"}, "in-review":{color:"#2563eb",bg:"#eff6ff",label:"In Review"}, rejected:{color:"#dc2626",bg:"#fef2f2",label:"Rejected"} };
  const s = map[status]||map.pending;
  return (
    <span style={{ background:s.bg, color:s.color, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:99, display:"inline-flex", alignItems:"center", gap:5 }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:s.color, display:"inline-block" }}/>{s.label}
    </span>
  );
}

export default function FacultyDashboard({ onNavigate = () => {} }) {
  const { user } = useAuth();
  const { applications, notifications, unreadCount, forms, loadingApps } = useApp();

  const stats = {
    total:    applications.length,
    approved: applications.filter(a => a.status === "approved").length,
    pending:  applications.filter(a => ["pending","in-review"].includes(a.status)).length,
    rejected: applications.filter(a => a.status === "rejected").length,
  };

  const recentApps   = applications.slice(0, 4);
  const recentNotifs = notifications.slice(0, 3);
  const todayClasses = MOCK_SCHEDULE[TODAY] || MOCK_SCHEDULE["Monday"];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const quickForms = [
    { icon:"📅", label:"Casual Leave",     key:"browse-forms", color:"#2563eb", bg:"#eff6ff" },
    { icon:"🎓", label:"FDP / Workshop",   key:"browse-forms", color:"#7c3aed", bg:"#f5f3ff" },
    { icon:"🎤", label:"Conference",       key:"browse-forms", color:"#e85d26", bg:"#fff5f0" },
    { icon:"💰", label:"Travel Claim",     key:"browse-forms", color:"#059669", bg:"#f0fdf4" },
    { icon:"🔬", label:"Research Proposal",key:"browse-forms", color:"#f59e0b", bg:"#fffbeb" },
    { icon:"🖥️", label:"Equipment Request",key:"browse-forms", color:"#374151", bg:"#f9fafb" },
  ];

  return (
    <div style={{ padding:"28px 32px" }}>
      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:26, fontWeight:800, color:"#0d1b2a", marginBottom:4 }}>
          {greeting}, {user.name?.split(" ")[0]}! 👋
        </h1>
        <p style={{ color:"#8898aa", fontSize:13 }}>
          {user.designation || "Faculty"} · {user.dept} · {user.employeeId || ""}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        <StatCard icon="📋" value={stats.total}    label="Total Requests" color="#6366f1" bg="#eef2ff"/>
        <StatCard icon="✅" value={stats.approved} label="Approved"        color="#059669" bg="#f0fdf4"/>
        <StatCard icon="⏳" value={stats.pending}  label="In Progress"     color="#f59e0b" bg="#fffbeb"/>
        <StatCard icon="❌" value={stats.rejected} label="Rejected"        color="#dc2626" bg="#fef2f2"/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:20, marginBottom:20 }}>

        {/* Today's Schedule */}
        <div style={{ background:"white", borderRadius:18, padding:24, boxShadow:"0 2px 12px rgba(13,27,42,0.06)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <h3 style={{ fontSize:15, fontWeight:700 }}>📅 Today's Schedule — {TODAY}</h3>
            <button onClick={() => onNavigate("class-schedule")}
              style={{ fontSize:12, fontWeight:600, color:"#059669", background:"#f0fdf4", border:"none", borderRadius:8, padding:"5px 12px", cursor:"pointer" }}>
              Full Schedule
            </button>
          </div>
          {todayClasses.length === 0 ? (
            <div style={{ textAlign:"center", padding:"30px 0", color:"#8898aa", fontSize:13 }}>
              <div style={{ fontSize:32, marginBottom:8 }}>🎉</div>No classes today!
            </div>
          ) : todayClasses.map((cls, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom:"1px solid #f5f2ed" }}>
              <div style={{ width:80, fontSize:11, fontWeight:700, color:"#059669", flexShrink:0 }}>{cls.time}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:600, color:"#0d1b2a" }}>{cls.subject}</div>
                <div style={{ fontSize:11, color:"#8898aa", marginTop:2 }}>{cls.batch} · {cls.room}</div>
              </div>
              <div style={{ background:"#f5f2ed", borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:600, color:"#4a5568" }}>
                {cls.room}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Apply */}
        <div style={{ background:"white", borderRadius:18, padding:24, boxShadow:"0 2px 12px rgba(13,27,42,0.06)" }}>
          <h3 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>⚡ Quick Apply</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {quickForms.map(f => (
              <div key={f.label} onClick={() => onNavigate(f.key)}
                style={{ background:f.bg, borderRadius:12, padding:"12px 10px", cursor:"pointer", transition:"all 0.15s", border:`1.5px solid ${f.color}22` }}
                onMouseOver={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 4px 12px ${f.color}22`; }}
                onMouseOut={e  => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
                <div style={{ fontSize:20, marginBottom:6 }}>{f.icon}</div>
                <div style={{ fontSize:11, fontWeight:700, color:f.color }}>{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:20 }}>

        {/* Recent Requests */}
        <div style={{ background:"white", borderRadius:18, padding:24, boxShadow:"0 2px 12px rgba(13,27,42,0.06)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h3 style={{ fontSize:15, fontWeight:700 }}>Recent Requests</h3>
            <button onClick={() => onNavigate("my-applications")}
              style={{ fontSize:12, fontWeight:600, color:"#059669", background:"#f0fdf4", border:"none", borderRadius:8, padding:"5px 12px", cursor:"pointer" }}>
              View All
            </button>
          </div>
          {loadingApps ? (
            <div style={{ textAlign:"center", padding:"20px", color:"#8898aa", fontSize:13 }}>⏳ Loading...</div>
          ) : recentApps.length === 0 ? (
            <div style={{ textAlign:"center", padding:"30px 0", color:"#8898aa", fontSize:13 }}>
              <div style={{ fontSize:32, marginBottom:8 }}>📭</div>
              No requests yet.{" "}
              <span style={{ color:"#059669", cursor:"pointer", fontWeight:600 }} onClick={() => onNavigate("browse-forms")}>Apply now →</span>
            </div>
          ) : recentApps.map(app => (
            <div key={app._id||app.appId} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:"1px solid #f5f2ed" }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>{app.formName}</div>
                <div style={{ fontSize:11, color:"#8898aa", marginTop:2 }}>{app.appId} · {app.submittedOn ? new Date(app.submittedOn).toLocaleDateString() : "—"}</div>
              </div>
              <StatusDot status={app.status}/>
            </div>
          ))}
        </div>

        {/* Notifications */}
        <div style={{ background:"white", borderRadius:18, padding:24, boxShadow:"0 2px 12px rgba(13,27,42,0.06)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <h3 style={{ fontSize:15, fontWeight:700 }}>Notifications</h3>
              {unreadCount > 0 && (
                <span style={{ background:"#059669", color:"white", fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:99 }}>{unreadCount} New</span>
              )}
            </div>
            <button onClick={() => onNavigate("notifications")}
              style={{ fontSize:12, fontWeight:600, color:"#059669", background:"#f0fdf4", border:"none", borderRadius:8, padding:"5px 12px", cursor:"pointer" }}>
              View All
            </button>
          </div>
          {recentNotifs.length === 0 ? (
            <div style={{ textAlign:"center", padding:"30px 0", color:"#8898aa", fontSize:13 }}>No notifications yet</div>
          ) : recentNotifs.map(n => (
            <div key={n._id||n.id} style={{ display:"flex", gap:10, padding:"10px 0", borderBottom:"1px solid #f5f2ed", alignItems:"flex-start" }}>
              <div style={{ width:32, height:32, borderRadius:9, background:n.read?"#f5f2ed":"#f0fdf4", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>
                {n.icon||"🔔"}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:n.read?500:700 }}>{n.title}</div>
                <div style={{ fontSize:11, color:"#8898aa", marginTop:2 }}>{n.time || new Date(n.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}