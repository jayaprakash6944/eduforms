import { useState, useEffect, useCallback } from "react";
import StudentDashboard    from "./student/StudentDashboard";
import AcademicRecords     from "./student/AcademicRecords";
import BrowseForms         from "./student/BrowseForms";
import MyApplications      from "./student/MyApplications";
import ManageForms         from "./admin/ManageForms";
import ManageUsers         from "./admin/ManageUsers";
import AllApplications     from "./admin/AllApplications";
import FeedbackAdmin       from "./admin/FeedbackAdmin";
import NotificationsPage   from "./NotificationsPage";
import PendingApprovalsPage from "./PendingApprovalsPage";
import GenericDashboard    from "./GenericDashboard";
import { useAuth }         from "../contexts/AuthContext";
import { MOCK_SCHEDULE }   from "../data/mockData";

// ── Inline placeholder ────────────────────────────────────────────────────────
const Placeholder = ({ title, icon="🚧" }) => (
  <div style={{ padding:"28px 32px" }}>
    <div style={{ background:"white", borderRadius:16, padding:"60px 20px",
      textAlign:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ fontSize:40, marginBottom:12 }}>{icon}</div>
      <div style={{ fontSize:16, fontWeight:700, marginBottom:4 }}>{title}</div>
      <div style={{ fontSize:13, color:"#8898aa" }}>This section is ready for your data.</div>
    </div>
  </div>
);

// ── Inline ApprovalHistory (replaces missing ./shared/ApprovalHistory) ────────
const ApprovalHistory = () => <Placeholder title="Approval History" icon="📜" />;

// ── Inline ExamPortal (replaces missing ./exam/ExamPortal) ───────────────────
const ExamPortal = ({ currentPage }) => (
  <Placeholder title={`Exam Portal — ${currentPage || "Home"}`} icon="🎓" />
);

