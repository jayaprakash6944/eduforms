import { useState, useEffect, useCallback } from "react";

const BASE  = "http://localhost:5000/api";
const token = () => localStorage.getItem("token");
const api   = {
  get:    (p="")  => fetch(`${BASE}/users${p}`,   { headers:{ Authorization:"Bearer "+token() }}).then(r=>r.json()),
  create: (b)     => fetch(`${BASE}/users`,        { method:"POST",   headers:{ Authorization:"Bearer "+token(), "Content-Type":"application/json" }, body:JSON.stringify(b) }).then(r=>r.json()),
  update: (id,b)  => fetch(`${BASE}/users/${id}`,  { method:"PUT",    headers:{ Authorization:"Bearer "+token(), "Content-Type":"application/json" }, body:JSON.stringify(b) }).then(r=>r.json()),
  remove: (id)    => fetch(`${BASE}/users/${id}`,  { method:"DELETE", headers:{ Authorization:"Bearer "+token() }}).then(r=>r.json()),
};

const ROLES = ["student","faculty","mentor","hod","college_admin","placement_director","college_director"];
const ROLE_LABELS = { student:"Student", faculty:"Faculty", mentor:"Mentor", hod:"HOD",
  college_admin:"College Admin", placement_director:"Placement Director", college_director:"College Director" };
const ROLE_COLORS = { student:"#e85d26", faculty:"#059669", mentor:"#2563eb", hod:"#7c3aed",
  college_admin:"#374151", placement_director:"#f59e0b", college_director:"#dc2626" };
const DEPTS = ["Computer Science","Information Technology","Electronics","Mechanical","Civil","Chemical","MBA","MCA","Physics","Mathematics","Other"];
const YEARS = ["1st Year","2nd Year","3rd Year","4th Year","PG 1st Year","PG 2nd Year"];
const DESIGNATIONS = ["Professor","Associate Professor","Assistant Professor","Senior Lecturer","Lecturer","HOD","Lab Instructor","Other"];

const BLANK_USER = { name:"", email:"", password:"", role:"student", dept:"", year:"", rollNo:"", designation:"" };

