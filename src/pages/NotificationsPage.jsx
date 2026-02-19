import { useState } from "react";
import { NOTIFICATIONS } from "../data/mockData";
import { PageWrapper, Btn } from "../components/UI";

export default function NotificationsPage() {
  const [items, setItems] = useState(NOTIFICATIONS);

  const markAll  = () => setItems(items.map(n => ({ ...n, read: true })));
  const markOne  = (id) => setItems(items.map(n => n.id === id ? { ...n, read: true } : n));
  const unread   = items.filter(n => !n.read).length;

  return (
    <PageWrapper
      title="Notifications"
      subtitle={`${unread} unread notification${unread !== 1 ? "s" : ""}`}
      actions={<Btn variant="secondary" small onClick={markAll}>Mark all read</Btn>}
    >
      <div style={{ background: "white", borderRadius: 18, boxShadow: "var(--shadow)", overflow: "hidden" }}>
        {items.map((n, i) => (
          <div key={n.id}
            onClick={() => markOne(n.id)}
            style={{ display: "flex", gap: 16, padding: "20px 24px", borderBottom: i < items.length - 1 ? "1px solid #f5f2ed" : "none", background: n.read ? "transparent" : "#fff8f5", cursor: "pointer", transition: "background 0.15s" }}
            onMouseOver={e => e.currentTarget.style.background = "#fafaf8"}
            onMouseOut={e  => e.currentTarget.style.background = n.read ? "transparent" : "#fff8f5"}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: n.read ? "#f5f2ed" : "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
              {n.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h4 style={{ fontSize: 14, fontWeight: n.read ? 500 : 700 }}>{n.title}</h4>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "#8898aa" }}>{n.time}</span>
                  {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e85d26" }} />}
                </div>
              </div>
              <p style={{ fontSize: 13, color: "#4a5568", marginTop: 4, lineHeight: 1.55 }}>{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
