import { StatCard, PageWrapper, StatusBadge } from "../components/UI";
import { APPLICATIONS, ANALYTICS, ROLE_COLORS } from "../data/mockData";

export default function GenericDashboard({ user }) {
  const roleColor = ROLE_COLORS[user.role];
  const pending   = APPLICATIONS.filter(a => a.status === "pending" || a.status === "in-review");

  return (
    <PageWrapper title={`Welcome, ${user.name.split(" ")[0]}!`} subtitle={user.dept ? `${user.dept}` : "Institutional Portal"}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="⏳" label="Pending Approvals"   value={pending.length}              color={roleColor} />
        <StatCard icon="✅" label="Approved (Month)"    value={ANALYTICS.approvedThisMonth} color="#059669"   />
        <StatCard icon="📊" label="Total Processed"     value="284"                         color="#2563eb"   />
        <StatCard icon="⚡" label="Avg. Response (days)"value="2.1"                         color="#f59e0b"   />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Pending list */}
        <div style={{ background: "white", borderRadius: 18, padding: 24, boxShadow: "var(--shadow)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Applications Awaiting Action</h3>
          {pending.slice(0, 4).map(app => (
            <div key={app.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f5f2ed" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{app.formName}</div>
                <div style={{ fontSize: 11, color: "#8898aa", marginTop: 2 }}>{app.studentName} · {app.submittedOn}</div>
              </div>
              <StatusBadge status={app.status} />
            </div>
          ))}
        </div>

        {/* Quick stats dark card */}
        <div style={{ background: "linear-gradient(135deg,#0d1b2a,#1e2d42)", borderRadius: 18, padding: 24, color: "white" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 16 }}>📊 Quick Metrics</h3>
          {[
            ["Processed Today",     "12"],
            ["Avg. Approval Time",  "2.3 days"],
            ["Rejection Rate",      "5.8%"],
            ["Student Satisfaction","94.2%"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
