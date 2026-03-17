import { useState, useEffect, useCallback } from "react";

const BASE  = "http://localhost:5000/api";
const token = () => localStorage.getItem("token");

export default function AllApplications() {
  const [apps,    setApps]   = useState([]);
  const [loading, setLoad]   = useState(true);
  const [search,  setSearch] = useState("");
  const [status,  setStatus] = useState("All");
  const [selected,setSel]    = useState(null);

  const load = useCallback(async () => {
    setLoad(true);
    try {
      const res = await fetch(`${BASE}/applications`, { headers:{ Authorization:"Bearer "+token() }});
      const d   = await res.json();
      setApps(Array.isArray(d) ? d : []);
    } catch { setApps([]); }
    finally { setLoad(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const STATUS_TABS = ["All","pending","in-review","approved","rejected"];
  const STATUS_COLORS = { approved:"#059669", pending:"#f59e0b", "in-review":"#2563eb", rejected:"#dc2626" };

  const filtered = apps.filter(a =>
    (status==="All" || a.status===status) &&
    (a.formName?.toLowerCase().includes(search.toLowerCase()) ||
     a.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
     a.appId?.toLowerCase().includes(search.toLowerCase()) ||
     a.dept?.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    total:    apps.length,
    approved: apps.filter(a=>a.status==="approved").length,
    pending:  apps.filter(a=>["pending","in-review"].includes(a.status)).length,
    rejected: apps.filter(a=>a.status==="rejected").length,
  };

  if (selected) return (
    <div style={{ padding:"28px 32px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, margin:0 }}>{selected.formName}</h1>
          <p style={{ color:"#8898aa", fontSize:13, marginTop:4 }}>{selected.appId}</p>
        </div>
        <button onClick={()=>setSel(null)}
          style={{ padding:"8px 16px", borderRadius:10, border:"1.5px solid #e8e4dc",
            background:"white", fontSize:13, fontWeight:600, cursor:"pointer" }}>← Back</button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Form Data */}
          <div style={{ background:"white", borderRadius:16, padding:24, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>Submitted Form Data</h3>
            {Object.entries(selected.formData||{}).length === 0 ? (
              <div style={{ color:"#aaa", fontSize:13 }}>No form data</div>
            ) : (
              <div style={{ background:"#f9fafb", borderRadius:12, overflow:"hidden" }}>
                {Object.entries(selected.formData).map(([k,v],i)=>(
                  <div key={k} style={{ display:"flex", padding:"10px 16px",
                    background:i%2===0?"white":"#f9fafb", borderBottom:"1px solid #f0ebe3" }}>
                    <span style={{ fontSize:12, color:"#8898aa", width:"40%", fontWeight:600, textTransform:"capitalize" }}>{k}</span>
                    <span style={{ fontSize:13, fontWeight:600 }}>{v||"—"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approval Timeline */}
          <div style={{ background:"white", borderRadius:16, padding:24, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>Approval Timeline</h3>
            {(selected.steps||[]).map((s,i)=>{
              const c = s.status==="approved"?"#059669":s.status==="rejected"?"#dc2626":s.status==="pending"?"#f59e0b":"#d1d5db";
              return (
                <div key={i} style={{ display:"flex", gap:14, marginBottom:16 }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0,
                    background:c, color:"white", display:"flex",
                    alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800 }}>
                    {s.status==="approved"?"✓":s.status==="rejected"?"✗":i+1}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <span style={{ fontSize:14, fontWeight:700 }}>{s.name}</span>
                      {s.date && <span style={{ fontSize:11, color:"#8898aa" }}>{new Date(s.date).toLocaleDateString()}</span>}
                    </div>
                    <div style={{ fontSize:12, color:c, fontWeight:600, marginTop:2, textTransform:"capitalize" }}>
                      {s.status==="waiting"?"⏳ Waiting":s.status==="pending"?"🔄 Under Review":s.status==="approved"?"✅ Approved":"❌ Rejected"}
                    </div>
                    {s.comment && (
                      <div style={{ background:"#f5f2ed", borderRadius:8, padding:"6px 10px",
                        marginTop:6, fontSize:12, color:"#4a5568", borderLeft:`3px solid ${c}` }}>
                        💬 "{s.comment}"
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Attachments */}
          {selected.attachments?.length > 0 && (
            <div style={{ background:"white", borderRadius:16, padding:24, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:14 }}>Supporting Documents</h3>
              {selected.attachments.map((f,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid #f5f2ed" }}>
                  <span style={{ fontSize:24 }}>{f.mimetype==="application/pdf"?"📄":"🖼️"}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600 }}>{f.originalName||f.filename}</div>
                  </div>
                  <a href={`http://localhost:5000/uploads/${f.filename}`} target="_blank" rel="noreferrer"
                    style={{ padding:"5px 12px", borderRadius:8, background:"#f5f2ed",
                      color:"#374151", fontSize:12, fontWeight:700, textDecoration:"none" }}>
                    View ↗
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ background:"white", borderRadius:14, padding:20, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
            <h4 style={{ fontSize:12, fontWeight:800, color:"#8898aa", textTransform:"uppercase", marginBottom:14 }}>Applicant</h4>
            <div style={{ textAlign:"center", marginBottom:16 }}>
              <div style={{ width:50, height:50, borderRadius:"50%", background:"#e85d26",
                color:"white", display:"flex", alignItems:"center", justifyContent:"center",
                fontWeight:800, fontSize:18, margin:"0 auto 8px" }}>
                {(selected.student?.name||"S").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
              </div>
              <div style={{ fontWeight:700, fontSize:15 }}>{selected.student?.name}</div>
              <div style={{ fontSize:12, color:"#8898aa" }}>{selected.student?.rollNo}</div>
            </div>
            {[["Dept", selected.student?.dept||selected.dept],["Year",selected.student?.year],["Email",selected.student?.email]].filter(([,v])=>v).map(([k,v])=>(
              <div key={k} style={{ marginBottom:8, paddingBottom:8, borderBottom:"1px solid #f5f2ed" }}>
                <div style={{ fontSize:10, color:"#aaa", fontWeight:700, textTransform:"uppercase" }}>{k}</div>
                <div style={{ fontSize:13, fontWeight:600, marginTop:2 }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ background:"white", borderRadius:14, padding:20, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
            {[["App ID",selected.appId],["Form",selected.formName],["Category",selected.category],
              ["Submitted",new Date(selected.submittedOn||selected.createdAt).toLocaleDateString()],
              ["Status",selected.status]].map(([k,v])=>(
              <div key={k} style={{ marginBottom:10, paddingBottom:10, borderBottom:"1px solid #f5f2ed" }}>
                <div style={{ fontSize:10, color:"#aaa", fontWeight:700, textTransform:"uppercase" }}>{k}</div>
                <div style={{ fontSize:13, fontWeight:600, marginTop:2, textTransform:"capitalize" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding:"28px 32px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, margin:0 }}>All Applications</h1>
          <p style={{ color:"#8898aa", fontSize:13, marginTop:4 }}>Complete view of all institutional form submissions</p>
        </div>
        <button onClick={load}
          style={{ padding:"8px 16px", borderRadius:10, border:"1.5px solid #e8e4dc",
            background:"white", fontSize:13, fontWeight:600, cursor:"pointer" }}>🔄 Refresh</button>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        {[{l:"Total",v:stats.total,c:"#374151",b:"#f9fafb"},{l:"Approved",v:stats.approved,c:"#059669",b:"#f0fdf4"},
          {l:"In Progress",v:stats.pending,c:"#f59e0b",b:"#fffbeb"},{l:"Rejected",v:stats.rejected,c:"#dc2626",b:"#fef2f2"}].map(s=>(
          <div key={s.l} style={{ background:"white", borderRadius:14, padding:18,
            boxShadow:"0 2px 12px rgba(0,0,0,0.06)", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:11, background:s.b,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:22, fontWeight:800, color:s.c }}>{s.v}</div>
            <div style={{ fontSize:12, color:"#8898aa" }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Search + status tabs */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <div style={{ background:"white", borderRadius:10, padding:"9px 14px",
          display:"flex", gap:8, alignItems:"center", flex:1, minWidth:240,
          boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
          <span>🔍</span>
          <input placeholder="Search by form, student name, app ID..." value={search}
            onChange={e=>setSearch(e.target.value)}
            style={{ border:"none", outline:"none", background:"transparent", fontSize:13, flex:1 }}/>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {STATUS_TABS.map(t=>(
            <button key={t} onClick={()=>setStatus(t)}
              style={{ padding:"6px 14px", borderRadius:99, fontSize:12, fontWeight:600,
                border:"1.5px solid", cursor:"pointer",
                background:status===t?(STATUS_COLORS[t]||"#374151"):"white",
                color:status===t?"white":"#4a5568",
                borderColor:status===t?(STATUS_COLORS[t]||"#374151"):"#e2e8f0",
                textTransform:"capitalize" }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background:"white", borderRadius:16, boxShadow:"0 2px 12px rgba(0,0,0,0.06)", overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"130px 1.5fr 1.2fr 1fr 120px 110px 90px",
          padding:"10px 20px", background:"#f5f2ed",
          fontSize:11, fontWeight:700, color:"#8898aa", textTransform:"uppercase", letterSpacing:0.4 }}>
          <div>App ID</div><div>Form</div><div>Student</div><div>Department</div>
          <div>Submitted</div><div>Status</div><div>Action</div>
        </div>

        {loading ? (
          <div style={{ padding:"60px 20px", textAlign:"center", color:"#8898aa" }}>⏳ Loading applications...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding:"60px 20px", textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
            <div style={{ fontSize:15, fontWeight:700 }}>No applications found</div>
          </div>
        ) : filtered.map(app=>(
          <div key={app._id}
            style={{ display:"grid", gridTemplateColumns:"130px 1.5fr 1.2fr 1fr 120px 110px 90px",
              padding:"13px 20px", borderBottom:"1px solid #f5f2ed", alignItems:"center",
              transition:"background 0.1s" }}
            onMouseOver={e=>e.currentTarget.style.background="#fafaf8"}
            onMouseOut={e=>e.currentTarget.style.background="transparent"}>
            <div style={{ fontSize:12, fontWeight:700, color:"#374151" }}>{app.appId}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:600 }}>{app.formName}</div>
              <div style={{ fontSize:10, color:"#8898aa", marginTop:2 }}>{app.category}</div>
            </div>
            <div style={{ fontSize:12, fontWeight:600 }}>{app.student?.name||"—"}</div>
            <div style={{ fontSize:12, color:"#4a5568" }}>{app.dept||app.student?.dept||"—"}</div>
            <div style={{ fontSize:11, color:"#8898aa" }}>{new Date(app.submittedOn||app.createdAt).toLocaleDateString()}</div>
            <div>
              <span style={{ background:(STATUS_COLORS[app.status]||"#aaa")+"20",
                color:STATUS_COLORS[app.status]||"#aaa",
                fontSize:11, fontWeight:700, padding:"3px 9px",
                borderRadius:99, textTransform:"capitalize" }}>
                {app.status==="in-review"?"In Review":app.status}
              </span>
            </div>
            <button onClick={()=>setSel(app)}
              style={{ padding:"5px 12px", borderRadius:8, border:"1.5px solid #e8e4dc",
                background:"white", fontSize:11, fontWeight:700, cursor:"pointer" }}>View →</button>
          </div>
        ))}
      </div>
    </div>
  );
}