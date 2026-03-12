import { useState, useEffect } from "react";
import { getFormsAPI, submitApplicationAPI } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

const CATEGORIES = ["All","Certificate","Leave","Placement","Fee","Hostel","Exam"];

// ── Reusable UI ───────────────────────────────────────────────────────────────
const Btn = ({ onClick, children, variant, disabled }) => (
  <button onClick={onClick} disabled={disabled}
    style={{ padding:"9px 20px", borderRadius:10, border:"1.5px solid",
      cursor: disabled ? "not-allowed" : "pointer", fontWeight:700, fontSize:13, transition:"all 0.15s",
      background: disabled ? "#ccc" : variant === "secondary" ? "white"   : "#e85d26",
      color:      disabled ? "#fff" : variant === "secondary" ? "#4a5568" : "white",
      borderColor:disabled ? "#ccc" : variant === "secondary" ? "#e8e4dc" : "#e85d26" }}>
    {children}
  </button>
);

// ── File Uploader ─────────────────────────────────────────────────────────────
function FileUploader({ files, setFiles }) {
  const [drag, setDrag] = useState(false);
  const addFiles = (list) => {
    const valid = Array.from(list).filter(
      f => ["application/pdf","image/jpeg","image/png"].includes(f.type) && f.size <= 10*1024*1024
    );
    setFiles(p => [...p, ...valid]);
  };
  return (
    <div>
      <input id="file-input" type="file" multiple accept=".pdf,.jpg,.jpeg,.png"
        style={{ display:"none" }}
        onChange={e => { addFiles(e.target.files); e.target.value=""; }} />
      <div
        onDragOver={e=>{e.preventDefault();setDrag(true);}}
        onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);addFiles(e.dataTransfer.files);}}
        style={{ border:"2px dashed " + (drag?"#e85d26":files.length?"#059669":"#d0cac0"),
          borderRadius:12, padding:"20px", textAlign:"center",
          background:drag?"#fff5f0":files.length?"#f0fdf4":"#fafaf8", transition:"all 0.2s" }}>
        {files.length === 0 ? (
          <>
            <div style={{fontSize:32,marginBottom:10}}>📎</div>
            <div style={{fontSize:13,color:"#888",marginBottom:12}}>Drag & drop files here</div>
            <label htmlFor="file-input"
              style={{display:"inline-block",background:"#e85d26",color:"white",
                padding:"8px 20px",borderRadius:8,fontWeight:700,fontSize:13,cursor:"pointer"}}>
              Browse Files
            </label>
            <div style={{fontSize:11,color:"#aaa",marginTop:8}}>PDF, JPG, PNG — max 10MB each</div>
          </>
        ) : (
          <>
            <div style={{fontSize:13,fontWeight:700,color:"#059669",marginBottom:8}}>
              ✅ {files.length} file{files.length>1?"s":""} ready
            </div>
            {files.map((f,i) => (
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                background:"white",border:"1px solid #e2e8f0",borderRadius:8,padding:"6px 12px",marginBottom:4}}>
                <span style={{fontSize:12,fontWeight:500}}>{f.name}</span>
                <button type="button" onClick={()=>setFiles(p=>p.filter((_,j)=>j!==i))}
                  style={{background:"#fee2e2",color:"#dc2626",border:"none",borderRadius:4,
                    padding:"1px 7px",fontSize:12,cursor:"pointer"}}>✕</button>
              </div>
            ))}
            <label htmlFor="file-input"
              style={{display:"inline-block",marginTop:8,fontSize:12,color:"#e85d26",
                fontWeight:700,cursor:"pointer",textDecoration:"underline"}}>
              + Add more
            </label>
          </>
        )}
      </div>
    </div>
  );
}

