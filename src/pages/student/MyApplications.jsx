import { useState } from "react";
import { APPLICATIONS } from "../../data/mockData";
import { PageWrapper, Btn, StatusBadge, Table, Tr, Td, FilterTabs } from "../../components/UI";

function ApplicationDetail({ app, onBack }) {
  return (
    <PageWrapper title="Application Details" subtitle={app.id} actions={<Btn variant="secondary" onClick={onBack}>← Back</Btn>}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div style={{ background: "white", borderRadius: 18, padding: 28, boxShadow: "var(--shadow)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>{app.formName}</h2>
              <p style={{ fontSize: 13, color: "#8898aa", marginTop: 4 }}>Submitted on {app.submittedOn}</p>
            </div>
            <StatusBadge status={app.status} />
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Approval Timeline</h3>
          <div style={{ position: "relative" }}>
            {app.steps.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 16, marginBottom: 24, position: "relative" }}>
                {i < app.steps.length - 1 && (
                  <div style={{ position: "absolute", left: 13, top: 30, width: 2, height: "100%", background: s.status === "approved" ? "#16a34a" : "#e8e4dc" }} />
                )}
                <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: s.status === "waiting" ? "#8898aa" : "white", background: s.status === "approved" ? "#16a34a" : s.status === "rejected" ? "#dc2626" : s.status === "pending" ? "#f59e0b" : "#e8e4dc" }}>
                  {s.status === "approved" ? "✓" : s.status === "rejected" ? "✗" : i + 1}
                </div>
                <div style={{ flex: 1, paddingTop: 2 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                    <StatusBadge status={s.status} />
                  </div>
                  {s.date    && <div style={{ fontSize: 12, color: "#8898aa", marginTop: 3 }}>{s.date}</div>}
                  {s.comment && <div style={{ fontSize: 13, color: "#4a5568", marginTop: 6, background: "#f5f2ed", padding: "8px 12px", borderRadius: 8 }}>💬 {s.comment}</div>}
                </div>
              </div>
            ))}
          </div>

          {app.status === "approved" && (
            <div style={{ marginTop: 20, padding: 16, background: "#f0fdf4", borderRadius: 12, border: "1px solid #bbf7d0" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#166534", marginBottom: 10 }}>🎉 Fully Approved!</div>
              <Btn icon="📄">Download PDF Certificate</Btn>
            </div>
          )}
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "var(--shadow)", height: "fit-content" }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Application Info</h4>
          {[
            ["Application ID", app.id],
            ["Form Type",      app.formName],
            ["Department",     app.dept],
            ["Submitted On",   app.submittedOn],
            ["Current Stage",  `Step ${app.currentStep + 1} of ${app.totalSteps}`],
          ].map(([k, v]) => (
            <div key={k} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#8898aa", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>{k}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

export default function MyApplications({ user }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]     = useState("all");

  const myApps  = APPLICATIONS.filter(a => a.rollNo === (user?.rollNo ?? "CS21B047"));
  const filtered = myApps.filter(a => filter === "all" || a.status === filter);

  if (selected) return <ApplicationDetail app={selected} onBack={() => setSelected(null)} />;

  return (
    <PageWrapper title="My Applications" subtitle="Track all your submitted form applications">
      <div style={{ marginBottom: 20 }}>
        <FilterTabs options={["all","pending","in-review","approved","rejected"]} value={filter} onChange={setFilter} />
      </div>

      <Table headers={["Application ID", "Form", "Submitted", "Progress", "Status", "Action"]}>
        {filtered.map(app => (
          <Tr key={app.id}>
            <Td mono accent>{app.id}</Td>
            <Td><span style={{ fontWeight: 600 }}>{app.formName}</span></Td>
            <Td><span style={{ color: "#8898aa", fontSize: 12 }}>{app.submittedOn}</span></Td>
            <Td>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 6, background: "#e8e4dc", borderRadius: 99 }}>
                  <div style={{ height: "100%", borderRadius: 99, background: app.status === "approved" ? "#16a34a" : app.status === "rejected" ? "#dc2626" : "#f59e0b", width: `${((app.currentStep + 1) / app.totalSteps) * 100}%` }} />
                </div>
                <span style={{ fontSize: 11, color: "#8898aa", whiteSpace: "nowrap" }}>{app.currentStep + 1}/{app.totalSteps}</span>
              </div>
            </Td>
            <Td><StatusBadge status={app.status} /></Td>
            <Td><Btn small variant="secondary" onClick={() => setSelected(app)}>View →</Btn></Td>
          </Tr>
        ))}
      </Table>
    </PageWrapper>
  );
}
