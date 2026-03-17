// ─────────────────────────────────────────────────────────────────────────────
// FeedbackPage.jsx  —  Student & Faculty feedback submission + history
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";

const BASE  = "http://localhost:5000/api";
const token = () => localStorage.getItem("token");
const apiFetch = async (path, opts = {}) => {
  const res  = await fetch(BASE + path, {
    ...opts, headers: { Authorization:"Bearer "+token(),
      "Content-Type":"application/json", ...(opts.headers||{}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

const TYPES = [
  { value:"missing_form",  label:"Missing Form",    icon:"📋", color:"#e85d26",
    desc:"A form I need doesn't exist in the system" },
  { value:"form_issue",    label:"Form Issue",       icon:"⚠️", color:"#f59e0b",
    desc:"An existing form has incorrect fields or errors" },
  { value:"suggestion",    label:"Suggestion",       icon:"💡", color:"#2563eb",
    desc:"Idea to improve the platform" },
  { value:"bug_report",    label:"Bug Report",       icon:"🐛", color:"#dc2626",
    desc:"Something is broken or not working" },
  { value:"other",         label:"Other",            icon:"📝", color:"#374151",
    desc:"General feedback or inquiry" },
];

const PRIORITIES = [
  { value:"low",    label:"Low",    color:"#059669", bg:"#f0fdf4" },
  { value:"medium", label:"Medium", color:"#f59e0b", bg:"#fffbeb" },
  { value:"high",   label:"High",   color:"#dc2626", bg:"#fef2f2" },
];

const STATUS_MAP = {
  open:        { label:"Open",        color:"#f59e0b", bg:"#fffbeb" },
  "in-progress":{ label:"In Progress", color:"#2563eb", bg:"#eff6ff" },
  resolved:    { label:"Resolved",    color:"#059669", bg:"#f0fdf4" },
  closed:      { label:"Closed",      color:"#374151", bg:"#f9fafb" },
};

const CATEGORIES = ["General","Leave","Certificate","Placement","Fee","Hostel","Exam","Activity","Library","Academic","Research","Admin","Professional"];

// ── Star Rating ────────────────────────────────────────────────────────────────
function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display:"flex", gap:4 }}>
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button"
          onClick={() => onChange(n)}
          onMouseOver={() => setHover(n)}
          onMouseOut={() => setHover(0)}
          style={{ background:"none", border:"none", cursor:"pointer",
            fontSize:28, padding:2, transition:"transform 0.1s",
            transform: hover >= n ? "scale(1.15)" : "scale(1)" }}>
          {(hover || value) >= n ? "⭐" : "☆"}
        </button>
      ))}
      {value > 0 && (
        <span style={{ fontSize:13, color:"#8898aa", alignSelf:"center", marginLeft:6 }}>
          {["","Very Poor","Poor","Average","Good","Excellent"][value]}
        </span>
      )}
    </div>
  );
}

