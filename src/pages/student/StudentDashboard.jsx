import { StatCard, Btn, PageWrapper } from "../../components/UI";
import { APPLICATIONS, FORM_TEMPLATES, NOTIFICATIONS } from "../../data/mockData";
import { StatusBadge } from "../../components/UI";

export default function StudentDashboard({ user, onNavigate }) {
  const myApps = APPLICATIONS.filter(a => a.rollNo === user.rollNo);
  const stats = [
    { icon: "📋", label: "Total Applications", value: myApps.length,                                                  color: "#2563eb" },
    { icon: "✅", label: "Approved",            value: myApps.filter(a => a.status === "approved").length,            color: "#059669" },
    { icon: "⏳", label: "Pending",             value: myApps.filter(a => ["pending","in-review"].includes(a.status)).length, color: "#f59e0b" },
    { icon: "❌", label: "Rejected",            value: myApps.filter(a => a.status === "rejected").length,            color: "#dc2626" },
  ];

  return (
    <PageWrapper title={`Good morning, ${user.name.split(" ")[0]}! 👋`} subtitle={`${user.dept} · ${user.year} · ${user.rollNo}`}>
      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent Applications */}
        <div style={{ background: "white", borderRadius: 18, padding: 24, boxShadow: "var(--shadow)", border: "1px solid #f0ebe3" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Recent Applications</h3>
            <Btn small variant="secondary" onClick={() => onNavigate("my-applications")}>View All</Btn>
          </div>
          {myApps.slice(0, 3).map(app => (
            <div key={app.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f5f2ed" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{app.formName}</div>
                <div style={{ fontSize: 11, color: "#8898aa", marginTop: 2 }}>{app.id} · {app.submittedOn}</div>
              </div>
              <StatusBadge status={app.status} />
            </div>
          ))}
        </div>

        {/* Quick Apply */}
        <div style={{ background: "white", borderRadius: 18, padding: 24, boxShadow: "var(--shadow)", border: "1px solid #f0ebe3" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Quick Apply</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {FORM_TEMPLATES.filter(f => f.popular).slice(0, 4).map(f => (
              <button key={f.id} onClick={() => onNavigate("browse-forms")}
                style={{ padding: 14, background: f.color + "08", border: `1.5px solid ${f.color}25`, borderRadius: 12, textAlign: "left", cursor: "pointer", transition: "all 0.15s" }}
                onMouseOver={e => { e.currentTarget.style.background = f.color + "15"; e.currentTarget.style.borderColor = f.color + "50"; }}
                onMouseOut={e  => { e.currentTarget.style.background = f.color + "08"; e.currentTarget.style.borderColor = f.color + "25"; }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{f.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#1a2332", lineHeight: 1.3 }}>{f.name}</div>
                <div style={{ fontSize: 10, color: "#8898aa", marginTop: 3 }}>{f.time}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications Preview */}
        <div style={{ background: "white", borderRadius: 18, padding: 24, boxShadow: "var(--shadow)", border: "1px solid #f0ebe3" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Notifications</h3>
            <span style={{ background: "#e85d26", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>2 New</span>
          </div>
          {NOTIFICATIONS.slice(0, 3).map(n => (
            <div key={n.id} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: "1px solid #f5f2ed", opacity: n.read ? 0.6 : 1 }}>
              <span style={{ fontSize: 18 }}>{n.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600 }}>{n.title}</div>
                <div style={{ fontSize: 11, color: "#8898aa", marginTop: 2 }}>{n.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Deadlines */}
        <div style={{ background: "linear-gradient(135deg, #0d1b2a, #1e2d42)", borderRadius: 18, padding: 24, color: "white" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 18 }}>⏰ Upcoming Deadlines</h3>
          {[
            { label: "Exam Fee Payment",    date: "Jan 25, 2024", days: 5,  color: "#f59e0b" },
            { label: "Scholarship Form",    date: "Feb 1, 2024",  days: 12, color: "#e85d26" },
            { label: "Hostel Room Renewal", date: "Feb 15, 2024", days: 26, color: "#2563eb" },
          ].map(d => (
            <div key={d.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.9)" }}>{d.label}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{d.date}</div>
              </div>
              <span style={{ background: d.color + "25", color: d.color, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99 }}>{d.days}d left</span>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
