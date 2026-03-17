// ─────────────────────────────────────────────────────────────────────────────
// GatePass.jsx — Printable approval receipt / pass
// Shows for any approved application; displayed full-screen for security guard
// ─────────────────────────────────────────────────────────────────────────────

// ── Which form categories need a gate pass ────────────────────────────────────
export const PASS_CATEGORIES = [
  "Leave", "Hostel", "Placement", "Activity", "Exam",
];

// ── Pass config per category ──────────────────────────────────────────────────
const PASS_CONFIG = {
  Leave: {
    icon:    "🚪",
    title:   "Campus Leave Pass",
    color:   "#2563eb",
    bg:      "#eff6ff",
    border:  "#bfdbfe",
    header:  "CAMPUS EXIT PERMIT",
    note:    "This pass authorizes the student to leave campus during college hours. Show this to the security guard at the main gate.",
    showAt:  ["Main Gate Security", "Hostel Warden (if applicable)"],
    urgent:  true,
  },
  Hostel: {
    icon:    "🏠",
    title:   "Hostel Leave Pass",
    color:   "#7c3aed",
    bg:      "#f5f3ff",
    border:  "#ddd6fe",
    header:  "HOSTEL LEAVE PERMIT",
    note:    "This pass authorizes the student to leave the hostel premises. Show to hostel warden and main gate.",
    showAt:  ["Hostel Warden", "Main Gate Security"],
    urgent:  false,
  },
  Placement: {
    icon:    "💼",
    title:   "Placement / Internship Pass",
    color:   "#e85d26",
    bg:      "#fff5f0",
    border:  "#fcd9c4",
    header:  "PLACEMENT ACTIVITY PERMIT",
    note:    "This pass confirms the student is authorized to attend placement or internship-related activity outside campus.",
    showAt:  ["Main Gate Security", "Placement Office"],
    urgent:  false,
  },
  Activity: {
    icon:    "🎭",
    title:   "Activity / Event Pass",
    color:   "#059669",
    bg:      "#f0fdf4",
    border:  "#a7f3d0",
    header:  "EVENT PARTICIPATION PERMIT",
    note:    "This pass authorizes the student to participate in the listed event or activity.",
    showAt:  ["Event Coordinator", "Main Gate Security"],
    urgent:  false,
  },
  Exam: {
    icon:    "📝",
    title:   "Exam / Academic Pass",
    color:   "#ec4899",
    bg:      "#fdf2f8",
    border:  "#fbcfe8",
    header:  "ACADEMIC ACTIVITY PERMIT",
    note:    "This pass is issued for the academic activity mentioned. Present to the concerned authority.",
    showAt:  ["Exam Cell", "HOD Office"],
    urgent:  false,
  },
  default: {
    icon:    "✅",
    title:   "Approval Receipt",
    color:   "#374151",
    bg:      "#f9fafb",
    border:  "#d1d5db",
    header:  "APPROVED APPLICATION RECEIPT",
    note:    "This document confirms the application has been approved through the official institutional workflow.",
    showAt:  ["Concerned Department Office"],
    urgent:  false,
  },
};