export default function FeedbackPage() {
  const { user } = useAuth();
  const isFaculty = user?.role === "faculty";
  const accentColor = isFaculty ? "#059669" : "#e85d26";

  const [view,     setView]     = useState("form");   // "form" | "history"
  const [screen,   setScreen]   = useState("type");   // "type" | "details" | "success"

  // Form state
  const [type,     setType]     = useState("");
  const [category, setCategory] = useState("");
  const [formName, setFormName] = useState("");
  const [subject,  setSubject]  = useState("");
  const [message,  setMessage]  = useState("");
  const [priority, setPriority] = useState("medium");
  const [rating,   setRating]   = useState(0);
  const [submittedId, setSubmittedId] = useState("");

  // History
  const [history,  setHistory]  = useState([]);
  const [loadingH, setLoadingH] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [expanded, setExpanded] = useState(null);

  const loadHistory = useCallback(async () => {
    setLoadingH(true);
    try {
      const data = await apiFetch("/feedback");
      setHistory(Array.isArray(data) ? data : []);
    } catch { setHistory([]); }
    finally { setLoadingH(false); }
  }, []);

  useEffect(() => { if (view === "history") loadHistory(); }, [view, loadHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!subject.trim()) return setError("Please enter a subject");
    if (!message.trim()) return setError("Please describe your feedback");
    setLoading(true);
    try {
      const res = await apiFetch("/feedback", {
        method: "POST",
        body: JSON.stringify({ type, category, formName, subject, message, priority, rating }),
      });
      setSubmittedId(res.feedback?._id || "DONE");
      setScreen("success");
    } catch (err) {
      setError(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setType(""); setCategory(""); setFormName(""); setSubject("");
    setMessage(""); setPriority("medium"); setRating(0);
    setError(""); setScreen("type");
  };

  const inp = {
    width:"100%", padding:"11px 13px", border:"1.5px solid #e2e8f0",
    borderRadius:10, fontSize:14, outline:"none", boxSizing:"border-box",
    transition:"border-color 0.2s", background:"white",
  };
  const lbl = {
    fontSize:11, fontWeight:700, color:"#8898aa", textTransform:"uppercase",
    letterSpacing:0.6, display:"block", marginBottom:7,
  };

  const selectedType = TYPES.find(t => t.value === type);

  // ── SUCCESS ────────────────────────────────────────────────────────────────
  if (screen === "success") return (
    <div style={{ padding:"28px 32px" }}>
      <div style={{ maxWidth:540, margin:"0 auto" }}>
        <div style={{ background:"white", borderRadius:20, padding:"48px 40px",
          textAlign:"center", boxShadow:"0 2px 16px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize:72, marginBottom:16 }}>🙏</div>
          <h2 style={{ fontSize:24, fontWeight:800, color:"#0d1b2a", marginBottom:8 }}>
            Thank You!
          </h2>
          <p style={{ color:"#4a5568", fontSize:14, marginBottom:24, lineHeight:1.7 }}>
            Your feedback has been submitted. The admin team will review it and take action accordingly.
            You can track the status in <strong>My Feedback</strong>.
          </p>

          <div style={{ background:selectedType ? selectedType.color+"10" : "#f5f2ed",
            border:`1.5px solid ${selectedType?.color||"#e8e4dc"}`,
            borderRadius:14, padding:"16px 20px", marginBottom:28, textAlign:"left" }}>
            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
              <span style={{ fontSize:22 }}>{selectedType?.icon || "📝"}</span>
              <div>
                <div style={{ fontWeight:800, fontSize:14, color:"#0d1b2a" }}>{subject}</div>
                <div style={{ fontSize:12, color:selectedType?.color||"#8898aa",
                  fontWeight:600, marginTop:2 }}>{selectedType?.label || type}</div>
              </div>
            </div>
            <div style={{ fontSize:13, color:"#4a5568", lineHeight:1.6 }}>{message}</div>
          </div>

          <div style={{ display:"flex", gap:10 }}>
            <button onClick={() => { resetForm(); setView("history"); loadHistory(); }}
              style={{ flex:1, padding:"12px", border:`1.5px solid ${accentColor}`,
                background:"white", color:accentColor, borderRadius:11,
                fontWeight:700, fontSize:14, cursor:"pointer" }}>
              📋 View My Feedback
            </button>
            <button onClick={resetForm}
              style={{ flex:1, padding:"12px",
                background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`,
                color:"white", border:"none", borderRadius:11,
                fontWeight:700, fontSize:14, cursor:"pointer" }}>
              ➕ Submit Another
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding:"28px 32px" }}>
      {/* Page header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, margin:0 }}>
            {view === "form" ? "Submit Feedback" : "My Feedback History"}
          </h1>
          <p style={{ color:"#8898aa", fontSize:13, marginTop:4 }}>
            {view === "form"
              ? "Help us improve — report missing forms, issues or share suggestions"
              : "Track status of your submitted feedback"}
          </p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {["form","history"].map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding:"9px 20px", borderRadius:10, fontWeight:700,
                fontSize:13, cursor:"pointer", border:"1.5px solid",
                background: view===v ? accentColor : "white",
                color:      view===v ? "white"      : accentColor,
                borderColor: accentColor, transition:"all 0.15s" }}>
              {v === "form" ? "✏️ New Feedback" : "📋 My Feedback"}
            </button>
          ))}
        </div>
      </div>

      {/* ── FORM VIEW ─────────────────────────────────────────────────────── */}
      {view === "form" && (
        <div style={{ maxWidth:700, margin:"0 auto" }}>

          {/* Step indicator */}
          <div style={{ background:"white", borderRadius:14, padding:"14px 20px",
            marginBottom:20, boxShadow:"0 2px 12px rgba(0,0,0,0.06)",
            display:"flex", alignItems:"center", gap:0 }}>
            {[{ key:"type", label:"Choose Type" }, { key:"details", label:"Fill Details" }].map((s, i) => {
              const done    = (s.key==="type"&&screen==="details");
              const active  = screen===s.key;
              return (
                <div key={s.key} style={{ display:"flex", alignItems:"center", flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:28, height:28, borderRadius:"50%",
                      background:done?"#059669":active?accentColor:"#e8e4dc",
                      color:"white", display:"flex", alignItems:"center",
                      justifyContent:"center", fontSize:12, fontWeight:800 }}>
                      {done ? "✓" : i+1}
                    </div>
                    <span style={{ fontSize:13, fontWeight:active?700:400,
                      color:done?"#059669":active?accentColor:"#8898aa" }}>{s.label}</span>
                  </div>
                  {i===0 && <div style={{ flex:1, height:2, margin:"0 16px",
                    background:screen==="details"?"#059669":"#e8e4dc" }}/>}
                </div>
              );
            })}
          </div>

          {/* ── STEP 1: Choose Type ── */}
          {screen === "type" && (
            <div style={{ background:"white", borderRadius:18, padding:28,
              boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontSize:16, fontWeight:800, marginBottom:6 }}>
                What kind of feedback do you have?
              </h3>
              <p style={{ color:"#8898aa", fontSize:13, marginBottom:22 }}>
                Select the category that best describes your feedback
              </p>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {TYPES.map(t => (
                  <div key={t.value}
                    onClick={() => { setType(t.value); }}
                    style={{ padding:20, borderRadius:14, cursor:"pointer",
                      border:`2px solid ${type===t.value ? t.color : "#e8e4dc"}`,
                      background:type===t.value ? t.color+"0d" : "white",
                      transition:"all 0.15s" }}
                    onMouseOver={e => { e.currentTarget.style.borderColor=t.color; e.currentTarget.style.transform="translateY(-2px)"; }}
                    onMouseOut={e  => { if(type!==t.value){e.currentTarget.style.borderColor="#e8e4dc";} e.currentTarget.style.transform="none"; }}>
                    <div style={{ fontSize:28, marginBottom:8 }}>{t.icon}</div>
                    <div style={{ fontWeight:800, fontSize:14, color:"#0d1b2a", marginBottom:4 }}>
                      {t.label}
                    </div>
                    <div style={{ fontSize:12, color:"#8898aa", lineHeight:1.5 }}>{t.desc}</div>
                    {type===t.value && (
                      <div style={{ marginTop:10, display:"inline-flex", alignItems:"center", gap:6,
                        background:t.color, color:"white", fontSize:11, fontWeight:700,
                        padding:"3px 10px", borderRadius:99 }}>
                        ✓ Selected
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button onClick={() => type && setScreen("details")}
                disabled={!type}
                style={{ width:"100%", padding:"13px", marginTop:20,
                  background:type ? `linear-gradient(135deg,${accentColor},${accentColor}cc)` : "#e8e4dc",
                  color:type?"white":"#aaa", border:"none", borderRadius:12,
                  fontWeight:800, fontSize:15, cursor:type?"pointer":"not-allowed",
                  transition:"all 0.2s" }}>
                Continue →
              </button>
            </div>
          )}

          {/* ── STEP 2: Details ── */}
          {screen === "details" && (
            <form onSubmit={handleSubmit}>
              <div style={{ background:"white", borderRadius:18, padding:28,
                boxShadow:"0 2px 12px rgba(0,0,0,0.06)", marginBottom:16 }}>

                {/* Selected type pill */}
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22,
                  padding:"10px 14px", background:selectedType?.color+"10",
                  borderRadius:11, border:`1.5px solid ${selectedType?.color}33` }}>
                  <span style={{ fontSize:20 }}>{selectedType?.icon}</span>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13, color:selectedType?.color }}>
                      {selectedType?.label}
                    </div>
                    <div style={{ fontSize:11, color:"#8898aa" }}>{selectedType?.desc}</div>
                  </div>
                  <button type="button" onClick={() => setScreen("type")}
                    style={{ marginLeft:"auto", background:"none", border:"none",
                      color:"#8898aa", cursor:"pointer", fontSize:12, fontWeight:600 }}>
                    ← Change
                  </button>
                </div>

                {error && (
                  <div style={{ background:"#fef2f2", border:"1px solid #fecaca",
                    borderRadius:10, padding:"10px 14px", marginBottom:18,
                    fontSize:13, color:"#dc2626" }}>❌ {error}</div>
                )}

                {/* Category + Form Name */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
                  <div>
                    <label style={lbl}>Related Category</label>
                    <select value={category} onChange={e=>setCategory(e.target.value)}
                      style={{...inp, cursor:"pointer"}}>
                      <option value="">Select category (optional)...</option>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Form Name (if specific)</label>
                    <input value={formName} onChange={e=>setFormName(e.target.value)}
                      placeholder="e.g. Leave Application, Bonafide..." style={inp}
                      onFocus={e=>e.target.style.borderColor=accentColor}
                      onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
                  </div>
                </div>

                {/* Subject */}
                <div style={{ marginBottom:16 }}>
                  <label style={lbl}>Subject *</label>
                  <input value={subject} onChange={e=>setSubject(e.target.value)}
                    placeholder="Brief summary of your feedback..."
                    style={inp}
                    onFocus={e=>e.target.style.borderColor=accentColor}
                    onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
                </div>

                {/* Message */}
                <div style={{ marginBottom:16 }}>
                  <label style={lbl}>Description *</label>
                  <textarea value={message} onChange={e=>setMessage(e.target.value)}
                    placeholder={
                      type==="missing_form" ? "Describe the form you need, who it's for, and what it should contain..."
                      : type==="form_issue"  ? "Describe what's wrong with the form, which fields are incorrect, what you expected..."
                      : type==="bug_report"  ? "Describe the bug: what happened, what you expected, steps to reproduce..."
                      : "Share your feedback in detail..."
                    }
                    rows={5}
                    style={{...inp, resize:"vertical"}}
                    onFocus={e=>e.target.style.borderColor=accentColor}
                    onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
                  <div style={{ fontSize:11, color:message.length>500?"#dc2626":"#8898aa",
                    textAlign:"right", marginTop:4 }}>
                    {message.length}/500
                  </div>
                </div>

                {/* Priority */}
                <div style={{ marginBottom:16 }}>
                  <label style={lbl}>Priority</label>
                  <div style={{ display:"flex", gap:8 }}>
                    {PRIORITIES.map(p => (
                      <button key={p.value} type="button" onClick={() => setPriority(p.value)}
                        style={{ padding:"8px 20px", borderRadius:99, fontWeight:700,
                          fontSize:13, cursor:"pointer", border:"1.5px solid",
                          background:priority===p.value ? p.color : "white",
                          color:priority===p.value ? "white" : p.color,
                          borderColor:p.color, transition:"all 0.15s" }}>
                        {priority===p.value ? "● " : ""}{p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Star rating */}
                <div style={{ marginBottom:24 }}>
                  <label style={lbl}>Overall Platform Rating (optional)</label>
                  <StarRating value={rating} onChange={setRating}/>
                </div>

                <div style={{ display:"flex", gap:10 }}>
                  <button type="submit" disabled={loading}
                    style={{ flex:1, padding:"13px",
                      background:loading?"#ccc":`linear-gradient(135deg,${accentColor},${accentColor}cc)`,
                      color:"white", border:"none", borderRadius:12, fontWeight:800,
                      fontSize:15, cursor:loading?"not-allowed":"pointer",
                      boxShadow:loading?"none":`0 4px 14px ${accentColor}44` }}>
                    {loading ? "⏳ Submitting..." : "🚀 Submit Feedback"}
                  </button>
                  <button type="button" onClick={() => setScreen("type")}
                    style={{ padding:"13px 20px", background:"white",
                      border:"1.5px solid #e2e8f0", borderRadius:12,
                      fontWeight:600, fontSize:14, cursor:"pointer" }}>
                    ← Back
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ── HISTORY VIEW ──────────────────────────────────────────────────── */}
      {view === "history" && (
        <div>
          {loadingH ? (
            <div style={{ background:"white", borderRadius:16, padding:"60px 20px",
              textAlign:"center", color:"#8898aa" }}>⏳ Loading your feedback...</div>
          ) : history.length === 0 ? (
            <div style={{ background:"white", borderRadius:16, padding:"60px 20px",
              textAlign:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
              <div style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>No feedback submitted yet</div>
              <div style={{ fontSize:13, color:"#8898aa", marginBottom:20 }}>
                Share your thoughts to help us improve the platform
              </div>
              <button onClick={() => setView("form")}
                style={{ padding:"10px 24px",
                  background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`,
                  color:"white", border:"none", borderRadius:10,
                  fontWeight:700, fontSize:14, cursor:"pointer" }}>
                ✏️ Submit Feedback
              </button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {history.map(fb => {
                const t   = TYPES.find(x => x.value===fb.type) || TYPES[4];
                const st  = STATUS_MAP[fb.status] || STATUS_MAP.open;
                const pri = PRIORITIES.find(p => p.value===fb.priority) || PRIORITIES[1];
                const isOpen = expanded === fb._id;
                return (
                  <div key={fb._id} style={{ background:"white", borderRadius:16,
                    boxShadow:"0 2px 12px rgba(0,0,0,0.06)",
                    border:`1.5px solid ${isOpen ? t.color+"44" : "transparent"}`,
                    overflow:"hidden", transition:"all 0.15s" }}>

                    {/* Row */}
                    <div style={{ display:"flex", alignItems:"center", gap:14, padding:"18px 22px",
                      cursor:"pointer" }}
                      onClick={() => setExpanded(isOpen ? null : fb._id)}>
                      <div style={{ width:44, height:44, borderRadius:12,
                        background:t.color+"15", display:"flex",
                        alignItems:"center", justifyContent:"center",
                        fontSize:22, flexShrink:0 }}>{t.icon}</div>

                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:"#0d1b2a" }}>
                          {fb.subject}
                        </div>
                        <div style={{ display:"flex", gap:8, marginTop:5, flexWrap:"wrap" }}>
                          <span style={{ fontSize:11, fontWeight:600, color:t.color,
                            background:t.color+"15", padding:"2px 8px", borderRadius:99 }}>
                            {t.label}
                          </span>
                          {fb.category && (
                            <span style={{ fontSize:11, color:"#8898aa",
                              background:"#f5f2ed", padding:"2px 8px", borderRadius:99 }}>
                              {fb.category}
                            </span>
                          )}
                          <span style={{ fontSize:11, fontWeight:700, color:pri.color,
                            background:pri.bg, padding:"2px 8px", borderRadius:99 }}>
                            {fb.priority} priority
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign:"right", flexShrink:0 }}>
                        <span style={{ background:st.bg, color:st.color,
                          fontSize:11, fontWeight:700, padding:"4px 12px",
                          borderRadius:99, display:"block", marginBottom:4 }}>
                          {st.label}
                        </span>
                        <div style={{ fontSize:11, color:"#8898aa" }}>
                          {new Date(fb.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div style={{ color:"#8898aa", fontSize:18, marginLeft:8 }}>
                        {isOpen ? "▲" : "▼"}
                      </div>
                    </div>

                    {/* Expanded detail */}
                    {isOpen && (
                      <div style={{ padding:"0 22px 22px",
                        borderTop:"1px solid #f5f2ed" }}>
                        <div style={{ background:"#f9fafb", borderRadius:12,
                          padding:"14px 16px", marginTop:14 }}>
                          <div style={{ fontSize:11, fontWeight:700, color:"#8898aa",
                            textTransform:"uppercase", letterSpacing:0.4, marginBottom:8 }}>
                            Your Message
                          </div>
                          <div style={{ fontSize:13, color:"#0d1b2a", lineHeight:1.7 }}>
                            {fb.message}
                          </div>
                        </div>

                        {fb.formName && (
                          <div style={{ marginTop:10, fontSize:13, color:"#4a5568" }}>
                            <strong>Form mentioned:</strong> {fb.formName}
                          </div>
                        )}

                        {fb.rating && (
                          <div style={{ marginTop:10, fontSize:13, color:"#4a5568" }}>
                            <strong>Your rating:</strong> {"⭐".repeat(fb.rating)} ({["","Very Poor","Poor","Average","Good","Excellent"][fb.rating]})
                          </div>
                        )}

                        {fb.adminNote && (
                          <div style={{ marginTop:14, background:"#eff6ff",
                            border:"1.5px solid #bfdbfe", borderRadius:12,
                            padding:"12px 16px" }}>
                            <div style={{ fontSize:11, fontWeight:700, color:"#1d4ed8",
                              textTransform:"uppercase", marginBottom:6 }}>
                              💬 Admin Response
                            </div>
                            <div style={{ fontSize:13, color:"#1e40af", lineHeight:1.6 }}>
                              {fb.adminNote}
                            </div>
                          </div>
                        )}

                        {fb.status === "resolved" && (
                          <div style={{ marginTop:12, background:"#f0fdf4",
                            border:"1px solid #bbf7d0", borderRadius:10,
                            padding:"10px 14px", fontSize:13, color:"#166534" }}>
                            ✅ This feedback has been resolved. Thank you for helping us improve!
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}