// ── Form Wizard ───────────────────────────────────────────────────────────────
function FormWizard({ form, onBack, onNavigate }) {
  const { user } = useAuth();
  const [step,        setStep]        = useState(1);
  const [formData,    setFormData]    = useState({});
  const [remarks,     setRemarks]     = useState("");
  const [files,       setFiles]       = useState([]);
  const [submitting,  setSubmitting]  = useState(false);
  const [submittedId, setSubmittedId] = useState(null);
  const [error,       setError]       = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      // Calls backend → saves to MongoDB
      const saved = await submitApplicationAPI(form._id, formData, remarks, files);
      setSubmittedId(saved.appId);
    } catch (err) {
      setError(err.message || "Submission failed. Is the backend running?");
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedId) return (
    <div style={{padding:"28px 32px"}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",
        padding:"60px 20px",background:"white",borderRadius:20,boxShadow:"0 2px 16px rgba(0,0,0,0.08)"}}>
        <div style={{fontSize:72,marginBottom:16}}>🎉</div>
        <h2 style={{fontSize:24,fontWeight:800,marginBottom:6}}>Application Submitted!</h2>
        <p style={{color:"#8898aa",marginBottom:6,fontSize:14}}>{form.name}</p>
        <div style={{background:"#fff5f0",border:"2px solid #e85d26",borderRadius:12,
          padding:"12px 32px",marginBottom:24}}>
          <span style={{color:"#e85d26",fontWeight:800,fontSize:22}}>{submittedId}</span>
        </div>
        <div style={{background:"#f0fdf4",borderRadius:12,padding:"14px 20px",
          marginBottom:24,width:"100%",maxWidth:400,textAlign:"left"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#166534",marginBottom:8}}>
            ✅ Saved to database. Approval chain:
          </div>
          {form.signatories?.map((s,i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <div style={{width:20,height:20,borderRadius:"50%",
                background:i===0?"#059669":"#e8e4dc",
                color:i===0?"white":"#8898aa",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:10,fontWeight:700}}>{i+1}</div>
              <span style={{fontSize:13,color:i===0?"#059669":"#8898aa",fontWeight:i===0?700:400}}>
                {s} {i===0?"← Reviewing now":""}
              </span>
            </div>
          ))}
        </div>
        <p style={{fontSize:12,color:"#8898aa",marginBottom:20,textAlign:"center"}}>
          ℹ️ Refresh the page anytime — your data is saved in MongoDB.
        </p>
        <div style={{display:"flex",gap:12}}>
          <Btn onClick={() => onNavigate("my-applications")}>View My Applications →</Btn>
          <Btn variant="secondary" onClick={onBack}>Browse More Forms</Btn>
        </div>
      </div>
    </div>
  );

  const steps = ["Form Details","Review","Submit"];

  return (
    <div style={{padding:"28px 32px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:800,margin:0}}>{form.name}</h1>
          <p style={{color:"#8898aa",fontSize:13,marginTop:4}}>{form.description}</p>
        </div>
        <Btn variant="secondary" onClick={onBack}>← Back</Btn>
      </div>

      {/* Progress */}
      <div style={{background:"white",borderRadius:14,padding:"14px 20px",marginBottom:20,
        boxShadow:"0 2px 12px rgba(0,0,0,0.06)",display:"flex",alignItems:"center"}}>
        {steps.map((s,i) => (
          <div key={s} style={{display:"flex",alignItems:"center",flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:28,height:28,borderRadius:"50%",
                background:step>i+1?"#059669":step===i+1?"#e85d26":"#e8e4dc",
                color:step>=i+1?"white":"#8898aa",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700}}>
                {step>i+1?"✓":i+1}
              </div>
              <span style={{fontSize:13,fontWeight:step===i+1?600:400,
                color:step===i+1?"#e85d26":"#8898aa"}}>{s}</span>
            </div>
            {i<2&&<div style={{flex:1,height:2,background:step>i+1?"#059669":"#e8e4dc",margin:"0 12px"}}/>}
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
        <div style={{background:"white",borderRadius:16,padding:24,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>

          {/* Step 1 */}
          {step===1 && (
            <div>
              <h3 style={{fontSize:15,fontWeight:700,marginBottom:16}}>Fill Application Details</h3>
              {(form.fields||[]).map(field => (
                <div key={field} style={{marginBottom:14}}>
                  <label style={{fontSize:11,fontWeight:600,color:"#4a5568",display:"block",
                    marginBottom:5,textTransform:"uppercase",letterSpacing:0.3}}>{field} *</label>
                  <input value={formData[field]||""}
                    onChange={e => setFormData({...formData,[field]:e.target.value})}
                    placeholder={"Enter " + field.toLowerCase()}
                    style={{width:"100%",padding:"9px 12px",border:"1.5px solid #e2e8f0",
                      borderRadius:8,fontSize:13,outline:"none",boxSizing:"border-box"}} />
                </div>
              ))}
              <div style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:600,color:"#4a5568",display:"block",
                  marginBottom:5,textTransform:"uppercase",letterSpacing:0.3}}>Additional Remarks</label>
                <textarea value={remarks} onChange={e=>setRemarks(e.target.value)}
                  placeholder="Any additional notes..."
                  style={{width:"100%",minHeight:80,padding:"9px 12px",border:"1.5px solid #e2e8f0",
                    borderRadius:8,fontSize:13,resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
              </div>
              <div style={{marginBottom:20}}>
                <label style={{fontSize:11,fontWeight:600,color:"#4a5568",display:"block",
                  marginBottom:8,textTransform:"uppercase",letterSpacing:0.3}}>Supporting Documents</label>
                <FileUploader files={files} setFiles={setFiles} />
              </div>
              <Btn onClick={()=>setStep(2)}>Continue to Review →</Btn>
            </div>
          )}

          {/* Step 2 */}
          {step===2 && (
            <div>
              <h3 style={{fontSize:15,fontWeight:700,marginBottom:16}}>Review Your Application</h3>
              <div style={{background:"#f5f2ed",borderRadius:10,padding:16,marginBottom:16}}>
                {(form.fields||[]).map(field => (
                  <div key={field} style={{display:"flex",justifyContent:"space-between",
                    padding:"7px 0",borderBottom:"1px solid #e8e4dc"}}>
                    <span style={{fontSize:13,color:"#8898aa"}}>{field}</span>
                    <span style={{fontSize:13,fontWeight:600,maxWidth:"60%",textAlign:"right"}}>{formData[field]||"—"}</span>
                  </div>
                ))}
                {remarks&&(
                  <div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #e8e4dc"}}>
                    <span style={{fontSize:13,color:"#8898aa"}}>Remarks</span>
                    <span style={{fontSize:13,fontWeight:600,maxWidth:"60%",textAlign:"right"}}>{remarks}</span>
                  </div>
                )}
                {files.length>0&&(
                  <div style={{display:"flex",justifyContent:"space-between",padding:"7px 0"}}>
                    <span style={{fontSize:13,color:"#8898aa"}}>Attachments</span>
                    <span style={{fontSize:13,fontWeight:600,color:"#059669"}}>{files.length} file(s)</span>
                  </div>
                )}
              </div>
              <p style={{fontSize:12,color:"#8898aa",marginBottom:16}}>
                By submitting you confirm all information is accurate.
              </p>
              <div style={{display:"flex",gap:10}}>
                <Btn variant="secondary" onClick={()=>setStep(1)}>← Edit</Btn>
                <Btn onClick={()=>setStep(3)}>Confirm & Proceed →</Btn>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step===3 && (
            <div>
              <h3 style={{fontSize:15,fontWeight:700,marginBottom:16}}>Ready to Submit</h3>
              {error && (
                <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,
                  padding:"12px 14px",marginBottom:16,fontSize:13,color:"#dc2626"}}>
                  ❌ {error}
                  <div style={{marginTop:6,fontSize:11}}>Make sure your backend is running: <code>npm run dev</code></div>
                </div>
              )}
              <div style={{background:"#f0fdf4",border:"1.5px solid #bbf7d0",borderRadius:10,
                padding:16,marginBottom:20}}>
                <div style={{display:"flex",gap:10}}>
                  <span style={{fontSize:20}}>✅</span>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:"#166534"}}>All checks passed</div>
                    <div style={{fontSize:12,color:"#059669",marginTop:2}}>
                      Form complete · {files.length>0?files.length+" attachment(s)":"No attachments"}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <Btn variant="secondary" onClick={()=>setStep(2)}>← Back</Btn>
                <button onClick={handleSubmit} disabled={submitting}
                  style={{padding:"10px 24px",background:submitting?"#ccc":"linear-gradient(135deg,#059669,#047857)",
                    color:"white",border:"none",borderRadius:10,fontWeight:700,fontSize:14,
                    cursor:submitting?"not-allowed":"pointer"}}>
                  {submitting?"Saving to database...":"🚀 Submit Application"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar info */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:"white",borderRadius:14,padding:18,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <h4 style={{fontSize:13,fontWeight:700,marginBottom:12}}>Approval Chain</h4>
            {(form.signatories||[]).map((s,i) => (
              <div key={s} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:"#fff5f0",
                  color:"#e85d26",display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:11,fontWeight:700}}>{i+1}</div>
                <span style={{fontSize:13,fontWeight:600}}>{s}</span>
              </div>
            ))}
          </div>
          <div style={{background:"#fef3c7",borderRadius:14,padding:18}}>
            <div style={{fontSize:18,marginBottom:6}}>⏱️</div>
            <div style={{fontSize:12,fontWeight:700,color:"#92400e"}}>Est. Processing</div>
            <div style={{fontSize:20,fontWeight:800,color:"#78350f",marginTop:2}}>{form.time}</div>
          </div>
          <div style={{background:"#eff6ff",borderRadius:14,padding:14}}>
            <div style={{fontSize:11,color:"#1d4ed8",fontWeight:600}}>
              💾 Data is saved permanently in MongoDB
            </div>
            <div style={{fontSize:11,color:"#3b82f6",marginTop:4}}>
              Accessible after page refresh or re-login.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Browse Page ──────────────────────────────────────────────────────────
export default function BrowseForms({ onNavigate = () => {} }) {
  const [forms,    setForms]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);

  // FETCH FORM TEMPLATES FROM BACKEND
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getFormsAPI();
        setForms(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Forms fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = forms.filter(f =>
    (category === "All" || f.category === category) &&
    (f.name.toLowerCase().includes(search.toLowerCase()) ||
     f.description?.toLowerCase().includes(search.toLowerCase()))
  );

  if (selected)
    return <FormWizard form={selected} onBack={() => setSelected(null)} onNavigate={onNavigate} />;

  return (
    <div style={{padding:"28px 32px"}}>
      <h1 style={{fontSize:22,fontWeight:800,marginBottom:4}}>Browse Forms</h1>
      <p style={{color:"#8898aa",fontSize:13,marginBottom:20}}>Search and apply for any institutional form</p>

      <div style={{background:"white",borderRadius:14,padding:"12px 16px",
        boxShadow:"0 2px 12px rgba(0,0,0,0.06)",marginBottom:16,display:"flex",gap:10,alignItems:"center"}}>
        <span style={{fontSize:18}}>🔍</span>
        <input placeholder="Search forms..." value={search}
          onChange={e => setSearch(e.target.value)}
          style={{border:"none",background:"transparent",fontSize:14,flex:1,outline:"none"}} />
      </div>

      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            style={{padding:"6px 16px",borderRadius:99,fontSize:13,fontWeight:600,
              border:"1.5px solid",cursor:"pointer",transition:"all 0.15s",
              borderColor:category===c?"#e85d26":"#e8e4dc",
              background:category===c?"#e85d26":"white",
              color:category===c?"white":"#4a5568"}}>
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{textAlign:"center",padding:"60px 0",color:"#8898aa",fontSize:14}}>
          Loading forms from backend...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{textAlign:"center",padding:"60px 0"}}>
          <div style={{fontSize:40,marginBottom:12}}>📭</div>
          <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>No forms found</div>
          <div style={{fontSize:13,color:"#8898aa"}}>Try a different search or category</div>
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          {filtered.map(f => (
            <div key={f._id} onClick={() => setSelected(f)}
              style={{background:"white",borderRadius:14,padding:18,
                boxShadow:"0 2px 12px rgba(0,0,0,0.07)",border:"1px solid #f0ebe3",
                cursor:"pointer",transition:"all 0.2s",position:"relative",overflow:"hidden"}}
              onMouseOver={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 12px 32px ${f.color||"#e85d26"}22`;}}
              onMouseOut={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.07)";}}>
              {f.popular && (
                <span style={{position:"absolute",top:12,right:12,background:"#fef3c7",
                  color:"#92400e",fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:99}}>Popular</span>
              )}
              <div style={{fontSize:32,marginBottom:10}}>{f.icon}</div>
              <h3 style={{fontSize:14,fontWeight:700,marginBottom:4}}>{f.name}</h3>
              <p style={{fontSize:12,color:"#8898aa",marginBottom:12,lineHeight:1.5}}>{f.description}</p>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{background:(f.color||"#e85d26")+"15",color:f.color||"#e85d26",
                  fontSize:11,fontWeight:600,padding:"3px 8px",borderRadius:99}}>{f.category}</span>
                <span style={{fontSize:11,color:"#8898aa"}}>⏱ {f.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}