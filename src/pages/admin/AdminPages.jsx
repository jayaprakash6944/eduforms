import { useState } from "react";
import { APPLICATIONS, ANALYTICS, FORM_TEMPLATES, USERS, ROLE_COLORS, ROLE_LABELS } from "../../data/mockData";
import { PageWrapper, StatCard, StatusBadge, Btn, Table, Tr, Td, FilterTabs, Avatar, EmptyState } from "../../components/UI";

// ── Approval History ──────────────────────────────────────────────────────────
export function HistoryPage() {
  const rows = [
    { id: "APP-2024-001", form: "Bonafide Certificate", student: "Arjun Sharma (CS21B047)", action: "approved", date: "2024-01-16", comment: "Verified and approved" },
    { id: "APP-2024-003", form: "Internship NOC",       student: "Arjun Sharma (CS21B047)", action: "approved", date: "2024-01-11", comment: "OK" },
    { id: "APP-2023-098", form: "Leave Application",    student: "Priya Krishnan (CS21B019)", action: "approved", date: "2024-01-08", comment: "Medical leave verified" },
    { id: "APP-2023-087", form: "Course Registration",  student: "Rahul Verma (CS21B041)",   action: "rejected", date: "2024-01-05", comment: "Insufficient credits" },
  ];
  return (
    <PageWrapper title="Approval History" subtitle="All past actions taken by you">
      <Table headers={["App ID", "Form", "Student", "Action", "Date", "Comment"]}>
        {rows.map(r => (
          <Tr key={r.id}>
            <Td mono accent>{r.id}</Td>
            <Td><span style={{ fontWeight: 600 }}>{r.form}</span></Td>
            <Td><span style={{ color: "#4a5568" }}>{r.student}</span></Td>
            <Td><StatusBadge status={r.action} /></Td>
            <Td><span style={{ color: "#8898aa", fontSize: 12 }}>{r.date}</span></Td>
            <Td><span style={{ color: "#4a5568" }}>{r.comment}</span></Td>
          </Tr>
        ))}
      </Table>
    </PageWrapper>
  );
}

