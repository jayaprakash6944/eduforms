// ─────────────────────────────────────────────────────────────────────────────
// PredictiveWidget.jsx — Shows approval probability + avg time + duplicate check
// Used inside BrowseForms FormWizard sidebar
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";

const BASE = "http://localhost:5000/api";

export default function PredictiveWidget({ form }) {
  const [prediction, setPrediction] = useState(null);
  const [duplicate,  setDuplicate]  = useState(null);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    if (!form?._id && !form?.name) return;
    const token = localStorage.getItem("token");
    const headers = { Authorization: "Bearer " + token };

    Promise.all([
      fetch(`${BASE}/applications/predict?formName=${encodeURIComponent(form.name)}`, { headers }).then(r=>r.json()),
      fetch(`${BASE}/applications/check-duplicate?formTemplateId=${form._id}`, { headers }).then(r=>r.json()),
    ]).then(([pred, dup]) => {
      setPrediction(pred);
      setDuplicate(dup);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [form?._id, form?.name]);

  if (loading) return (
    <div style={{ background:"white", borderRadius:14, padding:18,
      boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ fontSize:12, color:"#8898aa", textAlign:"center" }}>
        🤖 Analyzing...
      </div>
    </div>
  );

  const prob = prediction?.probability;
  const days = prediction?.avgDays;
  const hasPending = duplicate?.hasPending;
  const hasRecent  = duplicate?.hasRecent;

  const probColor = prob === null ? "#8898aa"
    : prob >= 75 ? "#059669"
    : prob >= 50 ? "#f59e0b" : "#dc2626";

  const probBg = prob === null ? "#f9fafb"
    : prob >= 75 ? "#f0fdf4"
    : prob >= 50 ? "#fffbeb" : "#fef2f2";

  const probLabel = prob === null ? "No data yet"
    : prob >= 75 ? "High chance ✅"
    : prob >= 50 ? "Moderate chance ⚠️" : "Low chance ❌";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>

      {/* Duplicate warning */}
      {(hasPending || hasRecent) && (
        <div style={{ background:"#fffbeb", border:"1.5px solid #f59e0b",
          borderRadius:12, padding:"12px 14px" }}>
          <div style={{ fontSize:11, fontWeight:800, color:"#92400e",
            textTransform:"uppercase", letterSpacing:0.3, marginBottom:6 }}>
            ⚠️ {hasPending ? "Already Pending" : "Recent Submission"}
          </div>
          <div style={{ fontSize:12, color:"#78350f", lineHeight:1.5 }}>
            {hasPending
              ? `You already have a pending application: ${duplicate.existing?.appId}`
              : `You submitted this form recently: ${duplicate.existing?.appId}`}
          </div>
          <div style={{ fontSize:11, color:"#b45309", marginTop:4, fontWeight:600 }}>
            {hasPending ? "Wait for it to be processed before re-applying." : "Are you sure you need to submit again?"}
          </div>
        </div>
      )}

      {/* Prediction card */}
      <div style={{ background:"white", borderRadius:14, padding:18,
        boxShadow:"0 2px 12px rgba(0,0,0,0.06)", border:"1px solid #f0ebe3" }}>
        <div style={{ fontSize:12, fontWeight:800, color:"#8898aa",
          textTransform:"uppercase", letterSpacing:0.3, marginBottom:12,
          display:"flex", alignItems:"center", gap:6 }}>
          🤖 AI Prediction
        </div>

        {/* Probability */}
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:6 }}>
            <span style={{ fontSize:12, color:"#4a5568" }}>Approval Probability</span>
            <span style={{ fontSize:13, fontWeight:800, color:probColor }}>
              {prob === null ? "—" : `${prob}%`}
            </span>
          </div>
          <div style={{ height:8, background:"#f5f2ed", borderRadius:99, overflow:"hidden" }}>
            <div style={{ height:"100%", borderRadius:99,
              background:probColor, transition:"width 0.6s ease",
              width:`${prob ?? 0}%` }}/>
          </div>
          <div style={{ fontSize:11, color:probColor, fontWeight:700,
            marginTop:4, background:probBg, padding:"3px 8px",
            borderRadius:99, display:"inline-block" }}>
            {probLabel}
          </div>
        </div>

        {/* Avg time */}
        <div style={{ display:"flex", justifyContent:"space-between",
          padding:"8px 0", borderTop:"1px solid #f5f2ed" }}>
          <span style={{ fontSize:12, color:"#8898aa" }}>Avg. Approval Time</span>
          <span style={{ fontSize:13, fontWeight:700, color:"#0d1b2a" }}>
            {days === null ? form?.time || "—" : `~${days} day${days !== 1 ? "s" : ""}`}
          </span>
        </div>

        {/* History count */}
        {prediction?.total > 0 && (
          <div style={{ display:"flex", justifyContent:"space-between",
            padding:"8px 0", borderTop:"1px solid #f5f2ed" }}>
            <span style={{ fontSize:12, color:"#8898aa" }}>Based on</span>
            <span style={{ fontSize:12, fontWeight:600, color:"#059669" }}>
              {prediction.total} past application{prediction.total !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {prediction?.total === 0 && (
          <div style={{ fontSize:11, color:"#8898aa", marginTop:6, textAlign:"center" }}>
            No historical data yet for this form
          </div>
        )}
      </div>
    </div>
  );
}