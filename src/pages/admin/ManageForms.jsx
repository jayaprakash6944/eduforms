import { useState, useEffect, useCallback } from "react";
import { getFormsAPI, createUserAPI } from "../../utils/api";

const BASE = "http://localhost:5000/api";
const token = () => localStorage.getItem("token");

const apiForms = {
  getAll:  ()     => fetch(`${BASE}/forms`,    { headers:{ Authorization:"Bearer "+token() }}).then(r=>r.json()),
  create:  (body) => fetch(`${BASE}/forms`,    { method:"POST", headers:{ Authorization:"Bearer "+token(), "Content-Type":"application/json" }, body:JSON.stringify(body) }).then(r=>r.json()),
  update:  (id,b) => fetch(`${BASE}/forms/${id}`, { method:"PUT",  headers:{ Authorization:"Bearer "+token(), "Content-Type":"application/json" }, body:JSON.stringify(b) }).then(r=>r.json()),
  remove:  (id)   => fetch(`${BASE}/forms/${id}`, { method:"DELETE", headers:{ Authorization:"Bearer "+token() }}).then(r=>r.json()),
};

const CATEGORIES  = ["Certificate","Leave","Placement","Fee","Hostel","Exam","Activity","Library","Academic","Research","Admin","Professional"];
const PORTAL_TYPES= ["student","faculty","both"];
const SIGNATORIES = ["Mentor","HOD","College Director","Placement Director","College Admin"];
const COLORS      = ["#e85d26","#2563eb","#7c3aed","#059669","#f59e0b","#ec4899","#06b6d4","#374151"];

const CAT_COLORS  = {
  Certificate:"#e85d26",Leave:"#2563eb",Placement:"#f59e0b",Fee:"#059669",
  Hostel:"#06b6d4",Exam:"#ec4899",Activity:"#7c3aed",Library:"#374151",
  Academic:"#f59e0b",Research:"#7c3aed",Admin:"#374151",Professional:"#e85d26",
};

const BLANK = { name:"", description:"", category:"Leave", icon:"📄", color:"#e85d26",
                time:"1-2 days", fields:[], signatories:[], portalType:"student", popular:false };

