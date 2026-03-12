import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getApplicationsAPI, actionApplicationAPI } from "../utils/api";

const StatusBadge = ({ status }) => {
  const map = {
    approved:"#059669", pending:"#f59e0b", "in-review":"#2563eb", rejected:"#dc2626",
  };
  return (
    <span style={{background:(map[status]||"#f59e0b")+"20",color:map[status]||"#f59e0b",
      fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:99,textTransform:"capitalize"}}>
      {status==="in-review"?"In Review":status}
    </span>
  );
};

// ── Review Detail ─────────────────────────────────────────────────────────────
function ReviewDetail({ app, onBack, onDone, approverRole }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const myStep = app.steps?.find(s => s.role === approverRole && s.status === "pending");

  const handle = async (action) => {
    if (action === "reject" && !comment.trim()) {
      setError("Please add a rejection reason.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // CALLS BACKEND → updates MongoDB
      await actionApplicationAPI(app._id, action, comment);
      onDone(action);
    } catch (err) {
      setError(err.message || "Action failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const formData = app.formData instanceof Object ? Object.entries(app.formData) : [];

  return (
    <div style={{padding:"28px 32px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:800,margin:0}}>Review Application</h1>
          <p style={{color:"#8898aa",fontSize:13,marginTop:4}}>{app.appId}</p>
        </div>
        <button onClick={onBack}
          style={{padding:"8px 16px",borderRadius:10,border:"1.5px solid #e8e4dc",
            background:"white",fontSize:13,fontWeight:600,cursor:"pointer"}}>← Back</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>

          {/* Application Info */}
          <div style={{background:"white",borderRadius:16,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <div>
                <h2 style={{fontSize:18,fontWeight:800,margin:0}}>{app.formName}</h2>
                <p style={{color:"#8898aa",fontSize:13,marginTop:4}}>
                  Submitted by <strong>{app.student?.name || "Student"}</strong>
                  {app.student?.rollNo && ` (${app.student.rollNo})`}
                  {" · "}{new Date(app.submittedOn||app.createdAt).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={app.status} />
            </div>

            {/* Student's submitted form data */}
            {formData.length > 0 && (
              <>
                <h4 style={{fontSize:12,fontWeight:700,color:"#8898aa",textTransform:"uppercase",
                  letterSpacing:0.4,marginBottom:10}}>Form Details Submitted</h4>
                <div style={{background:"#f5f2ed",borderRadius:10,padding:14,marginBottom:18}}>
                  {formData.map(([k,v]) => (
                    <div key={k} style={{display:"flex",justifyContent:"space-between",
                      padding:"6px 0",borderBottom:"1px solid #e8e4dc"}}>
                      <span style={{fontSize:13,color:"#8898aa",fontWeight:500}}>{k}</span>
                      <span style={{fontSize:13,fontWeight:600,maxWidth:"60%",textAlign:"right"}}>{v||"—"}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Approval chain */}
            <h4 style={{fontSize:12,fontWeight:700,color:"#8898aa",textTransform:"uppercase",
              letterSpacing:0.4,marginBottom:12}}>Approval Chain</h4>
            {(app.steps||[]).map((s,i) => {
              const isMyStep = s.role===approverRole && s.status==="pending";
              const colors = { approved:"#059669",rejected:"#dc2626",pending:"#f59e0b",waiting:"#d1d5db" };
              return (
                <div key={i} style={{display:"flex",gap:12,marginBottom:14}}>
                  <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:11,fontWeight:700,color:"white",
                    background:colors[s.status]||"#e8e4dc",
                    border:isMyStep?"3px solid #e85d26":"none"}}>
                    {s.status==="approved"?"✓":s.status==="rejected"?"✗":i+1}
                  </div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700}}>
                      {s.name} {isMyStep?"← Your turn":""}
                    </div>
                    <div style={{fontSize:11,color:colors[s.status]||"#aaa",
                      fontWeight:500,textTransform:"capitalize",marginTop:2}}>
                      {s.status==="waiting"?"⏳ Waiting":
                       s.status==="pending"?"🔄 Under review":
                       s.status==="approved"?"✅ Approved":"❌ Rejected"}
                    </div>
                    {s.comment && (
                      <div style={{background:"#f5f2ed",borderRadius:7,padding:"5px 10px",
                        marginTop:4,fontSize:12,color:"#4a5568"}}>"{s.comment}"</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decision Panel */}
          <div style={{background:"white",borderRadius:16,padding:22,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <h3 style={{fontSize:15,fontWeight:700,marginBottom:14}}>Your Decision</h3>
            {error && (
              <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,
                padding:"10px 14px",marginBottom:14,fontSize:13,color:"#dc2626"}}>
                ❌ {error}
              </div>
            )}
            <textarea
              placeholder="Add your comments (required for rejection)..."
              value={comment}
              onChange={e=>setComment(e.target.value)}
              style={{width:"100%",minHeight:100,padding:"10px 12px",border:"1.5px solid #e2e8f0",
                borderRadius:10,fontSize:13,resize:"vertical",outline:"none",
                marginBottom:14,boxSizing:"border-box"}}
            />
            <div style={{display:"flex",gap:12}}>
              <button onClick={()=>handle("approve")} disabled={loading}
                style={{flex:1,padding:13,border:"none",cursor:loading?"not-allowed":"pointer",
                  background:loading?"#ccc":"linear-gradient(135deg,#059669,#047857)",
                  color:"white",borderRadius:12,fontWeight:700,fontSize:14}}>
                {loading?"Saving...":"✅ Approve"}
              </button>
              <button onClick={()=>handle("reject")} disabled={loading}
                style={{flex:1,padding:13,border:"none",cursor:loading?"not-allowed":"pointer",
                  background:loading?"#ccc":"linear-gradient(135deg,#dc2626,#b91c1c)",
                  color:"white",borderRadius:12,fontWeight:700,fontSize:14}}>
                ❌ Reject
              </button>
            </div>
          </div>
        </div>

        {/* Student profile */}
        <div style={{background:"white",borderRadius:14,padding:20,
          boxShadow:"0 2px 12px rgba(0,0,0,0.06)",height:"fit-content"}}>
          <h4 style={{fontSize:13,fontWeight:700,marginBottom:14}}>Student Profile</h4>
          <div style={{textAlign:"center",marginBottom:16}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:"#e85d26",
              color:"white",display:"flex",alignItems:"center",justifyContent:"center",
              fontWeight:800,fontSize:18,margin:"0 auto 8px"}}>
              {(app.student?.name||"S").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)}
            </div>
            <div style={{fontSize:14,fontWeight:700}}>{app.student?.name}</div>
            <div style={{fontSize:12,color:"#8898aa"}}>{app.student?.rollNo}</div>
          </div>
          {[
            ["Department",  app.student?.dept || app.dept],
            ["Form",        app.formName],
            ["Submitted",   new Date(app.submittedOn||app.createdAt).toLocaleDateString()],
            ["Category",    app.category||"—"],
          ].map(([k,v])=>(
            <div key={k} style={{marginBottom:10}}>
              <div style={{fontSize:11,color:"#8898aa",fontWeight:600,textTransform:"uppercase"}}>{k}</div>
              <div style={{fontSize:13,fontWeight:600}}>{v}</div>
            </div>
          ))}
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

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // FETCH PENDING APPLICATIONS FROM BACKEND for this role
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
    // Reload list from DB after action
    load();
    setTimeout(() => setLastDone(null), 3000);
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
    <div style={{padding:"28px 32px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:800,margin:0}}>Pending Approvals</h1>
          <p style={{color:"#8898aa",fontSize:13,marginTop:4}}>
            {apps.length} application{apps.length!==1?"s":""} awaiting your review
          </p>
        </div>
        <button onClick={load}
          style={{padding:"8px 16px",borderRadius:10,border:"1.5px solid #e8e4dc",
            background:"white",fontSize:13,fontWeight:600,cursor:"pointer"}}>
          🔄 Refresh
        </button>
      </div>

      {/* Success toast */}
      {lastDone && (
        <div style={{background:lastDone==="approve"?"#f0fdf4":"#fef2f2",
          border:"1.5px solid " + (lastDone==="approve"?"#bbf7d0":"#fecaca"),
          borderRadius:12,padding:"12px 18px",marginBottom:16,fontSize:14,
          color:lastDone==="approve"?"#166534":"#dc2626",fontWeight:600}}>
          {lastDone==="approve"
            ? "✅ Application approved! Student has been notified."
            : "❌ Application rejected. Student has been notified."}
        </div>
      )}

      {error && (
        <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,
          padding:"12px 16px",marginBottom:16,fontSize:13,color:"#dc2626"}}>
          ❌ {error}
        </div>
      )}

      {loading ? (
        <div style={{background:"white",borderRadius:16,padding:"60px 20px",
          textAlign:"center",color:"#8898aa",fontSize:14,
          boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
          Loading from database...
        </div>
      ) : apps.length===0 ? (
        <div style={{background:"white",borderRadius:16,padding:"60px 20px",
          textAlign:"center",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
          <div style={{fontSize:48,marginBottom:12}}>🎉</div>
          <div style={{fontSize:16,fontWeight:700,marginBottom:4}}>All caught up!</div>
          <div style={{fontSize:13,color:"#8898aa"}}>No pending approvals at this time.</div>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {apps.map(app=>(
            <div key={app._id}
              style={{background:"white",borderRadius:14,padding:"18px 22px",
                boxShadow:"0 2px 12px rgba(0,0,0,0.06)",display:"flex",
                alignItems:"center",gap:14,transition:"all 0.15s",
                border:"1px solid transparent"}}
              onMouseOver={e=>{e.currentTarget.style.boxShadow="0 8px 24px rgba(13,27,42,0.1)";
                e.currentTarget.style.borderColor="#e85d2630";}}
              onMouseOut={e=>{e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.06)";
                e.currentTarget.style.borderColor="transparent";}}>
              <div style={{width:46,height:46,borderRadius:12,background:"#fff5f0",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                {app.icon||"📋"}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700}}>{app.formName}</div>
                <div style={{fontSize:12,color:"#8898aa",marginTop:2}}>
                  {app.student?.name} · {app.student?.rollNo} · {app.student?.dept||app.dept}
                </div>
                <div style={{fontSize:11,color:"#e85d26",fontWeight:600,marginTop:4}}>
                  Step: {app.steps?.find(s=>s.role===user.role&&s.status==="pending")?.name||"Review"}
                </div>
              </div>
              <div style={{textAlign:"right",marginRight:10}}>
                <div style={{fontSize:11,color:"#8898aa"}}>
                  {new Date(app.submittedOn||app.createdAt).toLocaleDateString()}
                </div>
                <div style={{marginTop:4}}><StatusBadge status={app.status} /></div>
              </div>
              <button onClick={()=>setSelected(app)}
                style={{padding:"8px 18px",borderRadius:10,border:"1.5px solid #e85d26",
                  background:"#fff5f0",fontSize:13,fontWeight:700,cursor:"pointer",color:"#e85d26"}}>
                Review →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}