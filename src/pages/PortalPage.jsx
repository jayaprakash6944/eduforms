export const PORTALS = [
  { role:"student",            label:"Student",             tagline:"Apply for forms, track approvals",           icon:"🎓", color:"#e85d26", bg:"#fff5f0", border:"#fcd9c4", desc:"Leave, certificates, placement, hostel, activity and exam forms",   canRegister:true  },
  { role:"faculty",            label:"Faculty",             tagline:"Apply for leave, research & admin forms",     icon:"👨‍🏫", color:"#059669", bg:"#f0fdf4", border:"#a7f3d0", desc:"Leave, FDP, conference, lab requests, travel allowance and more",    canRegister:true  },
  { role:"mentor",             label:"Mentor",              tagline:"Review & approve student applications",       icon:"🧑‍💼", color:"#2563eb", bg:"#eff6ff", border:"#bfdbfe", desc:"First-level approvals for assigned students across all form types",  canRegister:true  },
  { role:"hod",                label:"Head of Department",  tagline:"Department-level approvals & reports",       icon:"🏛️", color:"#7c3aed", bg:"#f5f3ff", border:"#ddd6fe", desc:"Approve department applications, view reports and student tracker",  canRegister:true  },
  { role:"exam_branch",        label:"Exam Branch",         tagline:"Manage all exam-related requests",           icon:"📝", color:"#dc2626", bg:"#fef2f2", border:"#fecaca", desc:"Revaluation, transcripts, hall tickets, mark corrections & more",    canRegister:true  },
  { role:"college_admin",      label:"College Admin",       tagline:"Manage forms, users & analytics",            icon:"⚙️", color:"#374151", bg:"#f9fafb", border:"#d1d5db", desc:"Full control: form templates, user management, all applications",    canRegister:true  },
  { role:"placement_director", label:"Placement Director",  tagline:"Manage placement documents",                 icon:"💼", color:"#f59e0b", bg:"#fffbeb", border:"#fde68a", desc:"Internship NOC, placement registration, industrial visit approvals",  canRegister:true  },
  { role:"college_director",   label:"College Director",    tagline:"Final authority — all approvals",            icon:"👔", color:"#0d1b2a", bg:"#f1f5f9", border:"#cbd5e1", desc:"Final sign-off on all escalated applications from every department",  canRegister:true  },
];

export default function PortalPage({ onSelectPortal }) {
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0d1b2a 0%,#1a2f4a 100%)" }}>
      {/* Header */}
      <div style={{ padding:"32px 48px 0", display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:52, height:52, borderRadius:13, background:"#e85d26", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>🎓</div>
        <div>
          <div style={{ color:"white", fontWeight:800, fontSize:20 }}>EduForms</div>
          <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>Digital Institutional Management System</div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ textAlign:"center", padding:"44px 20px 32px" }}>
        <h1 style={{ color:"white", fontSize:38, fontWeight:900, margin:"0 0 12px", letterSpacing:-1 }}>
          Select Your <span style={{ color:"#e85d26" }}>Portal</span>
        </h1>
        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:15, maxWidth:560, margin:"0 auto" }}>
          Student, Faculty, and Authority portals — each with dedicated dashboards, forms, and workflows.
        </p>
      </div>

      {/* Cards */}
      <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 32px 60px",
        display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
        {PORTALS.map(p => (
          <div key={p.role} onClick={() => onSelectPortal(p.role)}
            style={{ background:"white", borderRadius:20, padding:26, cursor:"pointer",
              border:"2px solid transparent", transition:"all 0.2s",
              boxShadow:"0 4px 20px rgba(0,0,0,0.2)" }}
            onMouseOver={e => { e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.border=`2px solid ${p.color}`; e.currentTarget.style.boxShadow=`0 16px 40px ${p.color}33`; }}
            onMouseOut={e  => { e.currentTarget.style.transform="none"; e.currentTarget.style.border="2px solid transparent"; e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.2)"; }}>
            <div style={{ width:54, height:54, borderRadius:14, background:p.bg, border:`1.5px solid ${p.border}`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, marginBottom:14 }}>{p.icon}</div>
            <div style={{ fontWeight:800, fontSize:15, color:"#0d1b2a", marginBottom:3 }}>{p.label}</div>
            <div style={{ fontSize:11, color:p.color, fontWeight:700, marginBottom:8 }}>{p.tagline}</div>
            <div style={{ fontSize:12, color:"#8898aa", lineHeight:1.6, marginBottom:16 }}>{p.desc}</div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ fontSize:12, fontWeight:700, color:p.color, background:p.bg, padding:"5px 12px", borderRadius:99 }}>Sign In →</div>
              {p.canRegister && <div style={{ fontSize:11, color:"#aaa" }}>New? Register free</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Workflow info */}
      <div style={{ maxWidth:1120, margin:"0 auto 60px", padding:"0 32px" }}>
        <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:20, padding:28, border:"1px solid rgba(255,255,255,0.1)" }}>
          <h3 style={{ color:"white", fontWeight:700, fontSize:16, marginBottom:20, textAlign:"center" }}>
            Hierarchical Approval Workflow
          </h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
            {[
              { label:"Student Academic/Leave", flow:"Student → Mentor → HOD → Director", color:"#e85d26", icon:"🎓" },
              { label:"Placement Requests",     flow:"Student → Mentor → HOD → Placement Director", color:"#2563eb", icon:"💼" },
              { label:"Faculty Requests",       flow:"Faculty → HOD → Director", color:"#059669", icon:"👨‍🏫" },
            ].map(w => (
              <div key={w.label} style={{ background:"rgba(255,255,255,0.06)", borderRadius:14, padding:16 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <span style={{ fontSize:20 }}>{w.icon}</span>
                  <span style={{ color:"white", fontWeight:700, fontSize:13 }}>{w.label}</span>
                </div>
                <div style={{ fontSize:12, color:w.color, fontWeight:600, fontFamily:"monospace" }}>{w.flow}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ textAlign:"center", color:"rgba(255,255,255,0.2)", fontSize:12, paddingBottom:32 }}>
        © 2026 EduForms — Digital Institutional Management System
      </div>
    </div>
  );
}