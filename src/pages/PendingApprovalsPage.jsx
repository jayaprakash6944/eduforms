import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getApplicationsAPI, actionApplicationAPI } from "../utils/api";

const BASE_URL = "http://localhost:5000";

// ── Helpers ───────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = { approved:"#059669", pending:"#f59e0b", "in-review":"#2563eb", rejected:"#dc2626" };
  const c = map[status] || "#f59e0b";
  return (
    <span style={{ background:c+"20", color:c, fontSize:11, fontWeight:700,
      padding:"3px 10px", borderRadius:99, textTransform:"capitalize" }}>
      {status === "in-review" ? "In Review" : status}
    </span>
  );
};

const ROLE_COLORS = {
  mentor:"#2563eb", hod:"#7c3aed", college_admin:"#374151",
  placement_director:"#f59e0b", college_director:"#dc2626",
};

// ── Document Viewer Modal ─────────────────────────────────────────────────────
function DocViewer({ file, onClose }) {
  const url = `${BASE_URL}/uploads/${file.filename}`;
  const isPDF = file.mimetype === "application/pdf" ||
                file.originalName?.toLowerCase().endsWith(".pdf");

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)",
      zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center",
      padding:20 }} onClick={onClose}>
      <div style={{ background:"white", borderRadius:18, overflow:"hidden",
        width:"90%", maxWidth:900, maxHeight:"90vh",
        display:"flex", flexDirection:"column",
        boxShadow:"0 32px 80px rgba(0,0,0,0.4)" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"16px 22px", borderBottom:"1px solid #f0ebe3",
          background:"#0d1b2a" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:20 }}>{isPDF ? "📄" : "🖼️"}</span>
            <div>
              <div style={{ color:"white", fontWeight:700, fontSize:14 }}>
                {file.originalName || file.filename}
              </div>
              <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>
                {isPDF ? "PDF Document" : "Image"} · Click outside to close
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <a href={url} target="_blank" rel="noreferrer"
              style={{ padding:"7px 14px", borderRadius:9,
                background:"rgba(255,255,255,0.1)", color:"white",
                fontSize:12, fontWeight:600, textDecoration:"none" }}>
              ↗ Open in Tab
            </a>
            <a href={url} download={file.originalName || file.filename}
              style={{ padding:"7px 14px", borderRadius:9,
                background:"#e85d26", color:"white",
                fontSize:12, fontWeight:600, textDecoration:"none" }}>
              ⬇ Download
            </a>
            <button onClick={onClose}
              style={{ padding:"7px 14px", borderRadius:9,
                background:"rgba(255,255,255,0.1)", color:"white",
                border:"none", cursor:"pointer", fontSize:12, fontWeight:600 }}>
              ✕ Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflow:"auto", background:"#f5f5f5", minHeight:500 }}>
          {isPDF ? (
            <iframe src={url} style={{ width:"100%", height:"75vh", border:"none" }}
              title={file.originalName}/>
          ) : (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
              padding:20, minHeight:500 }}>
              <img src={url} alt={file.originalName}
                style={{ maxWidth:"100%", maxHeight:"70vh",
                  borderRadius:10, boxShadow:"0 8px 32px rgba(0,0,0,0.15)" }}/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Supporting Documents Panel ────────────────────────────────────────────────
