import { useState } from "react";
import { FORM_TEMPLATES } from "../../data/mockData";
import { PageWrapper, Btn } from "../../components/UI";

const CATEGORIES = ["All", "Certificate", "Leave", "Placement", "Fee", "Hostel", "Exam"];

// ── Form Wizard ────────────────────────────────────────────────────────────────
function FormWizard({ form, onBack }) {
  const [step, setStep]       = useState(1);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [appId]     = useState(`APP-2024-${Math.floor(Math.random() * 900 + 100)}`);

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1400));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <PageWrapper title="Submitted!" subtitle="Your application is in the queue">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "70px 20px", background: "white", borderRadius: 20, boxShadow: "var(--shadow)" }}>
          <div style={{ fontSize: 68, marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Application Submitted!</h2>
          <p style={{ color: "#8898aa", marginBottom: 6 }}>{form.name}</p>
          <p style={{ color: "#e85d26", fontWeight: 700, fontSize: 20, marginBottom: 24 }}>{appId}</p>
          <p style={{ color: "#4a5568", textAlign: "center", maxWidth: 400, marginBottom: 32, lineHeight: 1.6 }}>
            You'll receive notifications as your application moves through the approval workflow.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Btn onClick={onBack}>Browse More Forms</Btn>
            <Btn variant="secondary" onClick={onBack}>Back to Browse</Btn>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const steps = ["Form Details", "Review", "Submit"];

  return (
    <PageWrapper title={form.name} subtitle={form.description} actions={<Btn variant="secondary" onClick={onBack}>← Back</Btn>}>
      {/* Progress Bar */}
      <div style={{ background: "white", borderRadius: 16, padding: "16px 24px", marginBottom: 24, boxShadow: "var(--shadow)", display: "flex", alignItems: "center" }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: step > i + 1 ? "#059669" : step === i + 1 ? "#e85d26" : "#e8e4dc", color: step >= i + 1 ? "white" : "#8898aa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 13, fontWeight: step === i + 1 ? 600 : 400, color: step === i + 1 ? "#e85d26" : "#8898aa" }}>{s}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? "#059669" : "#e8e4dc", margin: "0 12px" }} />}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div style={{ background: "white", borderRadius: 18, padding: 28, boxShadow: "var(--shadow)" }}>
          {/* Step 1 */}
          {step === 1 && (
            <div className="slide-in">
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Fill Application Details</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {form.fields.map(field => (
                  <div key={field}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.3 }}>{field} *</label>
                    <input placeholder={`Enter ${field.toLowerCase()}`} value={formData[field] || ""} onChange={e => setFormData({ ...formData, [field]: e.target.value })} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.3 }}>Additional Remarks</label>
                  <textarea placeholder="Any additional information…" style={{ minHeight: 80, resize: "vertical" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#4a5568", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.3 }}>Supporting Documents</label>
                  <div style={{ border: "2px dashed #e8e4dc", borderRadius: 12, padding: 24, textAlign: "center", cursor: "pointer", transition: "border-color 0.2s" }}
                    onMouseOver={e => e.currentTarget.style.borderColor = "#e85d26"}
                    onMouseOut={e  => e.currentTarget.style.borderColor = "#e8e4dc"}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>📎</div>
                    <div style={{ fontSize: 13, color: "#8898aa" }}>Drag & drop or <span style={{ color: "#e85d26", fontWeight: 600 }}>click to browse</span></div>
                    <div style={{ fontSize: 11, color: "#c0bdb5", marginTop: 4 }}>PDF, JPG, PNG up to 10MB</div>
                  </div>
                </div>
                <Btn onClick={() => setStep(2)}>Continue to Review →</Btn>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="slide-in">
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Review Your Application</h3>
              <div style={{ background: "#f5f2ed", borderRadius: 12, padding: 20, marginBottom: 20 }}>
                {form.fields.map(field => (
                  <div key={field} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #e8e4dc" }}>
                    <span style={{ fontSize: 13, color: "#8898aa", fontWeight: 500 }}>{field}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{formData[field] || "—"}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "#8898aa", marginBottom: 20 }}>By submitting, you confirm all information is accurate.</p>
              <div style={{ display: "flex", gap: 12 }}>
                <Btn variant="secondary" onClick={() => setStep(1)}>← Edit</Btn>
                <Btn onClick={() => setStep(3)}>Confirm & Proceed →</Btn>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="slide-in">
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Ready to Submit</h3>
              <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 12, padding: 20, marginBottom: 24 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>✅</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#166534" }}>All checks passed</div>
                    <div style={{ fontSize: 12, color: "#4ade80", marginTop: 2 }}>Your form is complete and ready</div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <Btn variant="secondary" onClick={() => setStep(2)}>← Back</Btn>
                <button onClick={handleSubmit} disabled={submitting}
                  style={{ background: submitting ? "#ccc" : "linear-gradient(135deg, #059669, #047857)", color: "white", padding: "10px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14, border: "none", cursor: submitting ? "not-allowed" : "pointer" }}>
                  {submitting ? "Submitting…" : "🚀 Submit Application"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "var(--shadow)" }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Approval Workflow</h4>
            {form.signatories.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#e85d2615", color: "#e85d26", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{i + 1}</div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{s}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "#fef3c7", borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 18, marginBottom: 8 }}>⏱️</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>Estimated Processing</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#78350f", marginTop: 4 }}>{form.time}</div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

// ── Main Browse Page ───────────────────────────────────────────────────────────
export default function BrowseForms() {
  const [search, setSearch]         = useState("");
  const [category, setCategory]     = useState("All");
  const [selectedForm, setSelectedForm] = useState(null);

  const filtered = FORM_TEMPLATES.filter(f =>
    (category === "All" || f.category === category) &&
    (f.name.toLowerCase().includes(search.toLowerCase()) ||
     f.description.toLowerCase().includes(search.toLowerCase()))
  );

  if (selectedForm) return <FormWizard form={selectedForm} onBack={() => setSelectedForm(null)} />;

  return (
    <PageWrapper title="Browse Forms" subtitle="Search and apply for any institutional form">
      {/* Search Bar */}
      <div style={{ background: "white", borderRadius: 16, padding: "14px 20px", boxShadow: "var(--shadow)", marginBottom: 20, display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ fontSize: 18 }}>🔍</span>
        <input placeholder="Search forms by name or describe your need…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ border: "none", background: "transparent", fontSize: 15, flex: 1, outline: "none" }} />
      </div>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            style={{ padding: "7px 16px", borderRadius: 99, fontSize: 13, fontWeight: 600, border: "1.5px solid", cursor: "pointer", transition: "all 0.15s", borderColor: category === c ? "#e85d26" : "#e8e4dc", background: category === c ? "#e85d26" : "white", color: category === c ? "white" : "#4a5568" }}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {filtered.map(f => (
          <div key={f.id} className="slide-in"
            style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(13,27,42,0.07)", border: "1px solid #f0ebe3", cursor: "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden" }}
            onClick={() => setSelectedForm(f)}
            onMouseOver={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${f.color}25`; e.currentTarget.style.borderColor = f.color + "50"; }}
            onMouseOut={e  => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(13,27,42,0.07)"; e.currentTarget.style.borderColor = "#f0ebe3"; }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, borderRadius: "0 0 0 80px", background: f.color + "08" }} />
            {f.popular && <span style={{ position: "absolute", top: 12, right: 12, background: "#fef3c7", color: "#92400e", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99 }}>Popular</span>}
            <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{f.name}</h3>
            <p style={{ fontSize: 12, color: "#8898aa", marginBottom: 12, lineHeight: 1.5 }}>{f.description}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ background: f.color + "15", color: f.color, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 99 }}>{f.category}</span>
              <span style={{ fontSize: 11, color: "#8898aa" }}>⏱ {f.time}</span>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
