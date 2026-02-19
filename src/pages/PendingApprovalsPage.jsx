import { useState } from "react";
import { APPLICATIONS, FORM_TEMPLATES } from "../data/mockData";
import { PageWrapper, Btn, StatusBadge, Avatar, EmptyState } from "../components/UI";

function ReviewDetail({ app, onBack, onAction }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (type) => {
    if (type === "reject" && !comment.trim()) return alert("Please add a rejection reason.");
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    onAction(app.id, type, comment);
  };

  return (
    <PageWrapper title="Review Application" subtitle={app.id} actions={<Btn variant="secondary" onClick={onBack}>← Back</Btn>}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* App info */}
          <div style={{ background: "white", borderRadius: 18, padding: 28, boxShadow: "var(--shadow)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>{app.formName}</h2>
                <p style={{ color: "#8898aa", fontSize: 13, marginTop: 4 }}>Submitted by {app.studentName} ({app.rollNo}) on {app.submittedOn}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Previous Approvals</h3>
            {app.steps.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: s.status === "waiting" ? "#8898aa" : "white", background: s.status === "approved" ? "#059669" : s.status === "rejected" ? "#dc2626" : s.status === "pending" ? "#f59e0b" : "#e8e4dc" }}>
                  {s.status === "approved" ? "✓" : s.status === "rejected" ? "✗" : i + 1}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                  {s.comment && <div style={{ fontSize: 12, color: "#4a5568", background: "#f5f2ed", padding: "6px 10px", borderRadius: 8, marginTop: 4 }}>{s.comment}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Action panel */}
          <div style={{ background: "white", borderRadius: 18, padding: 24, boxShadow: "var(--shadow)" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Your Decision</h3>
            <textarea placeholder="Add comments (required for rejection)…" value={comment} onChange={e => setComment(e.target.value)} style={{ minHeight: 100, resize: "vertical", marginBottom: 16 }} />
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => handle("approve")} disabled={loading}
                style={{ flex: 1, padding: 12, background: loading ? "#ccc" : "linear-gradient(135deg,#059669,#047857)", color: "white", borderRadius: 12, fontWeight: 700, fontSize: 14, border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
                ✅ Approve
              </button>
              <button onClick={() => handle("reject")} disabled={loading}
                style={{ flex: 1, padding: 12, background: loading ? "#ccc" : "linear-gradient(135deg,#dc2626,#b91c1c)", color: "white", borderRadius: 12, fontWeight: 700, fontSize: 14, border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
                ❌ Reject
              </button>
            </div>
          </div>
        </div>

        {/* Student info */}
        <div style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "var(--shadow)", height: "fit-content" }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Student Profile</h4>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Avatar initials={app.studentName.split(" ").map(w => w[0]).join("")} size={52} bg="#e85d26" />
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 8 }}>{app.studentName}</div>
            <div style={{ fontSize: 12, color: "#8898aa" }}>{app.rollNo}</div>
          </div>
          {[["Department", app.dept], ["Form Applied", app.formName], ["Submitted", app.submittedOn]].map(([k, v]) => (
            <div key={k} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: "#8898aa", fontWeight: 600, textTransform: "uppercase" }}>{k}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

// Success screen
function ActionDone({ type }) {
  return (
    <PageWrapper title="">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px", background: "white", borderRadius: 20 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>{type === "approve" ? "✅" : "❌"}</div>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>{type === "approve" ? "Application Approved!" : "Application Rejected"}</h2>
        <p style={{ color: "#8898aa", marginTop: 8 }}>Student has been notified via email and in-app.</p>
      </div>
    </PageWrapper>
  );
}

export default function PendingApprovalsPage() {
  const [apps, setApps]       = useState(APPLICATIONS.filter(a => a.status === "pending" || a.status === "in-review"));
  const [selected, setSelected] = useState(null);
  const [lastAction, setLastAction] = useState(null);

  const handleAction = (id, type) => {
    setApps(prev => prev.filter(a => a.id !== id));
    setSelected(null);
    setLastAction(type);
    setTimeout(() => setLastAction(null), 2500);
  };

  if (lastAction) return <ActionDone type={lastAction} />;
  if (selected)   return <ReviewDetail app={selected} onBack={() => setSelected(null)} onAction={handleAction} />;

  return (
    <PageWrapper title="Pending Approvals" subtitle={`${apps.length} application${apps.length !== 1 ? "s" : ""} awaiting your review`}>
      {apps.length === 0
        ? <EmptyState emoji="🎉" title="All caught up!" subtitle="No pending approvals at this time." />
        : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {apps.map(app => {
              const tmpl = FORM_TEMPLATES.find(f => f.name === app.formName);
              return (
                <div key={app.id}
                  style={{ background: "white", borderRadius: 16, padding: "20px 24px", boxShadow: "var(--shadow)", display: "flex", alignItems: "center", gap: 16, transition: "all 0.15s" }}
                  onMouseOver={e => e.currentTarget.style.boxShadow = "0 8px 32px rgba(13,27,42,0.12)"}
                  onMouseOut={e  => e.currentTarget.style.boxShadow = "var(--shadow)"}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fff5f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                    {tmpl?.icon || "📋"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{app.formName}</div>
                    <div style={{ fontSize: 13, color: "#8898aa", marginTop: 2 }}>{app.studentName} · {app.rollNo} · {app.dept}</div>
                  </div>
                  <div style={{ textAlign: "right", marginRight: 8 }}>
                    <div style={{ fontSize: 12, color: "#8898aa" }}>{app.submittedOn}</div>
                    <div style={{ marginTop: 4 }}><StatusBadge status={app.status} /></div>
                  </div>
                  <Btn small onClick={() => setSelected(app)}>Review →</Btn>
                </div>
              );
            })}
          </div>
        )
      }
    </PageWrapper>
  );
}