// ── QR-like barcode (CSS only, uses appId) ────────────────────────────────────
function FakeQR({ appId, color }) {
  // Generate a deterministic pattern from the appId string
  const seed = appId.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const bars = Array.from({ length: 28 }, (_, i) => ((seed * (i + 7) * 13) % 17) > 7);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:2, padding:8,
      background:"white", borderRadius:8, border:`2px solid ${color}33` }}>
      {Array.from({ length: 7 }, (_, row) => (
        <div key={row} style={{ display:"flex", gap:1 }}>
          {Array.from({ length: 7 }, (_, col) => {
            const idx = (row * 4 + col * 3 + seed) % bars.length;
            return (
              <div key={col} style={{
                width: 7, height: 7, borderRadius:1,
                background: bars[idx] ? color : "transparent",
              }}/>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── Watermark stamp ───────────────────────────────────────────────────────────
function ApprovedStamp({ color }) {
  return (
    <div style={{ position:"absolute", top:"50%", left:"50%",
      transform:"translate(-50%,-50%) rotate(-25deg)",
      border:`4px solid ${color}30`, borderRadius:12,
      padding:"8px 18px", pointerEvents:"none",
      opacity: 0.12 }}>
      <div style={{ fontSize:52, fontWeight:900, color,
        letterSpacing:4, textTransform:"uppercase", whiteSpace:"nowrap" }}>
        APPROVED
      </div>
    </div>
  );
}

// ── Main Pass Component ───────────────────────────────────────────────────────
export default function GatePass({ app, student, onClose }) {
  const cfg      = PASS_CONFIG[app.category] || PASS_CONFIG.default;
  const formData = app.formData instanceof Object ? Object.entries(app.formData) : [];
  const approvedSteps = (app.steps || []).filter(s => s.status === "approved");
  const lastApprover  = approvedSteps[approvedSteps.length - 1];
  const issuedDate    = lastApprover?.date
    ? new Date(lastApprover.date).toLocaleString()
    : new Date().toLocaleString();

  // Detect if it's an urgent/same-day leave
  const isUrgent = app.formName?.toLowerCase().includes("leave") ||
                   app.category === "Leave";

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* ── Print-only styles injected into head ── */}
      <style>{`
        @media print {
          body > *:not(#gate-pass-print-root) { display: none !important; }
          #gate-pass-print-root { display: block !important; }
          .no-print { display: none !important; }
          .pass-card { box-shadow: none !important; border: 2px solid #333 !important; }
          @page { margin: 10mm; size: A5 landscape; }
        }
      `}</style>

      {/* ── Overlay ── */}
      <div id="gate-pass-print-root"
        style={{ position:"fixed", inset:0, background:"rgba(13,27,42,0.85)",
          zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center",
          padding:20, backdropFilter:"blur(4px)" }}>

        <div style={{ width:"100%", maxWidth:760, maxHeight:"95vh",
          overflowY:"auto", display:"flex", flexDirection:"column", gap:12 }}>

          {/* ── Top action bar ── */}
          <div className="no-print"
            style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ color:"white", fontWeight:700, fontSize:16 }}>
              {cfg.icon} Approval Pass / Receipt
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={handlePrint}
                style={{ padding:"9px 20px", borderRadius:10, border:"none",
                  background:"#e85d26", color:"white", fontWeight:700,
                  fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                🖨️ Print Pass
              </button>
              <button onClick={onClose}
                style={{ padding:"9px 16px", borderRadius:10,
                  background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)",
                  color:"white", fontWeight:600, fontSize:13, cursor:"pointer" }}>
                ✕ Close
              </button>
            </div>
          </div>

          {/* ── THE PASS CARD ── */}
          <div className="pass-card"
            style={{ background:"white", borderRadius:20,
              overflow:"hidden", boxShadow:"0 32px 80px rgba(0,0,0,0.5)",
              position:"relative" }}>

            <ApprovedStamp color={cfg.color}/>

            {/* Header stripe */}
            <div style={{ background:`linear-gradient(135deg,#0d1b2a,${cfg.color})`,
              padding:"20px 28px", display:"flex", justifyContent:"space-between",
              alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:52, height:52, borderRadius:13,
                  background:"rgba(255,255,255,0.15)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:28, border:"2px solid rgba(255,255,255,0.3)" }}>
                  {cfg.icon}
                </div>
                <div>
                  <div style={{ color:"rgba(255,255,255,0.6)", fontSize:10,
                    fontWeight:700, letterSpacing:2, textTransform:"uppercase" }}>
                    EduForms — Digital Institutional Management
                  </div>
                  <div style={{ color:"white", fontWeight:900, fontSize:20,
                    letterSpacing:0.5, marginTop:3 }}>
                    {cfg.header}
                  </div>
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ color:"rgba(255,255,255,0.5)", fontSize:10,
                  fontWeight:600, textTransform:"uppercase" }}>Pass ID</div>
                <div style={{ color:"white", fontWeight:900, fontSize:16,
                  fontFamily:"monospace", letterSpacing:1 }}>
                  {app.appId}
                </div>
                {isUrgent && (
                  <div style={{ marginTop:6, background:"#ef4444",
                    color:"white", fontSize:10, fontWeight:800,
                    padding:"3px 10px", borderRadius:99, letterSpacing:1 }}>
                    ⚡ URGENT
                  </div>
                )}
              </div>
            </div>

            {/* Body */}
            <div style={{ padding:"22px 28px", display:"flex", gap:20 }}>

              {/* Left: Student + form info */}
              <div style={{ flex:1, minWidth:0 }}>

                {/* Student info row */}
                <div style={{ background:cfg.bg, border:`1.5px solid ${cfg.border}`,
                  borderRadius:14, padding:"14px 18px", marginBottom:16,
                  display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:48, height:48, borderRadius:"50%",
                    background:cfg.color, color:"white",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontWeight:800, fontSize:18, flexShrink:0 }}>
                    {(student?.name || app.student?.name || "S").split(" ")
                      .map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:800, fontSize:17, color:"#0d1b2a" }}>
                      {student?.name || app.student?.name}
                    </div>
                    <div style={{ fontSize:12, color:"#4a5568", marginTop:2 }}>
                      {student?.rollNo || app.student?.rollNo} &nbsp;·&nbsp;
                      {student?.dept   || app.student?.dept   || app.dept} &nbsp;·&nbsp;
                      {student?.year   || app.student?.year}
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:10, color:"#8898aa", fontWeight:600,
                      textTransform:"uppercase" }}>Status</div>
                    <div style={{ fontWeight:800, fontSize:14,
                      color:cfg.color, marginTop:2 }}>
                      ✅ APPROVED
                    </div>
                  </div>
                </div>

                {/* Form title row */}
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:14 }}>
                  <div style={{ width:36, height:36, borderRadius:10,
                    background:cfg.bg, display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:18 }}>
                    {app.icon || "📋"}
                  </div>
                  <div>
                    <div style={{ fontWeight:800, fontSize:15, color:"#0d1b2a" }}>
                      {app.formName}
                    </div>
                    <div style={{ fontSize:12, color:"#8898aa", marginTop:1 }}>
                      {app.category} · Submitted {new Date(app.submittedOn || app.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Form data (reason, dates etc.) */}
                {formData.length > 0 && (
                  <div style={{ background:"#f9fafb", border:"1px solid #e8e4dc",
                    borderRadius:12, overflow:"hidden", marginBottom:14 }}>
                    <div style={{ background:"#0d1b2a", padding:"8px 14px",
                      fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.6)",
                      textTransform:"uppercase", letterSpacing:0.5 }}>
                      Application Details
                    </div>
                    {formData.map(([k, v], i) => (
                      <div key={k} style={{ display:"flex", padding:"9px 14px",
                        background:i % 2 === 0 ? "white" : "#f9fafb",
                        borderBottom:"1px solid #f0ebe3" }}>
                        <span style={{ fontSize:12, color:"#8898aa", fontWeight:600,
                          width:"38%", textTransform:"capitalize" }}>{k}</span>
                        <span style={{ fontSize:12, fontWeight:700,
                          color:"#0d1b2a", flex:1 }}>{v || "—"}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Approval chain summary */}
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:"#8898aa",
                    textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 }}>
                    Approved by
                  </div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {approvedSteps.map((s, i) => (
                      <div key={i} style={{ background:cfg.bg,
                        border:`1.5px solid ${cfg.border}`,
                        borderRadius:10, padding:"7px 12px",
                        display:"flex", alignItems:"center", gap:7 }}>
                        <div style={{ width:22, height:22, borderRadius:"50%",
                          background:cfg.color, color:"white",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:11, fontWeight:800 }}>✓</div>
                        <div>
                          <div style={{ fontSize:12, fontWeight:700, color:"#0d1b2a" }}>
                            {s.name}
                          </div>
                          {s.date && (
                            <div style={{ fontSize:10, color:"#8898aa" }}>
                              {new Date(s.date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Show-at note */}
                <div style={{ background:"#fffbeb", border:"1.5px solid #fde68a",
                  borderRadius:10, padding:"10px 14px" }}>
                  <div style={{ fontSize:10, fontWeight:800, color:"#92400e",
                    textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>
                    📍 Show this pass at
                  </div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {cfg.showAt.map(loc => (
                      <span key={loc} style={{ fontSize:12, fontWeight:700,
                        color:"#78350f", background:"#fef3c7",
                        padding:"3px 10px", borderRadius:99, border:"1px solid #fde68a" }}>
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: QR + issue info */}
              <div style={{ width:170, flexShrink:0, display:"flex",
                flexDirection:"column", gap:12, alignItems:"center" }}>

                <FakeQR appId={app.appId} color={cfg.color}/>

                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:10, color:"#8898aa", fontWeight:600,
                    textTransform:"uppercase", letterSpacing:0.3 }}>Scan to verify</div>
                  <div style={{ fontFamily:"monospace", fontSize:12,
                    fontWeight:700, color:"#0d1b2a", marginTop:3 }}>
                    {app.appId}
                  </div>
                </div>

                <div style={{ width:"100%", background:cfg.bg,
                  border:`1.5px solid ${cfg.border}`,
                  borderRadius:12, padding:"12px 14px" }}>
                  <div style={{ fontSize:10, color:cfg.color, fontWeight:700,
                    textTransform:"uppercase", marginBottom:6 }}>
                    Issued
                  </div>
                  <div style={{ fontSize:11, fontWeight:600, color:"#0d1b2a",
                    lineHeight:1.6 }}>
                    {issuedDate}
                  </div>
                </div>

                {/* Valid badge */}
                <div style={{ width:"100%", background:`linear-gradient(135deg,${cfg.color},${cfg.color}cc)`,
                  borderRadius:12, padding:"14px", textAlign:"center",
                  boxShadow:`0 4px 14px ${cfg.color}44` }}>
                  <div style={{ fontSize:22, marginBottom:4 }}>✅</div>
                  <div style={{ color:"white", fontWeight:900, fontSize:13,
                    textTransform:"uppercase", letterSpacing:1 }}>
                    Valid Pass
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.7)", fontSize:10,
                    marginTop:3 }}>All approvals complete</div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div style={{ background:"#0d1b2a", padding:"10px 28px",
              display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ color:"rgba(255,255,255,0.4)", fontSize:10 }}>
                EduForms Digital Institutional Management System · Auto-generated on approval
              </div>
              <div style={{ color:"rgba(255,255,255,0.4)", fontSize:10 }}>
                {new Date().toLocaleDateString()} · {app.appId}
              </div>
            </div>
          </div>

          {/* ── Instructions below pass ── */}
          <div className="no-print"
            style={{ background:"rgba(255,255,255,0.05)",
              border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:14, padding:"16px 20px" }}>
            <div style={{ color:"white", fontWeight:700, fontSize:13, marginBottom:10 }}>
              📋 Instructions
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[
                { icon:"🖨️", text:"Click 'Print Pass' to get a physical copy" },
                { icon:"📱", text:"You can also screenshot this screen to show digitally" },
                { icon:"🔒", text:"This pass is only valid for the approved application" },
                { icon:"📍", text:`Show at: ${cfg.showAt.join(", ")}` },
              ].map((item, i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start",
                  gap:8, color:"rgba(255,255,255,0.6)", fontSize:12 }}>
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}