// ── Inline MyStudents ─────────────────────────────────────────────────────────
function MyStudents() {
  const [search, setSearch] = useState("");
  const students = [
    { _id:"1", name:"Arjun Sharma",  rollNo:"CS21B047", year:"3rd Year", dept:"Computer Science", email:"arjun@college.edu",  attendance:88 },
    { _id:"2", name:"Meera Pillai",  rollNo:"CS21B048", year:"3rd Year", dept:"Computer Science", email:"meera@college.edu",   attendance:72 },
    { _id:"3", name:"Raj Verma",     rollNo:"CS22B001", year:"2nd Year", dept:"Computer Science", email:"raj@college.edu",     attendance:91 },
    { _id:"4", name:"Ananya Singh",  rollNo:"CS22B002", year:"2nd Year", dept:"Computer Science", email:"ananya@college.edu",  attendance:84 },
    { _id:"5", name:"Karan Mehta",   rollNo:"CS21B049", year:"3rd Year", dept:"Computer Science", email:"karan@college.edu",   attendance:68 },
    { _id:"6", name:"Divya Nair",    rollNo:"CS23B010", year:"1st Year", dept:"Computer Science", email:"divya@college.edu",   attendance:96 },
  ];
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(search.toLowerCase())
  );
  const getC = (p) => p>=85?"#059669":p>=75?"#f59e0b":"#dc2626";
  const getB = (p) => p>=85?"#f0fdf4":p>=75?"#fffbeb":"#fef2f2";
  return (
    <div style={{ padding:"28px 32px" }}>
      <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>My Students</h1>
      <p style={{ color:"#8898aa", fontSize:13, marginBottom:20 }}>Students assigned to you</p>
      <div style={{ background:"white", borderRadius:12, padding:"10px 16px",
        boxShadow:"0 2px 12px rgba(0,0,0,0.06)", marginBottom:20,
        display:"flex", gap:10, alignItems:"center" }}>
        <span>🔍</span>
        <input placeholder="Search by name or roll number..." value={search}
          onChange={e=>setSearch(e.target.value)}
          style={{ border:"none", background:"transparent", fontSize:14, flex:1, outline:"none" }}/>
        <span style={{ fontSize:12, color:"#aaa" }}>{filtered.length} students</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {filtered.map(s => (
          <div key={s._id} style={{ background:"white", borderRadius:16, padding:20,
            boxShadow:"0 2px 12px rgba(13,27,42,0.06)", border:"1px solid #f0ebe3" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:"#e85d26",
                color:"white", display:"flex", alignItems:"center", justifyContent:"center",
                fontWeight:800, fontSize:14, flexShrink:0 }}>
                {s.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
              </div>
              <div>
                <div style={{ fontWeight:700, fontSize:14 }}>{s.name}</div>
                <div style={{ fontSize:11, color:"#8898aa" }}>{s.rollNo}</div>
              </div>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:6 }}>
              <span style={{ color:"#8898aa" }}>Attendance</span>
              <span style={{ fontWeight:700, color:getC(s.attendance),
                background:getB(s.attendance), padding:"2px 8px", borderRadius:99 }}>
                {s.attendance}%
              </span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}>
              <span style={{ color:"#8898aa" }}>Year</span>
              <span style={{ fontWeight:600 }}>{s.year}</span>
            </div>
            {s.attendance < 75 && (
              <div style={{ background:"#fef2f2", borderRadius:8, padding:"6px 10px",
                marginTop:10, fontSize:11, color:"#dc2626", fontWeight:600 }}>
                ⚠ Low attendance — may be ineligible for exams
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Inline FeedbackPage ───────────────────────────────────────────────────────
const FB_TYPES = [
  { value:"missing_form", label:"Missing Form", icon:"📋", color:"#e85d26", desc:"A form I need doesn't exist in the system" },
  { value:"form_issue",   label:"Form Issue",   icon:"⚠️", color:"#f59e0b", desc:"An existing form has incorrect fields or errors" },
  { value:"suggestion",   label:"Suggestion",   icon:"💡", color:"#2563eb", desc:"Idea to improve the platform" },
  { value:"bug_report",   label:"Bug Report",   icon:"🐛", color:"#dc2626", desc:"Something is broken or not working" },
  { value:"other",        label:"Other",        icon:"📝", color:"#374151", desc:"General feedback or inquiry" },
];
const FB_PRIORITIES = [
  { value:"low",    label:"Low",    color:"#059669", bg:"#f0fdf4" },
  { value:"medium", label:"Medium", color:"#f59e0b", bg:"#fffbeb" },
  { value:"high",   label:"High",   color:"#dc2626", bg:"#fef2f2" },
];
const FB_STATUS_MAP = {
  open:          { label:"Open",        color:"#f59e0b", bg:"#fffbeb" },
  "in-progress": { label:"In Progress", color:"#2563eb", bg:"#eff6ff" },
  resolved:      { label:"Resolved",    color:"#059669", bg:"#f0fdf4" },
  closed:        { label:"Closed",      color:"#374151", bg:"#f9fafb" },
};
const FB_CATEGORIES = ["General","Leave","Certificate","Placement","Fee","Hostel","Exam","Activity","Library","Academic","Research","Admin","Professional"];
const FB_BASE = "http://localhost:5000/api";
const fbFetch = async (path, opts={}) => {
  const res  = await fetch(FB_BASE+path, { ...opts, headers:{ Authorization:"Bearer "+localStorage.getItem("token"), "Content-Type":"application/json", ...(opts.headers||{}) }});
  const data = await res.json();
  if (!res.ok) throw new Error(data.message||"Error");
  return data;
};
function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display:"flex", gap:4 }}>
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" onClick={()=>onChange(n)}
          onMouseOver={()=>setHover(n)} onMouseOut={()=>setHover(0)}
          style={{ background:"none", border:"none", cursor:"pointer",
            fontSize:26, padding:2, transition:"transform 0.1s",
            transform:(hover||value)>=n?"scale(1.15)":"scale(1)" }}>
          {(hover||value)>=n?"⭐":"☆"}
        </button>
      ))}
      {value>0 && <span style={{ fontSize:13, color:"#8898aa", alignSelf:"center", marginLeft:6 }}>{["","Very Poor","Poor","Average","Good","Excellent"][value]}</span>}
    </div>
  );
}
function FeedbackPage() {
  const { user }    = useAuth();
  const accent      = user?.role==="faculty" ? "#059669" : "#e85d26";
  const [view,      setView]     = useState("form");
  const [screen,    setScreen]   = useState("type");
  const [fbType,    setFbType]   = useState("");
  const [category,  setCategory] = useState("");
  const [formName,  setFormName] = useState("");
  const [subject,   setSubject]  = useState("");
  const [message,   setMessage]  = useState("");
  const [priority,  setPriority] = useState("medium");
  const [rating,    setRating]   = useState(0);
  const [history,   setHistory]  = useState([]);
  const [loadingH,  setLoadingH] = useState(false);
  const [loading,   setLoading]  = useState(false);
  const [error,     setError]    = useState("");
  const [expanded,  setExpanded] = useState(null);
  const [submitted, setSubmitted]= useState(false);

  const loadHistory = useCallback(async () => {
    setLoadingH(true);
    try { const d = await fbFetch("/feedback"); setHistory(Array.isArray(d)?d:[]); }
    catch { setHistory([]); } finally { setLoadingH(false); }
  }, []);

  useEffect(() => { if (view==="history") loadHistory(); }, [view, loadHistory]);

  const resetForm = () => { setFbType(""); setCategory(""); setFormName(""); setSubject(""); setMessage(""); setPriority("medium"); setRating(0); setError(""); setScreen("type"); setSubmitted(false); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (!subject.trim()) return setError("Please enter a subject");
    if (!message.trim()) return setError("Please describe your feedback");
    setLoading(true);
    try { await fbFetch("/feedback",{ method:"POST", body:JSON.stringify({ type:fbType, category, formName, subject, message, priority, rating }) }); setSubmitted(true); }
    catch (err) { setError(err.message||"Submission failed"); }
    finally { setLoading(false); }
  };

  const inp = { width:"100%", padding:"11px 13px", border:"1.5px solid #e2e8f0", borderRadius:10, fontSize:14, outline:"none", boxSizing:"border-box", background:"white" };
  const lbl = { fontSize:11, fontWeight:700, color:"#8898aa", textTransform:"uppercase", letterSpacing:0.6, display:"block", marginBottom:7 };
  const selType = FB_TYPES.find(t=>t.value===fbType);

  if (submitted) return (
    <div style={{ padding:"28px 32px" }}>
      <div style={{ maxWidth:520, margin:"0 auto", background:"white", borderRadius:20, padding:"48px 40px", textAlign:"center", boxShadow:"0 2px 16px rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize:72, marginBottom:16 }}>🙏</div>
        <h2 style={{ fontSize:24, fontWeight:800, marginBottom:8 }}>Thank You!</h2>
        <p style={{ color:"#4a5568", fontSize:14, marginBottom:28, lineHeight:1.7 }}>
          Your feedback has been submitted. The admin team will review it and take action accordingly.
        </p>
        <div style={{ background:selType?selType.color+"10":"#f5f2ed", border:`1.5px solid ${selType?.color||"#e8e4dc"}`, borderRadius:14, padding:"14px 18px", marginBottom:24, textAlign:"left" }}>
          <div style={{ fontWeight:800, fontSize:14, marginBottom:6 }}>{subject}</div>
          <div style={{ fontSize:13, color:"#4a5568", lineHeight:1.6 }}>{message}</div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={()=>{resetForm();setView("history");}} style={{ flex:1, padding:"12px", border:`1.5px solid ${accent}`, background:"white", color:accent, borderRadius:11, fontWeight:700, cursor:"pointer" }}>📋 My Feedback</button>
          <button onClick={resetForm} style={{ flex:1, padding:"12px", background:`linear-gradient(135deg,${accent},${accent}cc)`, color:"white", border:"none", borderRadius:11, fontWeight:700, cursor:"pointer" }}>➕ Submit Another</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding:"28px 32px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, margin:0 }}>{view==="form"?"Submit Feedback":"My Feedback History"}</h1>
          <p style={{ color:"#8898aa", fontSize:13, marginTop:4 }}>{view==="form"?"Report missing forms, issues or share suggestions":"Track the status of your submitted feedback"}</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {["form","history"].map(v=>(
            <button key={v} onClick={()=>setView(v)}
              style={{ padding:"9px 20px", borderRadius:10, fontWeight:700, fontSize:13, cursor:"pointer", border:"1.5px solid", background:view===v?accent:"white", color:view===v?"white":accent, borderColor:accent, transition:"all 0.15s" }}>
              {v==="form"?"✏️ New Feedback":"📋 My Feedback"}
            </button>
          ))}
        </div>
      </div>

      {view==="form" && (
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          {/* Steps */}
          <div style={{ background:"white", borderRadius:14, padding:"14px 20px", marginBottom:20, boxShadow:"0 2px 12px rgba(0,0,0,0.06)", display:"flex", alignItems:"center" }}>
            {[{key:"type",label:"Choose Type"},{key:"details",label:"Fill Details"}].map((s,i)=>{
              const done = s.key==="type"&&screen==="details"; const active = screen===s.key;
              return (<div key={s.key} style={{ display:"flex", alignItems:"center", flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:done?"#059669":active?accent:"#e8e4dc", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800 }}>{done?"✓":i+1}</div>
                  <span style={{ fontSize:13, fontWeight:active?700:400, color:done?"#059669":active?accent:"#8898aa" }}>{s.label}</span>
                </div>
                {i===0&&<div style={{ flex:1, height:2, margin:"0 16px", background:screen==="details"?"#059669":"#e8e4dc" }}/>}
              </div>);
            })}
          </div>

          {/* Step 1: Type */}
          {screen==="type" && (
            <div style={{ background:"white", borderRadius:18, padding:28, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontSize:16, fontWeight:800, marginBottom:6 }}>What kind of feedback?</h3>
              <p style={{ color:"#8898aa", fontSize:13, marginBottom:20 }}>Select the category that best describes your feedback</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
                {FB_TYPES.map(t=>(
                  <div key={t.value} onClick={()=>setFbType(t.value)}
                    style={{ padding:20, borderRadius:14, cursor:"pointer", border:`2px solid ${fbType===t.value?t.color:"#e8e4dc"}`, background:fbType===t.value?t.color+"0d":"white", transition:"all 0.15s" }}
                    onMouseOver={e=>{e.currentTarget.style.borderColor=t.color; e.currentTarget.style.transform="translateY(-2px)";}}
                    onMouseOut={e=>{if(fbType!==t.value)e.currentTarget.style.borderColor="#e8e4dc"; e.currentTarget.style.transform="none";}}>
                    <div style={{ fontSize:28, marginBottom:8 }}>{t.icon}</div>
                    <div style={{ fontWeight:800, fontSize:14, marginBottom:4 }}>{t.label}</div>
                    <div style={{ fontSize:12, color:"#8898aa", lineHeight:1.5 }}>{t.desc}</div>
                    {fbType===t.value&&<div style={{ marginTop:10, display:"inline-flex", alignItems:"center", gap:6, background:t.color, color:"white", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:99 }}>✓ Selected</div>}
                  </div>
                ))}
              </div>
              <button onClick={()=>fbType&&setScreen("details")} disabled={!fbType}
                style={{ width:"100%", padding:"13px", background:fbType?`linear-gradient(135deg,${accent},${accent}cc)`:"#e8e4dc", color:fbType?"white":"#aaa", border:"none", borderRadius:12, fontWeight:800, fontSize:15, cursor:fbType?"pointer":"not-allowed" }}>
                Continue →
              </button>
            </div>
          )}

          {/* Step 2: Details */}
          {screen==="details" && (
            <form onSubmit={handleSubmit}>
              <div style={{ background:"white", borderRadius:18, padding:28, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22, padding:"10px 14px", background:selType?.color+"10", borderRadius:11, border:`1.5px solid ${selType?.color}33` }}>
                  <span style={{ fontSize:20 }}>{selType?.icon}</span>
                  <div><div style={{ fontWeight:700, fontSize:13, color:selType?.color }}>{selType?.label}</div><div style={{ fontSize:11, color:"#8898aa" }}>{selType?.desc}</div></div>
                  <button type="button" onClick={()=>setScreen("type")} style={{ marginLeft:"auto", background:"none", border:"none", color:"#8898aa", cursor:"pointer", fontSize:12, fontWeight:600 }}>← Change</button>
                </div>
                {error && <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10, padding:"10px 14px", marginBottom:16, fontSize:13, color:"#dc2626" }}>❌ {error}</div>}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
                  <div><label style={lbl}>Related Category</label>
                    <select value={category} onChange={e=>setCategory(e.target.value)} style={{...inp,cursor:"pointer"}}>
                      <option value="">Select category...</option>{FB_CATEGORIES.map(c=><option key={c}>{c}</option>)}
                    </select></div>
                  <div><label style={lbl}>Form Name (if specific)</label>
                    <input value={formName} onChange={e=>setFormName(e.target.value)} placeholder="e.g. Leave Application..." style={inp} onFocus={e=>e.target.style.borderColor=accent} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/></div>
                </div>
                <div style={{ marginBottom:16 }}><label style={lbl}>Subject *</label>
                  <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Brief summary of your feedback..." style={inp} onFocus={e=>e.target.style.borderColor=accent} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/></div>
                <div style={{ marginBottom:16 }}><label style={lbl}>Description *</label>
                  <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={5}
                    placeholder={fbType==="missing_form"?"Describe the form you need and what it should contain...":fbType==="bug_report"?"Describe what happened and steps to reproduce...":"Share your feedback in detail..."}
                    style={{...inp, resize:"vertical"}} onFocus={e=>e.target.style.borderColor=accent} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/></div>
                <div style={{ marginBottom:16 }}><label style={lbl}>Priority</label>
                  <div style={{ display:"flex", gap:8 }}>
                    {FB_PRIORITIES.map(p=>(
                      <button key={p.value} type="button" onClick={()=>setPriority(p.value)}
                        style={{ padding:"8px 20px", borderRadius:99, fontWeight:700, fontSize:13, cursor:"pointer", border:"1.5px solid", background:priority===p.value?p.color:"white", color:priority===p.value?"white":p.color, borderColor:p.color, transition:"all 0.15s" }}>
                        {priority===p.value?"● ":""}{p.label}
                      </button>
                    ))}
                  </div></div>
                <div style={{ marginBottom:24 }}><label style={lbl}>Overall Platform Rating (optional)</label><StarRating value={rating} onChange={setRating}/></div>
                <div style={{ display:"flex", gap:10 }}>
                  <button type="submit" disabled={loading}
                    style={{ flex:1, padding:"13px", background:loading?"#ccc":`linear-gradient(135deg,${accent},${accent}cc)`, color:"white", border:"none", borderRadius:12, fontWeight:800, fontSize:15, cursor:loading?"not-allowed":"pointer" }}>
                    {loading?"⏳ Submitting...":"🚀 Submit Feedback"}
                  </button>
                  <button type="button" onClick={()=>setScreen("type")} style={{ padding:"13px 20px", background:"white", border:"1.5px solid #e2e8f0", borderRadius:12, fontWeight:600, cursor:"pointer" }}>← Back</button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {view==="history" && (
        <div>
          {loadingH ? (
            <div style={{ background:"white", borderRadius:16, padding:"60px 20px", textAlign:"center", color:"#8898aa" }}>⏳ Loading your feedback...</div>
          ) : history.length===0 ? (
            <div style={{ background:"white", borderRadius:16, padding:"60px 20px", textAlign:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
              <div style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>No feedback submitted yet</div>
              <button onClick={()=>setView("form")} style={{ marginTop:16, padding:"10px 24px", background:`linear-gradient(135deg,${accent},${accent}cc)`, color:"white", border:"none", borderRadius:10, fontWeight:700, cursor:"pointer" }}>✏️ Submit Feedback</button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {history.map(fb=>{
                const t  = FB_TYPES.find(x=>x.value===fb.type)||FB_TYPES[4];
                const st = FB_STATUS_MAP[fb.status]||FB_STATUS_MAP.open;
                const pr = FB_PRIORITIES.find(p=>p.value===fb.priority)||FB_PRIORITIES[1];
                const isExp = expanded===fb._id;
                return (
                  <div key={fb._id} style={{ background:"white", borderRadius:16, boxShadow:"0 2px 12px rgba(0,0,0,0.06)", border:`1.5px solid ${isExp?t.color+"44":"transparent"}`, overflow:"hidden" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:14, padding:"18px 22px", cursor:"pointer" }} onClick={()=>setExpanded(isExp?null:fb._id)}>
                      <div style={{ width:44, height:44, borderRadius:12, background:t.color+"15", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{t.icon}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:700 }}>{fb.subject}</div>
                        <div style={{ display:"flex", gap:6, marginTop:5, flexWrap:"wrap" }}>
                          <span style={{ fontSize:11, fontWeight:600, color:t.color, background:t.color+"15", padding:"2px 8px", borderRadius:99 }}>{t.label}</span>
                          {fb.category&&<span style={{ fontSize:11, color:"#8898aa", background:"#f5f2ed", padding:"2px 8px", borderRadius:99 }}>{fb.category}</span>}
                          <span style={{ fontSize:11, fontWeight:700, color:pr.color, background:pr.bg, padding:"2px 8px", borderRadius:99 }}>{fb.priority} priority</span>
                        </div>
                      </div>
                      <div style={{ textAlign:"right", flexShrink:0 }}>
                        <span style={{ background:st.bg, color:st.color, fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:99, display:"block", marginBottom:4 }}>{st.label}</span>
                        <div style={{ fontSize:11, color:"#8898aa" }}>{new Date(fb.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div style={{ color:"#8898aa", fontSize:16, marginLeft:8 }}>{isExp?"▲":"▼"}</div>
                    </div>
                    {isExp && (
                      <div style={{ padding:"0 22px 20px", borderTop:"1px solid #f5f2ed" }}>
                        <div style={{ background:"#f9fafb", borderRadius:12, padding:"12px 16px", marginTop:14, fontSize:13, color:"#0d1b2a", lineHeight:1.7 }}>{fb.message}</div>
                        {fb.formName&&<div style={{ marginTop:8, fontSize:13, color:"#4a5568" }}><strong>Form:</strong> {fb.formName}</div>}
                        {fb.rating&&<div style={{ marginTop:8, fontSize:13 }}><strong>Rating:</strong> {"⭐".repeat(fb.rating)}</div>}
                        {fb.adminNote&&(
                          <div style={{ marginTop:14, background:"#eff6ff", border:"1.5px solid #bfdbfe", borderRadius:12, padding:"12px 16px" }}>
                            <div style={{ fontSize:11, fontWeight:700, color:"#1d4ed8", textTransform:"uppercase", marginBottom:6 }}>💬 Admin Response</div>
                            <div style={{ fontSize:13, color:"#1e40af", lineHeight:1.6 }}>{fb.adminNote}</div>
                          </div>
                        )}
                        {fb.status==="resolved"&&<div style={{ marginTop:12, background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#166534" }}>✅ This feedback has been resolved. Thank you for helping us improve!</div>}
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

// ── Inline FacultyDashboard ───────────────────────────────────────────────────
function FacultyDashboard({ onNavigate }) {
  const { user } = useAuth();
  const TODAY = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];
  const todayClasses = MOCK_SCHEDULE[TODAY] || MOCK_SCHEDULE["Monday"] || [];
  const hour = new Date().getHours();
  const greeting = hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";
  const quickForms = [
    { icon:"📅", label:"Casual Leave",         color:"#2563eb", bg:"#eff6ff" },
    { icon:"🚨", label:"Emergency Leave",       color:"#dc2626", bg:"#fef2f2" },
    { icon:"🎓", label:"FDP / Workshop",        color:"#7c3aed", bg:"#f5f3ff" },
    { icon:"🎤", label:"Conference",            color:"#e85d26", bg:"#fff5f0" },
    { icon:"✈️", label:"Travel Allowance",      color:"#f59e0b", bg:"#fffbeb" },
    { icon:"🚀", label:"Promotion Request",     color:"#059669", bg:"#f0fdf4" },
    { icon:"💵", label:"Salary Increment",      color:"#059669", bg:"#f0fdf4" },
    { icon:"🖥️", label:"Equipment Request",     color:"#374151", bg:"#f9fafb" },
  ];
  return (
    <div style={{ padding:"28px 32px" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:26, fontWeight:800, color:"#0d1b2a", marginBottom:4 }}>
          {greeting}, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p style={{ color:"#8898aa", fontSize:13 }}>
          {user?.designation || "Faculty"} · {user?.dept} · {user?.employeeId || ""}
        </p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:20, marginBottom:20 }}>
        {/* Today's Schedule */}
        <div style={{ background:"white", borderRadius:18, padding:24, boxShadow:"0 2px 12px rgba(13,27,42,0.06)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <h3 style={{ fontSize:15, fontWeight:700 }}>📅 Today — {TODAY}</h3>
            <button onClick={()=>onNavigate("class-schedule")}
              style={{ fontSize:12, fontWeight:600, color:"#059669", background:"#f0fdf4",
                border:"none", borderRadius:8, padding:"5px 12px", cursor:"pointer" }}>
              Full Schedule
            </button>
          </div>
          {todayClasses.length === 0 ? (
            <div style={{ textAlign:"center", padding:"30px 0", color:"#8898aa", fontSize:13 }}>
              <div style={{ fontSize:32, marginBottom:8 }}>🎉</div>No classes today!
            </div>
          ) : todayClasses.map((cls, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:14,
              padding:"12px 0", borderBottom:"1px solid #f5f2ed" }}>
              <div style={{ width:80, fontSize:11, fontWeight:700, color:"#059669", flexShrink:0 }}>{cls.time}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:600 }}>{cls.subject}</div>
                <div style={{ fontSize:11, color:"#8898aa", marginTop:2 }}>{cls.batch} · {cls.room}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Quick Apply */}
        <div style={{ background:"white", borderRadius:18, padding:24, boxShadow:"0 2px 12px rgba(13,27,42,0.06)" }}>
          <h3 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>⚡ Quick Apply</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {quickForms.map(f => (
              <div key={f.label} onClick={()=>onNavigate("browse-forms")}
                style={{ background:f.bg, borderRadius:12, padding:"12px 10px", cursor:"pointer",
                  border:`1.5px solid ${f.color}22`, transition:"all 0.15s" }}
                onMouseOver={e=>{e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseOut={e=>{e.currentTarget.style.transform="none";}}>
                <div style={{ fontSize:20, marginBottom:6 }}>{f.icon}</div>
                <div style={{ fontSize:11, fontWeight:700, color:f.color }}>{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Info row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {[
          { icon:"📝", label:"Apply for Forms", desc:"Leave, research, admin forms", key:"browse-forms", color:"#059669", bg:"#f0fdf4" },
          { icon:"📋", label:"My Requests",     desc:"Track all your submissions",  key:"my-applications", color:"#2563eb", bg:"#eff6ff" },
          { icon:"👥", label:"My Students",     desc:"View assigned students",      key:"my-students",    color:"#7c3aed", bg:"#f5f3ff" },
        ].map(item => (
          <div key={item.key} onClick={()=>onNavigate(item.key)}
            style={{ background:"white", borderRadius:16, padding:20, cursor:"pointer",
              boxShadow:"0 2px 12px rgba(13,27,42,0.06)", border:`2px solid transparent`,
              transition:"all 0.15s" }}
            onMouseOver={e=>{e.currentTarget.style.borderColor=item.color;e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseOut={e=>{e.currentTarget.style.borderColor="transparent";e.currentTarget.style.transform="none";}}>
            <div style={{ width:44,height:44,borderRadius:12,background:item.bg,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:12 }}>
              {item.icon}
            </div>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{item.label}</div>
            <div style={{ fontSize:12, color:"#8898aa" }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Inline ClassSchedule ──────────────────────────────────────────────────────
function ClassSchedule() {
  const TODAY = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];
  const DAYS  = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
  const DAY_COLORS = { Monday:"#e85d26",Tuesday:"#2563eb",Wednesday:"#7c3aed",Thursday:"#059669",Friday:"#f59e0b" };
  return (
    <div style={{ padding:"28px 32px" }}>
      <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Class Schedule</h1>
      <p style={{ color:"#8898aa", fontSize:13, marginBottom:24 }}>
        Weekly timetable — Today is <strong style={{ color:DAY_COLORS[TODAY]||"#0d1b2a" }}>{TODAY}</strong>
      </p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14 }}>
        {DAYS.map(day => {
          const classes = MOCK_SCHEDULE[day] || [];
          const isToday = day === TODAY;
          return (
            <div key={day}>
              <div style={{ fontWeight:800, fontSize:13, color:DAY_COLORS[day],
                marginBottom:10, padding:"6px 12px",
                background:(DAY_COLORS[day]||"#e85d26")+"15",
                borderRadius:8, textAlign:"center" }}>
                {day} {isToday?"⬅":""}
              </div>
              {classes.length === 0 ? (
                <div style={{ background:"white", borderRadius:12, padding:16,
                  textAlign:"center", border:"2px dashed #e8e4dc", color:"#aaa", fontSize:12 }}>
                  Free Day
                </div>
              ) : classes.map((cls, i) => (
                <div key={i} style={{ background:isToday?"#0d1b2a":"white", borderRadius:12,
                  padding:14, marginBottom:10, boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
                  borderLeft:`4px solid ${DAY_COLORS[day]||"#e85d26"}` }}>
                  <div style={{ fontSize:11, fontWeight:700, color:DAY_COLORS[day], marginBottom:6 }}>{cls.time}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:isToday?"white":"#0d1b2a", marginBottom:4 }}>{cls.subject}</div>
                  <div style={{ fontSize:10, color:isToday?"rgba(255,255,255,0.5)":"#8898aa" }}>{cls.batch} · {cls.room}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Router ────────────────────────────────────────────────────────────────────
export default function Router({ user, currentPage, onNavigate }) {
  const role = user.role;

  // Student
  if (role === "student") {
    if (currentPage === "dashboard")        return <StudentDashboard onNavigate={onNavigate}/>;
    if (currentPage === "browse-forms")     return <BrowseForms onNavigate={onNavigate}/>;
    if (currentPage === "my-applications")  return <MyApplications/>;
    if (currentPage === "academic-records") return <AcademicRecords/>;
    if (currentPage === "notifications")    return <NotificationsPage/>;
    if (currentPage === "feedback")         return <FeedbackPage/>;
  }

  // Faculty
  if (role === "faculty") {
    if (currentPage === "dashboard")        return <FacultyDashboard onNavigate={onNavigate}/>;
    if (currentPage === "browse-forms")     return <BrowseForms onNavigate={onNavigate}/>;
    if (currentPage === "my-applications")  return <MyApplications/>;
    if (currentPage === "my-students")      return <MyStudents/>;
    if (currentPage === "class-schedule")   return <ClassSchedule/>;
    if (currentPage === "notifications")    return <NotificationsPage/>;
    if (currentPage === "feedback")         return <FeedbackPage/>;
  }

  // Mentor
  if (role === "mentor") {
    if (currentPage === "dashboard")        return <GenericDashboard user={user} onNavigate={onNavigate}/>;
    if (currentPage === "pending-approvals")return <PendingApprovalsPage/>;
    if (currentPage === "history")          return <ApprovalHistory/>;
    if (currentPage === "my-students")      return <MyStudents/>;
    if (currentPage === "notifications")    return <NotificationsPage/>;
    if (currentPage === "feedback")         return <FeedbackPage/>;
  }

  // HOD
  if (role === "hod") {
    if (currentPage === "dashboard")        return <GenericDashboard user={user} onNavigate={onNavigate}/>;
    if (currentPage === "pending-approvals")return <PendingApprovalsPage/>;
    if (currentPage === "history")          return <ApprovalHistory/>;
    if (currentPage === "all-applications") return <AllApplications/>;
    if (currentPage === "reports")          return <Placeholder title="Department Reports" icon="📊"/>;
    if (currentPage === "notifications")    return <NotificationsPage/>;
    if (currentPage === "feedback")         return <FeedbackPage/>;
  }

  // College Admin
  if (role === "college_admin") {
    if (currentPage === "dashboard")        return <GenericDashboard user={user} onNavigate={onNavigate}/>;
    if (currentPage === "manage-forms")     return <ManageForms/>;
    if (currentPage === "manage-users")     return <ManageUsers/>;
    if (currentPage === "all-applications") return <AllApplications/>;
    if (currentPage === "feedback-admin")   return <FeedbackAdmin/>;
    if (currentPage === "reports")          return <Placeholder title="Reports & Analytics" icon="📊"/>;
    if (currentPage === "notifications")    return <NotificationsPage/>;
  }

  // Placement Director
  if (role === "placement_director") {
    if (currentPage === "dashboard")        return <GenericDashboard user={user} onNavigate={onNavigate}/>;
    if (currentPage === "pending-approvals")return <PendingApprovalsPage/>;
    if (currentPage === "placement-tracker")return <Placeholder title="Student Placement Tracker" icon="🎯"/>;
    if (currentPage === "reports")          return <Placeholder title="Placement Reports" icon="📊"/>;
    if (currentPage === "notifications")    return <NotificationsPage/>;
  }

  // Exam Branch
  if (role === "exam_branch") {
    return <ExamPortal currentPage={currentPage}/>;
  }

  // College Director
  if (role === "college_director") {
    if (currentPage === "dashboard")        return <GenericDashboard user={user} onNavigate={onNavigate}/>;
    if (currentPage === "pending-approvals")return <PendingApprovalsPage/>;
    if (currentPage === "all-applications") return <Placeholder title="All Applications" icon="📋"/>;
    if (currentPage === "reports")          return <Placeholder title="Institution Analytics" icon="📊"/>;
    if (currentPage === "notifications")    return <NotificationsPage/>;
  }

  return <GenericDashboard user={user} onNavigate={onNavigate}/>;
}