import { Avatar } from "./UI";
import { NAV_ITEMS, ROLE_LABELS, ROLE_COLORS } from "../data/mockData";

export default function Sidebar({ user, currentPage, onNavigate, onLogout }) {
  const navItems  = NAV_ITEMS[user.role] || [];
  const roleColor = ROLE_COLORS[user.role];

  return (
    <div style={{
      width: 240, minHeight: "100vh", background: "var(--navy)",
      display: "flex", flexDirection: "column",
      position: "fixed", top: 0, left: 0, zIndex: 100,
      boxShadow: "4px 0 24px rgba(0,0,0,0.2)",
    }}>
      {/* ── Logo ────────────────────────────────────────────────────────── */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #e85d26, #f07a47)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎓</div>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 15, letterSpacing: -0.3 }}>EduForms</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: 0.3 }}>v2.0 Portal</div>
          </div>
        </div>
      </div>

      {/* ── User Info ───────────────────────────────────────────────────── */}
      <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar initials={user.avatar} size={38} bg={roleColor} />
          <div style={{ overflow: "hidden" }}>
            <div style={{ color: "white", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user.name}
            </div>
            <div style={{ background: roleColor + "22", color: roleColor, fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 99, display: "inline-block", marginTop: 3, letterSpacing: 0.3 }}>
              {ROLE_LABELS[user.role]}
            </div>
          </div>
        </div>
        {user.dept   && <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 8,  paddingLeft: 2 }}>🏛 {user.dept}</div>}
        {user.rollNo && <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 2, paddingLeft: 2 }}>🪪 {user.rollNo}</div>}
      </div>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        {navItems.map(item => {
          const active = currentPage === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 10, marginBottom: 2,
                background: active ? "rgba(232,93,38,0.18)" : "transparent",
                color:      active ? "#f07a47" : "rgba(255,255,255,0.6)",
                fontWeight: active ? 600 : 400,
                fontSize: 13.5, transition: "all 0.15s",
                border: "none", cursor: "pointer", textAlign: "left",
                position: "relative",
              }}
              onMouseOver={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseOut={e  => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              {active && <div style={{ position: "absolute", left: 0, top: "20%", height: "60%", width: 3, borderRadius: 99, background: "#e85d26" }} />}
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{ background: "#e85d26", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 99, minWidth: 18, textAlign: "center" }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Logout ──────────────────────────────────────────────────────── */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <button
          onClick={onLogout}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 10, background: "rgba(220,38,38,0.1)", color: "#f87171", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 8, border: "none", cursor: "pointer", transition: "all 0.15s" }}
          onMouseOver={e => e.currentTarget.style.background = "rgba(220,38,38,0.2)"}
          onMouseOut={e  => e.currentTarget.style.background = "rgba(220,38,38,0.1)"}
        >
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
}
