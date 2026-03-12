// Sidebar receives unreadCount and pendingCount as plain props
// NO context imports — zero risk of null context errors
import { NAV_ITEMS } from "../data/mockData";

const ROLE_LABELS = {
  student:"Student", mentor:"Mentor", hod:"Head of Department",
  college_admin:"College Admin", placement_director:"Placement Director",
  college_director:"College Director",
};
const ROLE_COLORS = {
  student:"#e85d26", mentor:"#2563eb", hod:"#7c3aed",
  college_admin:"#059669", placement_director:"#f59e0b", college_director:"#dc2626",
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

export default function Sidebar({ user, currentPage, onNavigate, onLogout, unreadCount=0, pendingCount=0 }) {
  const roleColor = ROLE_COLORS[user?.role] || "#e85d26";

  const navItems = (NAV_ITEMS[user?.role] || []).map(item => {
    let badge;
    if (item.key === "notifications")     badge = unreadCount  > 0 ? unreadCount  : undefined;
    if (item.key === "pending-approvals") badge = pendingCount > 0 ? pendingCount : undefined;
    return { ...item, badge };
  });

  return (
    <aside style={{ width:240, height:"100vh", position:"fixed", top:0, left:0,
      background:"#0d1b2a", display:"flex", flexDirection:"column", zIndex:100 }}>

      {/* Logo */}
      <div style={{ padding:"24px 20px 16px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:"#e85d26",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🎓</div>
          <div>
            <div style={{ color:"white", fontWeight:800, fontSize:15, letterSpacing:-0.3 }}>EduForms</div>
            <div style={{ color:"rgba(255,255,255,0.4)", fontSize:10 }}>v2.0 Portal</div>
          </div>
        </div>
      </div>

      {/* User info */}
      <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <Avatar
            initials={user?.avatar || (user?.name || "U").slice(0,2).toUpperCase()}
            bg={roleColor}
          />
          <div>
            <div style={{ color:"white", fontWeight:700, fontSize:13 }}>{user?.name}</div>
            <div style={{ background:roleColor+"25", color:roleColor, fontSize:10,
              fontWeight:700, padding:"1px 7px", borderRadius:99, display:"inline-block", marginTop:2 }}>
              {ROLE_LABELS[user?.role] || user?.role}
            </div>
          </div>
        </div>
        {user?.dept   && <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>🏫 {user.dept}</div>}
        {user?.rollNo && <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11, marginTop:3 }}>🪪 {user.rollNo}</div>}
      </div>

      {/* Navigation */}
      <nav style={{ flex:1, padding:"12px", overflowY:"auto" }}>
        {navItems.map(item => {
          const active = currentPage === item.key;
          return (
            <button key={item.key} onClick={() => onNavigate(item.key)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:10,
                padding:"10px 12px", borderRadius:10, border:"none", cursor:"pointer",
                marginBottom:2, transition:"all 0.15s",
                background: active ? "#e85d26" : "transparent",
                color:      active ? "white"    : "rgba(255,255,255,0.55)" }}>
              <span style={{ fontSize:16 }}>{item.icon}</span>
              <span style={{ fontSize:13, fontWeight:active?700:500, flex:1, textAlign:"left" }}>
                {item.label}
              </span>
              {item.badge > 0 && (
                <span style={{ background: active ? "rgba(255,255,255,0.3)" : "#e85d26",
                  color:"white", fontSize:10, fontWeight:700,
                  padding:"1px 6px", borderRadius:99, minWidth:18, textAlign:"center" }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sign out */}
      <div style={{ padding:"12px", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        <button onClick={onLogout}
          style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"none",
            cursor:"pointer", background:"rgba(232,93,38,0.12)", color:"#e85d26",
            fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:8 }}>
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
}