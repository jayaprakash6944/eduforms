import { NAV_ITEMS } from "../data/mockData";

const ROLE_LABELS = {
  student:"Student", faculty:"Faculty", mentor:"Mentor",
  hod:"Head of Department", college_admin:"College Admin",
  placement_director:"Placement Director", college_director:"College Director",
};
const ROLE_COLORS = {
  student:"#e85d26", faculty:"#059669", mentor:"#2563eb",
  hod:"#7c3aed", college_admin:"#374151",
  placement_director:"#f59e0b", college_director:"#dc2626",
};

function Avatar({ initials, size=38, bg="#e85d26" }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:bg,
      color:"white", display:"flex", alignItems:"center", justifyContent:"center",
      fontWeight:800, fontSize:size*0.35, flexShrink:0 }}>
      {initials}
    </div>
  );
}

export default function Sidebar({ user, currentPage, onNavigate, onLogout, unreadCount=0, pendingCount=0, openFeedbackCount=0 }) {
  const role      = user?.role;
  const roleColor = ROLE_COLORS[role] || "#e85d26";

  const navItems = (NAV_ITEMS[role] || []).map(item => {
    let badge;
    if (item.key === "notifications")     badge = unreadCount       > 0 ? unreadCount       : undefined;
    if (item.key === "pending-approvals") badge = pendingCount       > 0 ? pendingCount       : undefined;
    if (item.key === "feedback-admin")    badge = openFeedbackCount  > 0 ? openFeedbackCount  : undefined;
    return { ...item, badge };
  });

  const initials = user?.avatar || (user?.name || "U").split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();

  return (
    <aside style={{ width:240, height:"100vh", position:"fixed", top:0, left:0,
      background:"#0d1b2a", display:"flex", flexDirection:"column", zIndex:100 }}>

      {/* Logo */}
      <div style={{ padding:"22px 20px 14px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:"#e85d26",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🎓</div>
          <div>
            <div style={{ color:"white", fontWeight:800, fontSize:15 }}>EduForms</div>
            <div style={{ color:"rgba(255,255,255,0.35)", fontSize:10 }}>Digital Portal</div>
          </div>
        </div>
      </div>

      {/* User info */}
      <div style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <Avatar initials={initials} bg={roleColor}/>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ color:"white", fontWeight:700, fontSize:13,
              whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
              {user?.name}
            </div>
            <div style={{ background:roleColor+"25", color:roleColor, fontSize:9,
              fontWeight:700, padding:"1px 7px", borderRadius:99,
              display:"inline-block", marginTop:2, textTransform:"uppercase", letterSpacing:0.3 }}>
              {ROLE_LABELS[role] || role}
            </div>
          </div>
        </div>
        {user?.dept        && <div style={{ color:"rgba(255,255,255,0.35)", fontSize:11, marginBottom:2 }}>🏫 {user.dept}</div>}
        {user?.rollNo      && <div style={{ color:"rgba(255,255,255,0.35)", fontSize:11, marginBottom:2 }}>🪪 {user.rollNo}</div>}
        {user?.designation && <div style={{ color:"rgba(255,255,255,0.35)", fontSize:11, marginBottom:2 }}>👔 {user.designation}</div>}
        {user?.employeeId  && <div style={{ color:"rgba(255,255,255,0.35)", fontSize:11 }}>🆔 {user.employeeId}</div>}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"10px 10px", overflowY:"auto" }}>
        {navItems.map(item => {
          const active = currentPage === item.key;
          return (
            <button key={item.key} onClick={() => onNavigate(item.key)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:10,
                padding:"9px 12px", borderRadius:10, border:"none", cursor:"pointer",
                marginBottom:2, transition:"all 0.15s",
                background: active ? roleColor : "transparent",
                color:      active ? "white"    : "rgba(255,255,255,0.5)" }}
              onMouseOver={e => { if (!active) e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.color="white"; }}
              onMouseOut={e  => { if (!active) { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,0.5)"; } }}>
              <span style={{ fontSize:15 }}>{item.icon}</span>
              <span style={{ fontSize:13, fontWeight:active?700:500, flex:1, textAlign:"left" }}>
                {item.label}
              </span>
              {item.badge > 0 && (
                <span style={{ background:active?"rgba(255,255,255,0.25)":roleColor,
                  color:"white", fontSize:10, fontWeight:700,
                  padding:"1px 7px", borderRadius:99, minWidth:18, textAlign:"center" }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sign out */}
      <div style={{ padding:"10px 10px", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        <button onClick={onLogout}
          style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"none",
            cursor:"pointer", background:"rgba(220,38,38,0.1)", color:"#f87171",
            fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:8,
            transition:"all 0.15s" }}
          onMouseOver={e => { e.currentTarget.style.background="rgba(220,38,38,0.2)"; }}
          onMouseOut={e  => { e.currentTarget.style.background="rgba(220,38,38,0.1)"; }}>
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
}