function FormModal({ form, onClose, onSave }) {
  const [data, setData] = useState(form ? { ...form, fields:[...(form.fields||[])], signatories:[...(form.signatories||[])] } : { ...BLANK });
  const [fieldInput, setFieldInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  const addField = () => {
    const f = fieldInput.trim();
    if (f && !data.fields.includes(f)) { set("fields", [...data.fields, f]); setFieldInput(""); }
  };
  const removeField = (f) => set("fields", data.fields.filter(x => x !== f));
  const toggleSig   = (s) => set("signatories", data.signatories.includes(s)
    ? data.signatories.filter(x => x !== s)
    : [...data.signatories, s]);

  const handleSave = async () => {
    if (!data.name.trim())           return setError("Form name is required");
    if (data.fields.length === 0)    return setError("Add at least one field");
    if (data.signatories.length === 0) return setError("Select at least one signatory");
    setSaving(true); setError("");
    try {
      await onSave(data);
      onClose();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const inp = { width:"100%", padding:"9px 12px", border:"1.5px solid #e2e8f0", borderRadius:9,
    fontSize:13, outline:"none", boxSizing:"border-box" };
  const lbl = { fontSize:11, fontWeight:700, color:"#8898aa", textTransform:"uppercase",
    letterSpacing:0.5, display:"block", marginBottom:6 };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(13,27,42,0.7)",
      zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={onClose}>
      <div style={{ background:"white", borderRadius:20, width:"100%", maxWidth:620,
        maxHeight:"90vh", overflowY:"auto", boxShadow:"0 32px 80px rgba(0,0,0,0.4)" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ background:"#0d1b2a", borderRadius:"20px 20px 0 0",
          padding:"18px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ color:"white", fontWeight:800, fontSize:17 }}>
              {form ? "Edit Form Template" : "Add New Form Template"}
            </div>
            <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12, marginTop:2 }}>
              {form ? `Editing: ${form.name}` : "Create a new institutional form"}
            </div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.1)", border:"none",
            color:"white", borderRadius:8, padding:"6px 14px", cursor:"pointer", fontSize:13 }}>✕</button>
        </div>

        <div style={{ padding:"24px" }}>
          {error && (
            <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:9,
              padding:"10px 14px", marginBottom:16, fontSize:13, color:"#dc2626" }}>❌ {error}</div>
          )}

          {/* Name + Icon row */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 100px", gap:12, marginBottom:16 }}>
            <div>
              <label style={lbl}>Form Name *</label>
              <input value={data.name} onChange={e=>set("name",e.target.value)}
                placeholder="e.g. Bonafide Certificate" style={inp}/>
            </div>
            <div>
              <label style={lbl}>Icon</label>
              <input value={data.icon} onChange={e=>set("icon",e.target.value)}
                placeholder="📄" style={{...inp, textAlign:"center", fontSize:20}}/>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom:16 }}>
            <label style={lbl}>Description</label>
            <textarea value={data.description} onChange={e=>set("description",e.target.value)}
              placeholder="Brief description of this form..."
              style={{...inp, minHeight:60, resize:"vertical"}}/>
          </div>

          {/* Category + Portal Type + Time */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:16 }}>
            <div>
              <label style={lbl}>Category *</label>
              <select value={data.category} onChange={e=>set("category",e.target.value)} style={{...inp,cursor:"pointer"}}>
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Portal Type *</label>
              <select value={data.portalType} onChange={e=>set("portalType",e.target.value)} style={{...inp,cursor:"pointer"}}>
                {PORTAL_TYPES.map(p=><option key={p} value={p}>{p==="both"?"Both (Student+Faculty)":p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Processing Time</label>
              <input value={data.time} onChange={e=>set("time",e.target.value)}
                placeholder="e.g. 1-2 days" style={inp}/>
            </div>
          </div>

          {/* Color + Popular */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:12, marginBottom:16 }}>
            <div>
              <label style={lbl}>Card Color</label>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {COLORS.map(c=>(
                  <div key={c} onClick={()=>set("color",c)}
                    style={{ width:28, height:28, borderRadius:"50%", background:c, cursor:"pointer",
                      border:data.color===c?"3px solid #0d1b2a":"3px solid transparent",
                      transition:"all 0.15s" }}/>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"flex-end", paddingBottom:4 }}>
              <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                <input type="checkbox" checked={data.popular}
                  onChange={e=>set("popular",e.target.checked)}
                  style={{ width:16, height:16 }}/>
                <span style={{ fontSize:13, fontWeight:600 }}>Mark as Popular</span>
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div style={{ marginBottom:16 }}>
            <label style={lbl}>Form Fields * (what the student/faculty fills)</label>
            <div style={{ display:"flex", gap:8, marginBottom:8 }}>
              <input value={fieldInput} onChange={e=>setFieldInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&(e.preventDefault(),addField())}
                placeholder="Type field name and press Enter or +"
                style={{...inp, flex:1}}/>
              <button onClick={addField}
                style={{ padding:"9px 18px", background:"#0d1b2a", color:"white", border:"none",
                  borderRadius:9, fontWeight:700, cursor:"pointer" }}>+</button>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {data.fields.map(f=>(
                <span key={f} style={{ background:"#f5f2ed", padding:"4px 10px", borderRadius:99,
                  fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
                  {f}
                  <button onClick={()=>removeField(f)}
                    style={{ background:"none", border:"none", cursor:"pointer",
                      color:"#dc2626", fontWeight:700, fontSize:13, padding:0 }}>×</button>
                </span>
              ))}
              {data.fields.length===0 && <span style={{ fontSize:12, color:"#aaa" }}>No fields added yet</span>}
            </div>
          </div>

          {/* Signatories */}
          <div style={{ marginBottom:24 }}>
            <label style={lbl}>Approval Chain (Signatories) *</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {SIGNATORIES.map(s=>{
                const active = data.signatories.includes(s);
                return (
                  <button key={s} type="button" onClick={()=>toggleSig(s)}
                    style={{ padding:"7px 14px", borderRadius:99, fontSize:12, fontWeight:600,
                      border:"1.5px solid", cursor:"pointer", transition:"all 0.15s",
                      background:active?"#0d1b2a":"white", color:active?"white":"#4a5568",
                      borderColor:active?"#0d1b2a":"#e2e8f0" }}>
                    {active ? "✓ " : ""}{s}
                  </button>
                );
              })}
            </div>
            {data.signatories.length>0 && (
              <div style={{ marginTop:8, fontSize:11, color:"#059669", fontWeight:600 }}>
                Flow: {data.signatories.join(" → ")}
              </div>
            )}
          </div>

          <div style={{ display:"flex", gap:10 }}>
            <button onClick={handleSave} disabled={saving}
              style={{ flex:1, padding:"12px", background:saving?"#ccc":"linear-gradient(135deg,#374151,#0d1b2a)",
                color:"white", border:"none", borderRadius:11, fontWeight:800,
                fontSize:14, cursor:saving?"not-allowed":"pointer" }}>
              {saving ? "⏳ Saving..." : form ? "💾 Save Changes" : "✅ Create Form Template"}
            </button>
            <button onClick={onClose}
              style={{ padding:"12px 20px", background:"white", border:"1.5px solid #e2e8f0",
                borderRadius:11, fontWeight:600, cursor:"pointer", fontSize:14 }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ManageForms() {
  const [forms,   setForms]  = useState([]);
  const [loading, setLoading]= useState(true);
  const [search,  setSearch] = useState("");
  const [catFilter,setCat]   = useState("All");
  const [modal,   setModal]  = useState(null);  // null | "add" | formObject
  const [delConf, setDelConf]= useState(null);
  const [toast,   setToast]  = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiForms.getAll();
      setForms(Array.isArray(data) ? data : []);
    } catch { setForms([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""), 3000); };

  const handleSave = async (formData) => {
    if (modal === "add") {
      await apiForms.create(formData);
      showToast("✅ Form template created!");
    } else {
      await apiForms.update(modal._id, formData);
      showToast("✅ Form updated!");
    }
    await load();
  };

  const handleDelete = async (id) => {
    await apiForms.remove(id);
    setDelConf(null);
    showToast("🗑️ Form deleted.");
    await load();
  };

  const allCats = ["All",...new Set(forms.map(f=>f.category))];
  const filtered = forms.filter(f =>
    (catFilter==="All"||f.category===catFilter) &&
    (f.name.toLowerCase().includes(search.toLowerCase())||
     f.description?.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    total:   forms.length,
    student: forms.filter(f=>f.portalType==="student"||f.portalType==="both").length,
    faculty: forms.filter(f=>f.portalType==="faculty"||f.portalType==="both").length,
    popular: forms.filter(f=>f.popular).length,
  };

  return (
    <div style={{ padding:"28px 32px" }}>
      {modal && <FormModal form={modal==="add"?null:modal} onClose={()=>setModal(null)} onSave={handleSave}/>}

      {delConf && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)",
          zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"white", borderRadius:18, padding:32,
            maxWidth:400, width:"100%", textAlign:"center", boxShadow:"0 24px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🗑️</div>
            <h3 style={{ fontWeight:800, marginBottom:8 }}>Delete Form Template?</h3>
            <p style={{ color:"#8898aa", fontSize:13, marginBottom:24 }}>
              "<strong>{delConf.name}</strong>" will be deactivated. Existing applications won't be affected.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>handleDelete(delConf._id)}
                style={{ flex:1, padding:12, background:"#dc2626", color:"white",
                  border:"none", borderRadius:10, fontWeight:700, cursor:"pointer" }}>Delete</button>
              <button onClick={()=>setDelConf(null)}
                style={{ flex:1, padding:12, background:"white", border:"1.5px solid #e2e8f0",
                  borderRadius:10, fontWeight:600, cursor:"pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position:"fixed", top:24, right:24, background:"#0d1b2a",
          color:"white", borderRadius:12, padding:"12px 20px", fontSize:14,
          fontWeight:600, zIndex:9998, boxShadow:"0 8px 24px rgba(0,0,0,0.3)" }}>{toast}</div>
      )}

      {/* Page header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, margin:0 }}>Manage Form Templates</h1>
          <p style={{ color:"#8898aa", fontSize:13, marginTop:4 }}>
            Create, edit and manage all institutional form templates
          </p>
        </div>
        <button onClick={()=>setModal("add")}
          style={{ padding:"10px 22px", background:"linear-gradient(135deg,#374151,#0d1b2a)",
            color:"white", border:"none", borderRadius:11, fontWeight:800,
            fontSize:14, cursor:"pointer", boxShadow:"0 4px 14px rgba(13,27,42,0.3)",
            display:"flex", alignItems:"center", gap:8 }}>
          ➕ Add New Form
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
        {[
          { label:"Total Forms",    value:stats.total,   color:"#374151", bg:"#f9fafb", icon:"📋" },
          { label:"Student Forms",  value:stats.student, color:"#e85d26", bg:"#fff5f0", icon:"🎓" },
          { label:"Faculty Forms",  value:stats.faculty, color:"#059669", bg:"#f0fdf4", icon:"👨‍🏫" },
          { label:"Popular",        value:stats.popular, color:"#f59e0b", bg:"#fffbeb", icon:"⭐" },
        ].map(s=>(
          <div key={s.label} style={{ background:"white", borderRadius:14, padding:18,
            boxShadow:"0 2px 12px rgba(0,0,0,0.06)", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:11, background:s.bg,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:24, fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:12, color:"#8898aa" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <div style={{ background:"white", borderRadius:10, padding:"9px 14px",
          display:"flex", gap:8, alignItems:"center", flex:1, minWidth:200,
          boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
          <span>🔍</span>
          <input placeholder="Search forms..." value={search}
            onChange={e=>setSearch(e.target.value)}
            style={{ border:"none", outline:"none", background:"transparent", fontSize:13, flex:1 }}/>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {allCats.map(c=>(
            <button key={c} onClick={()=>setCat(c)}
              style={{ padding:"6px 14px", borderRadius:99, fontSize:12, fontWeight:600,
                border:"1.5px solid", cursor:"pointer",
                background:catFilter===c?"#374151":"white",
                color:catFilter===c?"white":"#4a5568",
                borderColor:catFilter===c?"#374151":"#e2e8f0" }}>
              {c}
            </button>
          ))}
        </div>
        <button onClick={load}
          style={{ padding:"9px 16px", borderRadius:10, border:"1.5px solid #e8e4dc",
            background:"white", fontSize:13, fontWeight:600, cursor:"pointer" }}>🔄</button>
      </div>

      {/* Forms grid */}
      {loading ? (
        <div style={{ background:"white", borderRadius:16, padding:"60px 20px",
          textAlign:"center", color:"#8898aa" }}>⏳ Loading form templates...</div>
      ) : filtered.length === 0 ? (
        <div style={{ background:"white", borderRadius:16, padding:"60px 20px",
          textAlign:"center" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
          <div style={{ fontSize:15, fontWeight:700 }}>No forms found</div>
          <div style={{ fontSize:13, color:"#8898aa", marginTop:4 }}>
            {search ? "Try a different search." : "Click '➕ Add New Form' to get started."}
          </div>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          {filtered.map(f=>(
            <div key={f._id} style={{ background:"white", borderRadius:14, padding:20,
              boxShadow:"0 2px 12px rgba(0,0,0,0.06)",
              border:`2px solid ${f.color}22`, position:"relative",
              transition:"all 0.15s" }}
              onMouseOver={e=>{e.currentTarget.style.boxShadow=`0 8px 24px ${f.color}22`;e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseOut={e=>{e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.06)";e.currentTarget.style.transform="none";}}>

              {f.popular && (
                <span style={{ position:"absolute", top:12, right:12, background:"#fef3c7",
                  color:"#92400e", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:99 }}>
                  ⭐ Popular
                </span>
              )}

              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <div style={{ width:42, height:42, borderRadius:11,
                  background:f.color+"15", display:"flex",
                  alignItems:"center", justifyContent:"center", fontSize:22 }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:14 }}>{f.name}</div>
                  <div style={{ fontSize:11, color:"#8898aa", marginTop:2 }}>{f.category}</div>
                </div>
              </div>

              <div style={{ fontSize:12, color:"#8898aa", marginBottom:10,
                lineHeight:1.5, minHeight:32 }}>{f.description}</div>

              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
                <span style={{ fontSize:10, fontWeight:700, background:f.color+"15",
                  color:f.color, padding:"3px 8px", borderRadius:99 }}>{f.category}</span>
                <span style={{ fontSize:10, fontWeight:700, background:"#f5f2ed",
                  color:"#4a5568", padding:"3px 8px", borderRadius:99 }}>
                  {f.portalType==="both"?"Student+Faculty":f.portalType}
                </span>
                <span style={{ fontSize:10, fontWeight:600, color:"#8898aa",
                  padding:"3px 8px", borderRadius:99, background:"#f5f2ed" }}>
                  ⏱ {f.time}
                </span>
              </div>

              <div style={{ fontSize:11, color:"#8898aa", marginBottom:12 }}>
                <strong>Fields:</strong> {(f.fields||[]).join(", ")||"—"}
              </div>

              <div style={{ fontSize:11, color:"#059669", fontWeight:600, marginBottom:14 }}>
                {(f.signatories||[]).join(" → ")}
              </div>

              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>setModal(f)}
                  style={{ flex:1, padding:"8px", borderRadius:9,
                    background:"#f5f2ed", border:"1.5px solid #e8e4dc",
                    fontSize:12, fontWeight:700, cursor:"pointer", color:"#374151" }}>
                  ✏️ Edit
                </button>
                <button onClick={()=>setDelConf(f)}
                  style={{ flex:1, padding:"8px", borderRadius:9,
                    background:"#fef2f2", border:"1.5px solid #fecaca",
                    fontSize:12, fontWeight:700, cursor:"pointer", color:"#dc2626" }}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}