function UserModal({ user, onClose, onSave }) {
  const [data, setData]   = useState(user ? { ...user, password:"" } : { ...BLANK_USER });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const set = (k,v) => setData(d=>({...d,[k]:v}));
  const isStudent = data.role === "student";
  const isFaculty = data.role === "faculty";
  const isStaff   = ["mentor","hod","placement_director","college_director"].includes(data.role);

  const handleSave = async () => {
    if (!data.name.trim())  return setError("Name is required");
    if (!data.email.trim()) return setError("Email is required");
    if (!user && !data.password) return setError("Password is required for new users");
    setSaving(true); setError("");
    try {
      const payload = { ...data };
      if (!payload.password) delete payload.password;
      await onSave(payload);
      onClose();
    } catch(e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const inp = { width:"100%", padding:"9px 12px", border:"1.5px solid #e2e8f0",
    borderRadius:9, fontSize:13, outline:"none", boxSizing:"border-box" };
  const lbl = { fontSize:11, fontWeight:700, color:"#8898aa", textTransform:"uppercase",
    letterSpacing:0.5, display:"block", marginBottom:6 };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(13,27,42,0.7)",
      zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={onClose}>
      <div style={{ background:"white", borderRadius:20, width:"100%", maxWidth:540,
        maxHeight:"90vh", overflowY:"auto", boxShadow:"0 32px 80px rgba(0,0,0,0.4)" }}
        onClick={e=>e.stopPropagation()}>
        <div style={{ background:"#0d1b2a", borderRadius:"20px 20px 0 0",
          padding:"18px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ color:"white", fontWeight:800, fontSize:17 }}>
              {user ? "Edit User" : "Add New User"}
            </div>
            <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12, marginTop:2 }}>
              {user ? user.email : "Create a new institutional account"}
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

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
            <div>
              <label style={lbl}>Full Name *</label>
              <input value={data.name} onChange={e=>set("name",e.target.value)}
                placeholder="Full Name" style={inp}/>
            </div>
            <div>
              <label style={lbl}>Role *</label>
              <select value={data.role} onChange={e=>set("role",e.target.value)} style={{...inp,cursor:"pointer"}}>
                {ROLES.map(r=><option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Email *</label>
            <input type="email" value={data.email} onChange={e=>set("email",e.target.value)}
              placeholder="user@college.edu" style={inp}/>
          </div>

          <div style={{ marginBottom:14 }}>
            <label style={lbl}>{user ? "New Password (leave blank to keep)" : "Password *"}</label>
            <input type="password" value={data.password} onChange={e=>set("password",e.target.value)}
              placeholder={user ? "Leave blank to keep current" : "Set password"} style={inp}/>
          </div>

          {/* Role-specific fields */}
          {(isStudent || isFaculty || isStaff || data.role==="hod") && (
            <div style={{ display:"grid", gridTemplateColumns:isStudent?"1fr 1fr":"1fr", gap:12, marginBottom:14 }}>
              <div>
                <label style={lbl}>Department</label>
                <select value={data.dept} onChange={e=>set("dept",e.target.value)} style={{...inp,cursor:"pointer"}}>
                  <option value="">Select department...</option>
                  {DEPTS.map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
              {isStudent && (
                <div>
                  <label style={lbl}>Year</label>
                  <select value={data.year} onChange={e=>set("year",e.target.value)} style={{...inp,cursor:"pointer"}}>
                    <option value="">Select year...</option>
                    {YEARS.map(y=><option key={y}>{y}</option>)}
                  </select>
                </div>
              )}
            </div>
          )}

          {isStudent && (
            <div style={{ marginBottom:14 }}>
              <label style={lbl}>Roll Number</label>
              <input value={data.rollNo} onChange={e=>set("rollNo",e.target.value)}
                placeholder="e.g. CS21B047" style={inp}/>
            </div>
          )}

          {(isFaculty || data.role==="hod") && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
              <div>
                <label style={lbl}>Designation</label>
                <select value={data.designation} onChange={e=>set("designation",e.target.value)} style={{...inp,cursor:"pointer"}}>
                  <option value="">Select...</option>
                  {DESIGNATIONS.map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Employee ID</label>
                <input value={data.rollNo} onChange={e=>set("rollNo",e.target.value)}
                  placeholder="e.g. FAC-CS-001" style={inp}/>
              </div>
            </div>
          )}

          <div style={{ display:"flex", gap:10, marginTop:8 }}>
            <button onClick={handleSave} disabled={saving}
              style={{ flex:1, padding:"12px",
                background:saving?"#ccc":"linear-gradient(135deg,#374151,#0d1b2a)",
                color:"white", border:"none", borderRadius:11, fontWeight:800,
                fontSize:14, cursor:saving?"not-allowed":"pointer" }}>
              {saving ? "⏳ Saving..." : user ? "💾 Save Changes" : "✅ Create User"}
            </button>
            <button onClick={onClose}
              style={{ padding:"12px 20px", background:"white", border:"1.5px solid #e2e8f0",
                borderRadius:11, fontWeight:600, cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ManageUsers() {
  const [users,    setUsers]   = useState([]);
  const [loading,  setLoading] = useState(true);
  const [search,   setSearch]  = useState("");
  const [roleFilter,setRole]   = useState("All");
  const [modal,    setModal]   = useState(null);
  const [delConf,  setDelConf] = useState(null);
  const [toast,    setToast]   = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try { const d = await api.get(); setUsers(Array.isArray(d)?d:[]); }
    catch { setUsers([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(""),3000); };

  const handleSave = async (data) => {
    if (modal === "add") await api.create(data);
    else await api.update(modal._id, data);
    showToast(modal==="add" ? "✅ User created!" : "✅ User updated!");
    await load();
  };

  const handleDelete = async (id) => {
    await api.remove(id);
    setDelConf(null);
    showToast("🗑️ User deactivated.");
    await load();
  };

  const allRoles = ["All", ...ROLES];
  const filtered = users.filter(u =>
    (roleFilter==="All" || u.role===roleFilter) &&
    (u.name?.toLowerCase().includes(search.toLowerCase()) ||
     u.email?.toLowerCase().includes(search.toLowerCase()) ||
     u.rollNo?.toLowerCase().includes(search.toLowerCase()))
  );

  const roleCounts = ROLES.reduce((acc,r) => ({ ...acc, [r]: users.filter(u=>u.role===r).length }), {});

  return (
    <div style={{ padding:"28px 32px" }}>
      {modal && <UserModal user={modal==="add"?null:modal} onClose={()=>setModal(null)} onSave={handleSave}/>}

      {delConf && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)",
          zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"white", borderRadius:18, padding:32,
            maxWidth:400, width:"100%", textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>⚠️</div>
            <h3 style={{ fontWeight:800, marginBottom:8 }}>Deactivate User?</h3>
            <p style={{ color:"#8898aa", fontSize:13, marginBottom:24 }}>
              <strong>{delConf.name}</strong> ({delConf.email}) will be deactivated and cannot log in.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>handleDelete(delConf._id)}
                style={{ flex:1, padding:12, background:"#dc2626", color:"white",
                  border:"none", borderRadius:10, fontWeight:700, cursor:"pointer" }}>Deactivate</button>
              <button onClick={()=>setDelConf(null)}
                style={{ flex:1, padding:12, background:"white", border:"1.5px solid #e2e8f0",
                  borderRadius:10, fontWeight:600, cursor:"pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position:"fixed", top:24, right:24, background:"#0d1b2a",
          color:"white", borderRadius:12, padding:"12px 20px",
          fontSize:14, fontWeight:600, zIndex:9998 }}>{toast}</div>
      )}

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, margin:0 }}>Manage Users</h1>
          <p style={{ color:"#8898aa", fontSize:13, marginTop:4 }}>
            {users.length} active users across all roles
          </p>
        </div>
        <button onClick={()=>setModal("add")}
          style={{ padding:"10px 22px", background:"linear-gradient(135deg,#374151,#0d1b2a)",
            color:"white", border:"none", borderRadius:11, fontWeight:800,
            fontSize:14, cursor:"pointer", boxShadow:"0 4px 14px rgba(13,27,42,0.3)" }}>
          ➕ Add New User
        </button>
      </div>

      {/* Role summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {[
          { role:"student",  icon:"🎓" },
          { role:"faculty",  icon:"👨‍🏫" },
          { role:"mentor",   icon:"🧑‍💼" },
          { role:"hod",      icon:"🏛️" },
        ].map(({role,icon})=>(
          <div key={role} onClick={()=>setRole(role)}
            style={{ background:"white", borderRadius:14, padding:"14px 18px",
              boxShadow:"0 2px 12px rgba(0,0,0,0.06)", cursor:"pointer",
              border:`2px solid ${roleFilter===role ? ROLE_COLORS[role] : "transparent"}`,
              transition:"all 0.15s" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:38, height:38, borderRadius:10,
                background:ROLE_COLORS[role]+"15", display:"flex",
                alignItems:"center", justifyContent:"center", fontSize:20 }}>{icon}</div>
              <div>
                <div style={{ fontSize:22, fontWeight:800, color:ROLE_COLORS[role] }}>
                  {roleCounts[role]||0}
                </div>
                <div style={{ fontSize:11, color:"#8898aa" }}>{ROLE_LABELS[role]}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <div style={{ background:"white", borderRadius:10, padding:"9px 14px",
          display:"flex", gap:8, alignItems:"center", flex:1, minWidth:220,
          boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
          <span>🔍</span>
          <input placeholder="Search by name, email or roll no..." value={search}
            onChange={e=>setSearch(e.target.value)}
            style={{ border:"none", outline:"none", background:"transparent", fontSize:13, flex:1 }}/>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {allRoles.map(r=>(
            <button key={r} onClick={()=>setRole(r)}
              style={{ padding:"6px 12px", borderRadius:99, fontSize:11, fontWeight:700,
                border:"1.5px solid", cursor:"pointer",
                background:roleFilter===r ? (ROLE_COLORS[r]||"#374151") : "white",
                color:roleFilter===r ? "white" : "#4a5568",
                borderColor:roleFilter===r ? (ROLE_COLORS[r]||"#374151") : "#e2e8f0" }}>
              {r==="All" ? "All" : ROLE_LABELS[r]}
            </button>
          ))}
        </div>
        <button onClick={load}
          style={{ padding:"9px 16px", borderRadius:10, border:"1.5px solid #e8e4dc",
            background:"white", fontSize:13, fontWeight:600, cursor:"pointer" }}>🔄</button>
      </div>

      {/* Table */}
      <div style={{ background:"white", borderRadius:16,
        boxShadow:"0 2px 12px rgba(0,0,0,0.06)", overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 2fr 1.5fr 1.2fr 1fr 120px",
          padding:"10px 20px", background:"#f5f2ed",
          fontSize:11, fontWeight:700, color:"#8898aa", textTransform:"uppercase", letterSpacing:0.4 }}>
          <div>Name</div><div>Email</div><div>Department</div><div>Role</div><div>ID / Roll</div><div>Actions</div>
        </div>

        {loading ? (
          <div style={{ padding:"60px 20px", textAlign:"center", color:"#8898aa" }}>⏳ Loading users...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding:"60px 20px", textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>👥</div>
            <div style={{ fontSize:15, fontWeight:700 }}>No users found</div>
          </div>
        ) : filtered.map(u=>(
          <div key={u._id}
            style={{ display:"grid", gridTemplateColumns:"2fr 2fr 1.5fr 1.2fr 1fr 120px",
              padding:"13px 20px", borderBottom:"1px solid #f5f2ed", alignItems:"center",
              transition:"background 0.1s" }}
            onMouseOver={e=>e.currentTarget.style.background="#fafaf8"}
            onMouseOut={e=>e.currentTarget.style.background="transparent"}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:34, height:34, borderRadius:"50%",
                background:ROLE_COLORS[u.role]||"#374151",
                color:"white", display:"flex", alignItems:"center",
                justifyContent:"center", fontWeight:800, fontSize:13, flexShrink:0 }}>
                {(u.name||"U").split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700 }}>{u.name}</div>
                {u.designation && <div style={{ fontSize:10, color:"#8898aa" }}>{u.designation}</div>}
              </div>
            </div>
            <div style={{ fontSize:12, color:"#4a5568", overflow:"hidden", textOverflow:"ellipsis" }}>{u.email}</div>
            <div style={{ fontSize:12, color:"#4a5568" }}>{u.dept||"—"}</div>
            <div>
              <span style={{ background:ROLE_COLORS[u.role]+"15", color:ROLE_COLORS[u.role]||"#374151",
                fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:99 }}>
                {ROLE_LABELS[u.role]||u.role}
              </span>
            </div>
            <div style={{ fontSize:12, color:"#8898aa" }}>{u.rollNo||"—"}</div>
            <div style={{ display:"flex", gap:6 }}>
              <button onClick={()=>setModal(u)}
                style={{ padding:"5px 10px", borderRadius:7, background:"#f5f2ed",
                  border:"1.5px solid #e8e4dc", fontSize:11, fontWeight:700,
                  cursor:"pointer", color:"#374151" }}>✏️</button>
              <button onClick={()=>setDelConf(u)}
                style={{ padding:"5px 10px", borderRadius:7, background:"#fef2f2",
                  border:"1.5px solid #fecaca", fontSize:11, fontWeight:700,
                  cursor:"pointer", color:"#dc2626" }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}