// ── Reports / Analytics ───────────────────────────────────────────────────────
export function ReportsPage() {
  const maxBar = Math.max(...ANALYTICS.monthly.map(m => m.forms));
  return (
    <PageWrapper title="Reports & Analytics" subtitle="Institutional form submission insights">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="📋" label="Total Forms"           value={ANALYTICS.totalForms.toLocaleString()} color="#e85d26" />
        <StatCard icon="✅" label="Approved (Month)"      value={ANALYTICS.approvedThisMonth}            color="#059669" />
        <StatCard icon="⏳" label="Pending Approvals"     value={ANALYTICS.pendingApprovals}             color="#f59e0b" />
        <StatCard icon="⚡" label="Avg. Processing (days)"value={ANALYTICS.avgProcessingDays}            color="#2563eb" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Bar chart */}
        <div style={{ background: "white", borderRadius: 18, padding: 28, boxShadow: "var(--shadow)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 24 }}>Monthly Submissions</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 180 }}>
            {ANALYTICS.monthly.map(m => (
              <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 11, color: "#8898aa", fontWeight: 600 }}>{m.forms}</div>
                <div style={{ width: "100%", background: "linear-gradient(to top,#e85d26,#f07a47)", borderRadius: "6px 6px 0 0", height: `${(m.forms / maxBar) * 140}px`, transition: "height 0.5s" }} />
                <div style={{ fontSize: 11, color: "#8898aa" }}>{m.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div style={{ background: "white", borderRadius: 18, padding: 24, boxShadow: "var(--shadow)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>By Category</h3>
          {ANALYTICS.byCategory.map(c => {
            const pct = Math.round((c.count / ANALYTICS.totalForms) * 100);
            return (
              <div key={c.name} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</span>
                  <span style={{ fontSize: 12, color: "#8898aa" }}>{c.count} ({pct}%)</span>
                </div>
                <div style={{ height: 8, background: "#f5f2ed", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: c.color, borderRadius: 99 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insight cards */}
      <div style={{ background: "white", borderRadius: 18, padding: 24, boxShadow: "var(--shadow)" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Key Insights</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {[
            { label: "Peak Submission Day",  value: "Monday",            icon: "📅" },
            { label: "Most Common Form",     value: "Leave Application",  icon: "🏆" },
            { label: "Slowest Approval",     value: "Scholarship (8.2d)", icon: "⏰" },
            { label: "Fastest Approval",     value: "Medical Leave (0.5d)",icon: "⚡" },
            { label: "Rejection Rate",       value: "6.3%",              icon: "📉" },
            { label: "Digital Adoption",     value: "94.7%",             icon: "📈" },
          ].map(item => (
            <div key={item.label} style={{ background: "#f5f2ed", borderRadius: 12, padding: "16px 20px", display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 24 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 11, color: "#8898aa", fontWeight: 600, textTransform: "uppercase" }}>{item.label}</div>
                <div style={{ fontSize: 16, fontWeight: 800, marginTop: 2 }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

// ── All Applications (Admin / Director) ───────────────────────────────────────
export function AllApplicationsPage() {
  const [filter, setFilter] = useState("all");
  const filtered = APPLICATIONS.filter(a => filter === "all" || a.status === filter);

  return (
    <PageWrapper title="All Applications" subtitle="Complete institutional applications record">
      <div style={{ marginBottom: 20 }}>
        <FilterTabs options={["all","pending","in-review","approved","rejected"]} value={filter} onChange={setFilter} />
      </div>
      <Table headers={["ID", "Form", "Student", "Department", "Submitted", "Status"]}>
        {filtered.map(app => (
          <Tr key={app.id}>
            <Td mono accent>{app.id}</Td>
            <Td><span style={{ fontWeight: 600 }}>{app.formName}</span></Td>
            <Td>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar initials={app.studentName.split(" ").map(w => w[0]).join("")} size={28} bg="#e85d26" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{app.studentName}</div>
                  <div style={{ fontSize: 11, color: "#8898aa" }}>{app.rollNo}</div>
                </div>
              </div>
            </Td>
            <Td><span style={{ color: "#4a5568" }}>{app.dept}</span></Td>
            <Td><span style={{ color: "#8898aa", fontSize: 12 }}>{app.submittedOn}</span></Td>
            <Td><StatusBadge status={app.status} /></Td>
          </Tr>
        ))}
      </Table>
    </PageWrapper>
  );
}

// ── Manage Forms (Admin) ──────────────────────────────────────────────────────
export function ManageFormsPage() {
  const [forms, setForms]     = useState(FORM_TEMPLATES);
  const [showAdd, setShowAdd] = useState(false);
  const [nf, setNf]           = useState({ name: "", category: "", description: "", time: "" });

  const addForm = () => {
    if (!nf.name) return;
    setForms(prev => [...prev, { ...nf, id: prev.length + 1, icon: "📄", color: "#2563eb", popular: false, fields: ["Details"], signatories: ["HOD"] }]);
    setShowAdd(false);
    setNf({ name: "", category: "", description: "", time: "" });
  };

  return (
    <PageWrapper title="Manage Forms" subtitle="Create, edit and manage form templates" actions={<Btn icon="+" onClick={() => setShowAdd(true)}>Add New Form</Btn>}>
      {showAdd && (
        <div style={{ background: "white", borderRadius: 18, padding: 24, boxShadow: "var(--shadow)", marginBottom: 20, border: "2px solid #e85d26" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>New Form Template</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[["Form Name","name","e.g. Transfer Certificate"], ["Category","category","Certificate, Leave…"], ["Description","description","Brief description"], ["Processing Time","time","e.g. 3–5 days"]].map(([label, key, ph]) => (
              <div key={key}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 6, textTransform: "uppercase" }}>{label}</label>
                <input placeholder={ph} value={nf[key]} onChange={e => setNf({ ...nf, [key]: e.target.value })} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <Btn onClick={addForm}>Save Form</Btn>
            <Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
          </div>
        </div>
      )}

      <Table headers={["Form", "Category", "Signatories", "Processing Time", "Status", "Actions"]}>
        {forms.map(f => (
          <Tr key={f.id}>
            <Td>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{f.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: "#8898aa" }}>{f.description?.slice(0, 40)}…</div>
                </div>
              </div>
            </Td>
            <Td><span style={{ background: f.color + "15", color: f.color, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 99 }}>{f.category}</span></Td>
            <Td><span style={{ fontSize: 12, color: "#4a5568" }}>{(f.signatories || ["Admin"]).join(" → ")}</span></Td>
            <Td><span style={{ color: "#4a5568" }}>{f.time}</span></Td>
            <Td><StatusBadge status="approved" /></Td>
            <Td>
              <div style={{ display: "flex", gap: 6 }}>
                <Btn small variant="secondary">Edit</Btn>
                <Btn small variant="danger" onClick={() => setForms(prev => prev.filter(x => x.id !== f.id))}>Delete</Btn>
              </div>
            </Td>
          </Tr>
        ))}
      </Table>
    </PageWrapper>
  );
}

// ── Manage Users (Admin) ──────────────────────────────────────────────────────
export function ManageUsersPage() {
  return (
    <PageWrapper title="Manage Users" subtitle="View and manage all institutional users">
      <Table headers={["User", "Email", "Role", "Department", "Status", "Actions"]}>
        {USERS.map(u => (
          <Tr key={u.id}>
            <Td>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar initials={u.avatar} size={32} bg={ROLE_COLORS[u.role]} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</span>
              </div>
            </Td>
            <Td><span style={{ color: "#4a5568" }}>{u.email}</span></Td>
            <Td><span style={{ background: ROLE_COLORS[u.role] + "15", color: ROLE_COLORS[u.role], fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 99 }}>{ROLE_LABELS[u.role]}</span></Td>
            <Td><span style={{ color: "#4a5568" }}>{u.dept || "—"}</span></Td>
            <Td><StatusBadge status="approved" /></Td>
            <Td>
              <div style={{ display: "flex", gap: 6 }}>
                <Btn small variant="secondary">Edit</Btn>
                <Btn small variant="danger">Deactivate</Btn>
              </div>
            </Td>
          </Tr>
        ))}
      </Table>
    </PageWrapper>
  );
}

// ── Placement Tracker ─────────────────────────────────────────────────────────
export function PlacementTrackerPage() {
  const drives = [
    { company: "TCS",     date: "Jan 28, 2024", type: "Mass Hiring",    students: 45, open: false },
    { company: "Infosys", date: "Feb 5, 2024",  type: "Pool Campus",   students: 62, open: false },
    { company: "Google",  date: "Feb 12, 2024", type: "Dream Company", students: 8,  open: true  },
    { company: "Wipro",   date: "Feb 20, 2024", type: "Mass Hiring",   students: 38, open: false },
  ];
  return (
    <PageWrapper title="Student Placement Tracker" subtitle="Track student placement activities and registrations">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="👥" label="Registered Students" value="342" color="#e85d26" />
        <StatCard icon="🏢" label="Companies Visiting"  value="28"  color="#2563eb" />
        <StatCard icon="✅" label="Placed Students"     value="187" color="#059669" />
        <StatCard icon="📝" label="NOCs Issued"         value="94"  color="#7c3aed" />
      </div>
      <div style={{ background: "white", borderRadius: 18, padding: 24, boxShadow: "var(--shadow)" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Upcoming Placement Drives</h3>
        {drives.map(d => (
          <div key={d.company} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: "1px solid #f5f2ed" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#e85d2615", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏢</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{d.company}</div>
              <div style={{ fontSize: 12, color: "#8898aa" }}>{d.date} · {d.type}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#e85d26" }}>{d.students}</div>
              <div style={{ fontSize: 11, color: "#8898aa" }}>Students</div>
            </div>
            <span style={{ background: d.open ? "#dcfce7" : "#dbeafe", color: d.open ? "#166534" : "#1e40af", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 99 }}>
              {d.open ? "Registration Open" : "Upcoming"}
            </span>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
