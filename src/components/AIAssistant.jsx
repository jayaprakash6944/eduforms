import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const ACCENT = "#e85d26";
const BASE   = "http://localhost:5000/api";

// ── Call YOUR backend (no Anthropic key needed in frontend) ───────────────────
async function callAI(messages) {
  const token = localStorage.getItem("token");
  const res   = await fetch(`${BASE}/ai/chat`, {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": "Bearer " + token,
    },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error("Backend AI error: " + res.status);
  return res.json();
}

// ── Voice Input ───────────────────────────────────────────────────────────────
function useVoice(onTranscript) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);
  const start = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice input not supported. Use Chrome."); return; }
    const rec = new SR();
    rec.continuous     = false;
    rec.interimResults = false;
    rec.lang           = "en-IN";
    rec.onresult = e => { onTranscript(e.results[0][0].transcript); setListening(false); };
    rec.onerror  = () => setListening(false);
    rec.onend    = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };
  const stop = () => { recRef.current?.stop(); setListening(false); };
  return { listening, start, stop };
}

// ── Typing dots animation ─────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display:"flex", gap:8, marginBottom:12, alignItems:"center" }}>
      <div style={{ width:30, height:30, borderRadius:"50%", background:ACCENT,
        color:"white", display:"flex", alignItems:"center",
        justifyContent:"center", fontSize:14, flexShrink:0 }}>🤖</div>
      <div style={{ background:"white", borderRadius:"14px 14px 14px 4px",
        padding:"10px 14px", boxShadow:"0 2px 8px rgba(0,0,0,0.08)",
        display:"flex", gap:5, alignItems:"center" }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width:7, height:7, borderRadius:"50%",
            background:ACCENT, opacity:0.7,
            animation:`edubot-bounce 1.2s ${i*0.2}s infinite` }}/>
        ))}
      </div>
    </div>
  );
}