function DocumentsPanel({ attachments }) {
  const [viewing, setViewing] = useState(null);

  if (!attachments || attachments.length === 0) {
    return (
      <div style={{ background:"#f9fafb", border:"2px dashed #e2e8f0",
        borderRadius:14, padding:"24px 20px", textAlign:"center" }}>
        <div style={{ fontSize:32, marginBottom:8 }}>📎</div>
        <div style={{ fontSize:13, fontWeight:600, color:"#4a5568", marginBottom:4 }}>
          No Supporting Documents
        </div>
        <div style={{ fontSize:12, color:"#aaa" }}>
          Student did not attach any documents to this application.
        </div>
      </div>
    );
  }

  const getIcon  = (f) => {
    if (f.mimetype === "application/pdf" || f.originalName?.endsWith(".pdf")) return "📄";
    if (f.mimetype?.startsWith("image/")) return "🖼️";
    return "📎";
  };
  const getColor = (f) => {
    if (f.mimetype === "application/pdf") return { color:"#dc2626", bg:"#fef2f2", label:"PDF" };
    if (f.mimetype?.startsWith("image/")) return { color:"#2563eb", bg:"#eff6ff", label:"Image" };
    return { color:"#374151", bg:"#f9fafb", label:"File" };
  };

  return (
    <>
      {viewing && <DocViewer file={viewing} onClose={() => setViewing(null)}/>}

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {attachments.map((file, i) => {
          const { color, bg, label } = getColor(file);
          const url = `${BASE_URL}/uploads/${file.filename}`;
          return (
            <div key={i} style={{ background:"white", border:"1.5px solid #e8e4dc",
              borderRadius:12, padding:"14px 16px",
              display:"flex", alignItems:"center", gap:12,
              transition:"all 0.15s" }}
              onMouseOver={e => { e.currentTarget.style.borderColor=color; e.currentTarget.style.boxShadow=`0 4px 14px ${color}22`; }}
              onMouseOut={e  => { e.currentTarget.style.borderColor="#e8e4dc"; e.currentTarget.style.boxShadow="none"; }}>

              {/* File type icon */}
              <div style={{ width:42, height:42, borderRadius:10, background:bg,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:22, flexShrink:0 }}>
                {getIcon(file)}
              </div>

              {/* File info */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#0d1b2a",
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {file.originalName || file.filename}
                </div>
                <span style={{ fontSize:10, fontWeight:700, color,
                  background:bg, padding:"2px 7px", borderRadius:99,
                  display:"inline-block", marginTop:3 }}>{label}</span>
              </div>

              {/* Actions */}
              <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                <button onClick={() => setViewing(file)}
                  style={{ padding:"7px 14px", borderRadius:9,
                    background:bg, color, border:`1.5px solid ${color}44`,
                    fontSize:12, fontWeight:700, cursor:"pointer",
                    transition:"all 0.15s" }}
                  onMouseOver={e => { e.currentTarget.style.background=color; e.currentTarget.style.color="white"; }}
                  onMouseOut={e  => { e.currentTarget.style.background=bg; e.currentTarget.style.color=color; }}>
                  👁 View
                </button>
                <a href={url} download={file.originalName || file.filename}
                  style={{ padding:"7px 14px", borderRadius:9,
                    background:"#f5f2ed", color:"#4a5568",
                    border:"1.5px solid #e8e4dc", fontSize:12,
                    fontWeight:700, textDecoration:"none",
                    transition:"all 0.15s" }}
                  onMouseOver={e => { e.currentTarget.style.background="#0d1b2a"; e.currentTarget.style.color="white"; }}
                  onMouseOut={e  => { e.currentTarget.style.background="#f5f2ed"; e.currentTarget.style.color="#4a5568"; }}>
                  ⬇ Save
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── Review Detail ─────────────────────────────────────────────────────────────
function ReviewDetail({ app, onBack, onDone, approverRole }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const roleColor = ROLE_COLORS[approverRole] || "#e85d26";
  const myStep    = app.steps?.find(s => s.role === approverRole && s.status === "pending");
  const formData  = app.formData instanceof Object ? Object.entries(app.formData) : [];
  const hasAttachments = app.attachments && app.attachments.length > 0;

  const handle = async (action) => {
    if (action === "reject" && !comment.trim()) {
      setError("Please add a rejection reason before rejecting.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await actionApplicationAPI(app._id, action, comment);
      onDone(action);
    } catch (err) {
      setError(err.message || "Action failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding:"28px 32px" }}>

      {/* Top bar */}
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"center", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, margin:0 }}>Review Application</h1>
          <p style={{ color:"#8898aa", fontSize:13, marginTop:4 }}>
            {app.appId} · {app.formName}
          </p>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <StatusBadge status={app.status}/>
          <button onClick={onBack}
            style={{ padding:"8px 16px", borderRadius:10, border:"1.5px solid #e8e4dc",
              background:"white", fontSize:13, fontWeight:600, cursor:"pointer" }}>
            ← Back to List
          </button>
        </div>
      </div>

      {/* Doc verification alert */}
      {hasAttachments && (
        <div style={{ background:"linear-gradient(135deg,#fffbeb,#fef3c7)",
          border:"1.5px solid #f59e0b", borderRadius:14,
          padding:"14px 20px", marginBottom:20,
          display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:24 }}>⚠️</span>
          <div>
            <div style={{ fontWeight:800, fontSize:14, color:"#92400e" }}>
              Document Verification Required
            </div>
            <div style={{ fontSize:12, color:"#b45309", marginTop:2 }}>
              This application has {app.attachments.length} supporting document{app.attachments.length > 1 ? "s" : ""}.
              Please review all documents carefully before approving or rejecting.
            </div>
          </div>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* ── Supporting Documents ── */}
          <div style={{ background:"white", borderRadius:16, padding:24,
            boxShadow:"0 2px 12px rgba(0,0,0,0.06)",
            border: hasAttachments ? `2px solid ${roleColor}33` : "2px solid #f0ebe3" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ width:34, height:34, borderRadius:9,
                background:roleColor+"15", display:"flex",
                alignItems:"center", justifyContent:"center", fontSize:18 }}>
                📎
              </div>
              <div>
                <h3 style={{ fontSize:15, fontWeight:800, margin:0 }}>
                  Supporting Documents
                </h3>
                <div style={{ fontSize:12, color:"#8898aa", marginTop:2 }}>
                  {hasAttachments
                    ? `${app.attachments.length} file${app.attachments.length > 1 ? "s" : ""} attached — click to view or download`
                    : "No documents submitted"}
                </div>
              </div>
              {hasAttachments && (
                <span style={{ marginLeft:"auto", background:roleColor+"15",
                  color:roleColor, fontSize:11, fontWeight:700,
                  padding:"3px 10px", borderRadius:99 }}>
                  {app.attachments.length} file{app.attachments.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <DocumentsPanel attachments={app.attachments}/>
          </div>

          {/* ── Form Details ── */}
          <div style={{ background:"white", borderRadius:16, padding:24,
            boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ width:34, height:34, borderRadius:9,
                background:"#f5f2ed", display:"flex",
                alignItems:"center", justifyContent:"center", fontSize:18 }}>
                📋
              </div>
              <h3 style={{ fontSize:15, fontWeight:800, margin:0 }}>Form Details</h3>
            </div>

            {formData.length > 0 ? (
              <div style={{ background:"#f9fafb", borderRadius:12,
                overflow:"hidden", border:"1px solid #e8e4dc" }}>
                {formData.map(([k, v], i) => (
                  <div key={k} style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"flex-start", padding:"12px 16px",
                    background:i % 2 === 0 ? "white" : "#f9fafb",
                    borderBottom:"1px solid #f0ebe3" }}>
                    <span style={{ fontSize:12, color:"#8898aa",
                      fontWeight:600, textTransform:"uppercase",
                      letterSpacing:0.3, flexShrink:0, width:"40%" }}>{k}</span>
                    <span style={{ fontSize:13, fontWeight:600,
                      color:"#0d1b2a", textAlign:"right",
                      maxWidth:"58%", wordBreak:"break-word" }}>{v || "—"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign:"center", padding:"20px 0",
                color:"#8898aa", fontSize:13 }}>No form data available</div>
            )}

            {app.remarks && (
              <div style={{ background:"#fffbeb", border:"1px solid #fde68a",
                borderRadius:10, padding:"12px 14px", marginTop:14 }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#92400e",
                  textTransform:"uppercase", letterSpacing:0.3, marginBottom:4 }}>
                  Student Remarks
                </div>
                <div style={{ fontSize:13, color:"#78350f" }}>{app.remarks}</div>
              </div>
            )}
          </div>

          {/* ── Approval Chain ── */}
          <div style={{ background:"white", borderRadius:16, padding:24,
            boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ width:34, height:34, borderRadius:9,
                background:"#f5f2ed", display:"flex",
                alignItems:"center", justifyContent:"center", fontSize:18 }}>
                🔗
              </div>
              <h3 style={{ fontSize:15, fontWeight:800, margin:0 }}>Approval Chain</h3>
            </div>
            {(app.steps || []).map((s, i) => {
              const isMyStep = s.role === approverRole && s.status === "pending";
              const stepColor = s.status === "approved" ? "#059669"
                : s.status === "rejected" ? "#dc2626"
                : s.status === "pending"  ? roleColor
                : "#d1d5db";
              return (
                <div key={i} style={{ display:"flex", gap:14, marginBottom:16,
                  padding:isMyStep ? "14px" : "10px 14px",
                  borderRadius:12,
                  background:isMyStep ? roleColor+"0d" : "transparent",
                  border:isMyStep ? `1.5px solid ${roleColor}33` : "1.5px solid transparent",
                  transition:"all 0.15s" }}>
                  <div style={{ width:30, height:30, borderRadius:"50%", flexShrink:0,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:12, fontWeight:800, color:"white",
                    background:stepColor,
                    boxShadow:isMyStep ? `0 0 0 3px ${roleColor}44` : "none" }}>
                    {s.status === "approved" ? "✓"
                      : s.status === "rejected" ? "✗" : i + 1}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"#0d1b2a" }}>
                        {s.name}
                        {isMyStep && (
                          <span style={{ marginLeft:8, fontSize:11,
                            background:roleColor, color:"white",
                            padding:"2px 8px", borderRadius:99, fontWeight:700 }}>
                            ← Your Turn
                          </span>
                        )}
                      </div>
                      {s.date && (
                        <span style={{ fontSize:11, color:"#8898aa" }}>
                          {new Date(s.date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize:11, fontWeight:600, marginTop:3,
                      color:stepColor, textTransform:"capitalize" }}>
                      {s.status === "waiting"  ? "⏳ Waiting for previous step"
                        : s.status === "pending" ? "🔄 Under review"
                        : s.status === "approved" ? "✅ Approved"
                        : "❌ Rejected"}
                    </div>
                    {s.comment && (
                      <div style={{ background:"#f5f2ed", borderRadius:8,
                        padding:"7px 12px", marginTop:6,
                        fontSize:12, color:"#4a5568",
                        borderLeft:`3px solid ${stepColor}` }}>
                        💬 "{s.comment}"
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Decision Panel ── */}
          {myStep && (
            <div style={{ background:"white", borderRadius:16, padding:24,
              boxShadow:"0 2px 12px rgba(0,0,0,0.06)",
              border:`2px solid ${roleColor}33` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                <div style={{ width:34, height:34, borderRadius:9,
                  background:roleColor+"15", display:"flex",
                  alignItems:"center", justifyContent:"center", fontSize:18 }}>
                  ⚖️
                </div>
                <div>
                  <h3 style={{ fontSize:15, fontWeight:800, margin:0 }}>Your Decision</h3>
                  <div style={{ fontSize:12, color:"#8898aa", marginTop:2 }}>
                    {hasAttachments ? "Make sure you've reviewed all documents above before deciding." : "Review the form details above before deciding."}
                  </div>
                </div>
              </div>

              {error && (
                <div style={{ background:"#fef2f2", border:"1px solid #fecaca",
                  borderRadius:8, padding:"10px 14px",
                  marginBottom:14, fontSize:13, color:"#dc2626", fontWeight:500 }}>
                  ❌ {error}
                </div>
              )}

              <textarea
                placeholder="Add your comments or remarks (required for rejection)..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                style={{ width:"100%", minHeight:100, padding:"12px 14px",
                  border:`1.5px solid ${comment ? roleColor : "#e2e8f0"}`,
                  borderRadius:10, fontSize:13, resize:"vertical", outline:"none",
                  marginBottom:14, boxSizing:"border-box",
                  transition:"border-color 0.2s" }}
              />

              <div style={{ display:"flex", gap:12 }}>
                <button onClick={() => handle("approve")} disabled={loading}
                  style={{ flex:1, padding:14, border:"none",
                    cursor:loading ? "not-allowed" : "pointer",
                    background:loading ? "#ccc" : "linear-gradient(135deg,#059669,#047857)",
                    color:"white", borderRadius:12, fontWeight:800, fontSize:14,
                    boxShadow:loading ? "none" : "0 4px 14px #05966944",
                    transition:"all 0.2s" }}>
                  {loading ? "⏳ Saving..." : "✅ Approve Application"}
                </button>
                <button onClick={() => handle("reject")} disabled={loading}
                  style={{ flex:1, padding:14, border:"none",
                    cursor:loading ? "not-allowed" : "pointer",
                    background:loading ? "#ccc" : "linear-gradient(135deg,#dc2626,#b91c1c)",
                    color:"white", borderRadius:12, fontWeight:800, fontSize:14,
                    boxShadow:loading ? "none" : "0 4px 14px #dc262644",
                    transition:"all 0.2s" }}>
                  ❌ Reject Application
                </button>
              </div>
            </div>
          )}

          {/* Already actioned — no decision panel */}
          {!myStep && ["approved","rejected"].includes(app.status) && (
            <div style={{ background:app.status==="approved"?"#f0fdf4":"#fef2f2",
              border:`1.5px solid ${app.status==="approved"?"#bbf7d0":"#fecaca"}`,
              borderRadius:14, padding:"16px 20px", textAlign:"center" }}>
              <div style={{ fontSize:28, marginBottom:8 }}>
                {app.status === "approved" ? "✅" : "❌"}
              </div>
              <div style={{ fontWeight:800, fontSize:15,
                color:app.status==="approved"?"#166534":"#dc2626" }}>
                Application {app.status === "approved" ? "Fully Approved" : "Rejected"}
              </div>
              <div style={{ fontSize:12, color:"#6b7280", marginTop:4 }}>
                This application has already been processed.
              </div>
            </div>
          )}
        </div>

        {/* ── Right sidebar: Student Profile ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Student card */}
          <div style={{ background:"white", borderRadius:14, padding:20,
            boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
            <h4 style={{ fontSize:12, fontWeight:800, color:"#8898aa",
              textTransform:"uppercase", letterSpacing:0.4, marginBottom:14 }}>
              Applicant
            </h4>
            <div style={{ textAlign:"center", marginBottom:16 }}>
              <div style={{ width:54, height:54, borderRadius:"50%",
                background:"#e85d26", color:"white",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontWeight:800, fontSize:20, margin:"0 auto 10px" }}>
                {(app.student?.name || "S").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div style={{ fontSize:15, fontWeight:800, color:"#0d1b2a" }}>
                {app.student?.name}
              </div>
              <div style={{ fontSize:12, color:"#8898aa", marginTop:2 }}>
                {app.student?.rollNo}
              </div>
            </div>
            {[
              ["Department", app.student?.dept || app.dept],
              ["Year",       app.student?.year],
              ["Email",      app.student?.email],
            ].filter(([,v]) => v).map(([k, v]) => (
              <div key={k} style={{ marginBottom:10, paddingBottom:10,
                borderBottom:"1px solid #f5f2ed" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#aaa",
                  textTransform:"uppercase", letterSpacing:0.4 }}>{k}</div>
                <div style={{ fontSize:13, fontWeight:600, color:"#0d1b2a",
                  marginTop:2, wordBreak:"break-all" }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Application meta */}
          <div style={{ background:"white", borderRadius:14, padding:20,
            boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
            <h4 style={{ fontSize:12, fontWeight:800, color:"#8898aa",
              textTransform:"uppercase", letterSpacing:0.4, marginBottom:14 }}>
              Application Info
            </h4>
            {[
              ["Form",      app.formName],
              ["Category",  app.category],
              ["App ID",    app.appId],
              ["Submitted", new Date(app.submittedOn || app.createdAt).toLocaleDateString()],
              ["Steps",     `${(app.steps || []).filter(s => s.status === "approved").length} / ${app.steps?.length || 0} Approved`],
            ].map(([k, v]) => (
              <div key={k} style={{ marginBottom:10, paddingBottom:10,
                borderBottom:"1px solid #f5f2ed" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#aaa",
                  textTransform:"uppercase", letterSpacing:0.4 }}>{k}</div>
                <div style={{ fontSize:13, fontWeight:600, color:"#0d1b2a", marginTop:2 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Document count badge */}
          <div style={{ background:hasAttachments ? "linear-gradient(135deg,#0d1b2a,#1a2f4a)" : "#f9fafb",
            borderRadius:14, padding:20,
            border: hasAttachments ? "none" : "2px dashed #e2e8f0" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:28 }}>{hasAttachments ? "📎" : "📂"}</span>
              <div>
                <div style={{ fontSize:13, fontWeight:800,
                  color:hasAttachments ? "white" : "#4a5568" }}>
                  {hasAttachments ? `${app.attachments.length} Document${app.attachments.length > 1 ? "s" : ""} Attached` : "No Documents"}
                </div>
                <div style={{ fontSize:11, marginTop:3,
                  color:hasAttachments ? "rgba(255,255,255,0.5)" : "#aaa" }}>
                  {hasAttachments ? "Scroll up to view & verify" : "Student submitted no proof"}
                </div>
              </div>
            </div>
            {hasAttachments && app.attachments.map((f, i) => (
              <div key={i} style={{ marginTop:10, fontSize:11,
                color:"rgba(255,255,255,0.6)",
                display:"flex", alignItems:"center", gap:6 }}>
                <span>{f.mimetype === "application/pdf" ? "📄" : "🖼️"}</span>
                <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {f.originalName || f.filename}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main List ─────────────────────────────────────────────────────────────────
export default function PendingApprovalsPage() {
  const { user } = useAuth();
  const [apps,     setApps]    = useState([]);
  const [loading,  setLoading] = useState(true);
  const [error,    setError]   = useState("");
  const [selected, setSelected]= useState(null);
  const [lastDone, setLastDone]= useState(null);

  const roleColor = ROLE_COLORS[user?.role] || "#e85d26";

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getApplicationsAPI({ pending: "true" });
      setApps(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Could not load pending applications. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDone = (action) => {
    setLastDone(action);
    setSelected(null);
    load();
    setTimeout(() => setLastDone(null), 4000);
  };

  if (selected)
    return (
      <ReviewDetail
        app={selected}
        onBack={() => setSelected(null)}
        onDone={handleDone}
        approverRole={user.role}
      />
    );

  return (
    <div style={{ padding:"28px 32px" }}>
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, margin:0 }}>Pending Approvals</h1>
          <p style={{ color:"#8898aa", fontSize:13, marginTop:4 }}>
            {loading ? "Loading..." : `${apps.length} application${apps.length !== 1 ? "s" : ""} awaiting your review`}
          </p>
        </div>
        <button onClick={load}
          style={{ padding:"8px 16px", borderRadius:10, border:"1.5px solid #e8e4dc",
            background:"white", fontSize:13, fontWeight:600, cursor:"pointer" }}>
          🔄 Refresh
        </button>
      </div>

      {/* Toast */}
      {lastDone && (
        <div style={{ background:lastDone === "approve" ? "#f0fdf4" : "#fef2f2",
          border:`1.5px solid ${lastDone === "approve" ? "#bbf7d0" : "#fecaca"}`,
          borderRadius:12, padding:"12px 18px", marginBottom:16,
          fontSize:14, fontWeight:600,
          color:lastDone === "approve" ? "#166534" : "#dc2626" }}>
          {lastDone === "approve"
            ? "✅ Application approved! The student and next approver have been notified."
            : "❌ Application rejected. The student has been notified with your reason."}
        </div>
      )}

      {error && (
        <div style={{ background:"#fef2f2", border:"1px solid #fecaca",
          borderRadius:10, padding:"12px 16px",
          marginBottom:16, fontSize:13, color:"#dc2626" }}>
          ❌ {error}
        </div>
      )}

      {loading ? (
        <div style={{ background:"white", borderRadius:16, padding:"60px 20px",
          textAlign:"center", color:"#8898aa", fontSize:14,
          boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
          ⏳ Loading from database...
        </div>
      ) : apps.length === 0 ? (
        <div style={{ background:"white", borderRadius:16, padding:"60px 20px",
          textAlign:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🎉</div>
          <div style={{ fontSize:16, fontWeight:700, marginBottom:4 }}>All caught up!</div>
          <div style={{ fontSize:13, color:"#8898aa" }}>No pending approvals at this time.</div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {apps.map(app => {
            const hasDoc = app.attachments && app.attachments.length > 0;
            return (
              <div key={app._id}
                style={{ background:"white", borderRadius:14, padding:"18px 22px",
                  boxShadow:"0 2px 12px rgba(0,0,0,0.06)",
                  display:"flex", alignItems:"center", gap:14,
                  transition:"all 0.15s", border:`1.5px solid transparent` }}
                onMouseOver={e => { e.currentTarget.style.boxShadow="0 8px 24px rgba(13,27,42,0.1)"; e.currentTarget.style.borderColor=roleColor+"33"; }}
                onMouseOut={e  => { e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.06)"; e.currentTarget.style.borderColor="transparent"; }}>

                <div style={{ width:46, height:46, borderRadius:12, background:"#f5f2ed",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:22, flexShrink:0 }}>
                  {app.icon || "📋"}
                </div>

                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700 }}>{app.formName}</div>
                  <div style={{ fontSize:12, color:"#8898aa", marginTop:2 }}>
                    {app.student?.name} · {app.student?.rollNo} · {app.student?.dept || app.dept}
                  </div>
                  <div style={{ display:"flex", gap:8, marginTop:6, flexWrap:"wrap" }}>
                    <span style={{ fontSize:11, fontWeight:600, color:roleColor,
                      background:roleColor+"15", padding:"2px 8px", borderRadius:99 }}>
                      Step: {app.steps?.find(s => s.role === user.role && s.status === "pending")?.name || "Review"}
                    </span>
                    {hasDoc && (
                      <span style={{ fontSize:11, fontWeight:700, color:"#f59e0b",
                        background:"#fffbeb", padding:"2px 8px", borderRadius:99,
                        border:"1px solid #fde68a" }}>
                        📎 {app.attachments.length} doc{app.attachments.length > 1 ? "s" : ""} attached
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ textAlign:"right", marginRight:10 }}>
                  <div style={{ fontSize:11, color:"#8898aa" }}>
                    {new Date(app.submittedOn || app.createdAt).toLocaleDateString()}
                  </div>
                  <div style={{ marginTop:4 }}>
                    <StatusBadge status={app.status}/>
                  </div>
                </div>

                <button onClick={() => setSelected(app)}
                  style={{ padding:"9px 20px", borderRadius:10,
                    border:`1.5px solid ${roleColor}`,
                    background:roleColor+"10", fontSize:13,
                    fontWeight:700, cursor:"pointer", color:roleColor,
                    transition:"all 0.15s", flexShrink:0 }}
                  onMouseOver={e => { e.currentTarget.style.background=roleColor; e.currentTarget.style.color="white"; }}
                  onMouseOut={e  => { e.currentTarget.style.background=roleColor+"10"; e.currentTarget.style.color=roleColor; }}>
                  Review →
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}