// ── Message bubble ────────────────────────────────────────────────────────────
function Bubble({ msg, onApplyForm }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display:"flex", justifyContent:isUser?"flex-end":"flex-start",
      marginBottom:12, alignItems:"flex-end", gap:8 }}>
      {!isUser && (
        <div style={{ width:30, height:30, borderRadius:"50%", background:ACCENT,
          color:"white", display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:14, flexShrink:0 }}>🤖</div>
      )}
      <div style={{ maxWidth:"78%", display:"flex", flexDirection:"column",
        alignItems:isUser?"flex-end":"flex-start", gap:8 }}>
        <div style={{
          background:isUser?"#0d1b2a":msg.error?"#fef2f2":"white",
          color:isUser?"white":msg.error?"#dc2626":"#0d1b2a",
          borderRadius:isUser?"14px 14px 4px 14px":"14px 14px 14px 4px",
          padding:"10px 14px", fontSize:13, lineHeight:1.6,
          boxShadow:"0 2px 8px rgba(0,0,0,0.08)",
        }}>
          {msg.content}
        </div>

        {/* Suggested form card */}
        {msg.suggestedForm && (
          <div style={{ background:"#fff5f0", border:`1.5px solid ${ACCENT}44`,
            borderRadius:12, padding:"12px 14px", width:"100%",
            boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize:10, fontWeight:800, color:ACCENT,
              textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>
              📋 Suggested Form
            </div>
            <div style={{ fontWeight:800, fontSize:14, color:"#0d1b2a", marginBottom:8 }}>
              {msg.suggestedForm}
            </div>
            {msg.fillData && Object.keys(msg.fillData).length > 0 && (
              <div style={{ background:"#f9fafb", borderRadius:8, padding:"8px 10px",
                marginBottom:10, border:"1px solid #f0ebe3" }}>
                {Object.entries(msg.fillData).map(([k,v]) => (
                  <div key={k} style={{ fontSize:11, color:"#4a5568",
                    marginBottom:3, display:"flex", gap:6 }}>
                    <span style={{ fontWeight:700, color:"#374151" }}>{k}:</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => onApplyForm(msg.suggestedForm, msg.fillData)}
              style={{ background:`linear-gradient(135deg,${ACCENT},${ACCENT}cc)`,
                color:"white", border:"none", borderRadius:8,
                padding:"8px 16px", fontSize:12, fontWeight:700,
                cursor:"pointer", width:"100%",
                boxShadow:`0 2px 8px ${ACCENT}33` }}>
              Apply This Form →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Quick prompts ─────────────────────────────────────────────────────────────
const QUICK = [
  
  "I need leave application",
  "I want on duty request",
  "I need medical leave certificate",
  "Certificate Request Form",

  "I want internship permission",
  "I want internship NOC",
  "I want placement registration",
  "I want industrial visit form",

  "Need bonafide certificate",
  "Need transfer certificate",
  "Need character certificate",
  "I want ID card replacement",
  "I want bus pass application",
  "I want scholarship application",

  "I want fee payment request",
  "I want course registration",

  "I want hostel admission",
  "I need hostel leave request",

  "I want to participate in event",
  "I want workshop registration",
  "I want club activity form",
  "I need research lab access",

  "I want library membership",
  "I want book issue request",

  "Apply for revaluation",
  "Apply for supplementary exam",
  "I want exam registration",

  "I want casual leave",
  "I want medical leave (faculty)",
  "I want on duty request (faculty)",

  "I want to submit internal marks",
  "I want to submit attendance",
  "I want to upload course plan",
  "I want project evaluation form",
  "I want guest lecture arrangement",

  "I want to submit research proposal",

  "I want equipment request",
  "I want lab resource request",
  "I want travel allowance claim",
  "I want reimbursement",

  "I want workshop/FDP permission",
  "I want conference participation",

  "I want mark correction",
  "I want hall ticket",
  "I want duplicate mark memo",
  "I want transcript",
  "I want consolidated marks memo",
  "I want degree certificate"

  
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function AIAssistant({ forms = [], onNavigateToForm }) {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "there";

  const [open,     setOpen]     = useState(false);
  const [input,    setInput]    = useState("");
  const [messages, setMessages] = useState([{
    role:"assistant",
    content:`Hi ${firstName}! 👋 I'm EduBot. Tell me what you need — I'll find the right form and auto-fill it. You can also tap 🎤 to speak.`,
    id: 0,
  }]);
  const [loading,  setLoading]  = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const { listening, start: startVoice } = useVoice((transcript) => {
    setInput(transcript);
    setTimeout(() => handleSend(transcript), 400);
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, loading]);

  const handleSend = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg = { role:"user", content:msg, id:Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = [...messages, userMsg]
        .filter(m => m.role === "user" || m.role === "assistant")
        .map(m => ({ role:m.role, content:m.content }));

      const result = await callAI(history);

      setMessages(prev => [...prev, {
        role:          "assistant",
        content:       result.message || "I found something for you!",
        suggestedForm: result.suggestedForm || null,
        fillData:      result.fillData      || null,
        id:            Date.now(),
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role:    "assistant",
        content: "Sorry, I couldn't connect right now. Make sure your backend is running (npm run dev) and try again.",
        error:   true,
        id:      Date.now(),
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleApplyForm = (formName, fillData) => {
    const form = forms.find(f =>
      f.name?.toLowerCase().includes(formName?.toLowerCase().split(" ")[0]) ||
      formName?.toLowerCase().includes(f.name?.toLowerCase().split(" ")[0])
    );

    // Save prefill + user data to sessionStorage
    const prefillData = {
      ...(user?.name     ? { "Student Name": user.name }     : {}),
      ...(user?.rollNo   ? { "Roll Number":  user.rollNo }   : {}),
      ...(user?.dept     ? { "Branch / Department": user.dept, "Department": user.dept } : {}),
      ...(user?.year     ? { "Year": user.year }             : {}),
      ...(fillData       ? fillData                          : {}),
    };

    sessionStorage.setItem("ai_prefill", JSON.stringify({
      formId:      form?._id     || null,
      formName:    form?.name    || formName,
      prefillData,
    }));

    onNavigateToForm(form || null, prefillData, formName);
    setOpen(false);
  };

  // ── Minimized button ──────────────────────────────────────────────────────
  if (!open) return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9000 }}>
      <button onClick={() => setOpen(true)}
        style={{ width:58, height:58, borderRadius:"50%",
          background:`linear-gradient(135deg,${ACCENT},#c94d1a)`,
          color:"white", border:"none", cursor:"pointer", fontSize:24,
          boxShadow:`0 8px 24px ${ACCENT}55`,
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"transform 0.2s" }}
        onMouseOver={e => e.currentTarget.style.transform="scale(1.1)"}
        onMouseOut={e  => e.currentTarget.style.transform="scale(1)"}>
        🤖
      </button>
      <div style={{ position:"absolute", top:-6, right:-4,
        background:"#059669", color:"white", fontSize:9,
        fontWeight:800, padding:"2px 6px", borderRadius:99,
        letterSpacing:0.3, whiteSpace:"nowrap", border:"2px solid white" }}>
        AI
      </div>
    </div>
  );

  // ── Open chat panel ───────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes edubot-bounce {
          0%,100% { transform:translateY(0); }
          50% { transform:translateY(-5px); }
        }
      `}</style>

      <div style={{ position:"fixed", bottom:24, right:24, zIndex:9000,
        width:370, display:"flex", flexDirection:"column",
        background:"white", borderRadius:20,
        boxShadow:"0 24px 80px rgba(13,27,42,0.25), 0 0 0 1px rgba(0,0,0,0.06)",
        maxHeight:"85vh", overflow:"hidden" }}>

        {/* Header */}
        <div style={{ background:`linear-gradient(135deg,#0d1b2a,${ACCENT})`,
          padding:"14px 18px", display:"flex", alignItems:"center", gap:10,
          flexShrink:0 }}>
          <div style={{ width:38, height:38, borderRadius:"50%",
            background:"rgba(255,255,255,0.15)", border:"2px solid rgba(255,255,255,0.3)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
            🤖
          </div>
          <div style={{ flex:1 }}>
            <div style={{ color:"white", fontWeight:800, fontSize:14 }}>EduBot AI Assistant</div>
            <div style={{ color:"rgba(255,255,255,0.6)", fontSize:11 }}>
              {loading ? "⏳ Thinking..." : "Ask me anything about forms"}
            </div>
          </div>
          <button onClick={() => setOpen(false)}
            style={{ background:"rgba(255,255,255,0.15)", border:"none",
              color:"white", borderRadius:8, width:28, height:28,
              cursor:"pointer", fontSize:14, display:"flex",
              alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:"auto", padding:"14px 12px 8px",
          minHeight:180, maxHeight:360 }}>
          {messages.map(msg => (
            <Bubble key={msg.id} msg={msg} onApplyForm={handleApplyForm}/>
          ))}
          {loading && <TypingDots/>}
          <div ref={bottomRef}/>
        </div>

        {/* Quick prompts — only on first open */}
        {messages.length <= 2 && !loading && (
          <div style={{ padding:"0 12px 8px", flexShrink:0 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#8898aa",
              textTransform:"uppercase", letterSpacing:0.4, marginBottom:6 }}>
              Try asking
            </div>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
              {QUICK.map(p => (
                <button key={p} onClick={() => handleSend(p)}
                  style={{ padding:"5px 10px", borderRadius:99, fontSize:11,
                    fontWeight:600, border:`1.5px solid ${ACCENT}44`,
                    background:"#fff5f0", color:ACCENT, cursor:"pointer",
                    transition:"all 0.15s" }}
                  onMouseOver={e=>{e.currentTarget.style.background=ACCENT;e.currentTarget.style.color="white";}}
                  onMouseOut={e=>{e.currentTarget.style.background="#fff5f0";e.currentTarget.style.color=ACCENT;}}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input row */}
        <div style={{ padding:"8px 12px 14px", borderTop:"1px solid #f0ebe3",
          display:"flex", gap:8, alignItems:"flex-end", flexShrink:0 }}>
          <div style={{ flex:1, position:"relative" }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
              }}
              placeholder="Type or speak your request..."
              rows={1}
              style={{ width:"100%", padding:"10px 40px 10px 12px",
                border:`1.5px solid ${input?ACCENT:"#e2e8f0"}`,
                borderRadius:12, fontSize:13, outline:"none",
                resize:"none", boxSizing:"border-box",
                lineHeight:1.5, fontFamily:"inherit",
                transition:"border-color 0.2s",
                maxHeight:72, overflowY:"auto" }}
            />
            <button onClick={listening ? undefined : startVoice}
              title={listening ? "Listening..." : "Speak your request"}
              style={{ position:"absolute", right:8, top:"50%",
                transform:"translateY(-50%)", background:"none",
                border:"none", cursor:"pointer", fontSize:17, padding:0,
                color:listening?"#dc2626":ACCENT }}>
              {listening ? "🔴" : "🎤"}
            </button>
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            style={{ width:40, height:40, borderRadius:"50%", border:"none",
              background:(!input.trim()||loading)?"#e8e4dc":ACCENT,
              color:"white", cursor:(!input.trim()||loading)?"not-allowed":"pointer",
              fontSize:16, flexShrink:0,
              boxShadow:(!input.trim()||loading)?"none":`0 2px 8px ${ACCENT}44`,
              transition:"all 0.15s", display:"flex",
              alignItems:"center", justifyContent:"center" }}>
            ➤
          </button>
        </div>
      </div>
    </>
  );
}