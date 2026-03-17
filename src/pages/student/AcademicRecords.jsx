import { useAuth } from "../../contexts/AuthContext";
import { MOCK_ATTENDANCE, MOCK_MARKS } from "../../data/mockData";

export default function AcademicRecords() {
  const { user } = useAuth();

  const avgAttendance = Math.round(
    MOCK_ATTENDANCE.reduce((s, a) => s + a.percent, 0) / MOCK_ATTENDANCE.length
  );

  const getAttColor = (p) => p >= 85 ? "#059669" : p >= 75 ? "#f59e0b" : "#dc2626";
  const getAttBg    = (p) => p >= 85 ? "#f0fdf4" : p >= 75 ? "#fffbeb" : "#fef2f2";

  const totalMarks = MOCK_MARKS.reduce((s, m) => s + m.internal + m.mid, 0);
  const maxMarks   = MOCK_MARKS.length * (100 + 50);
  const gpa        = "8.4"; // mock

  return (
    <div style={{ padding:"28px 32px" }}>
      <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Academic Records</h1>
      <p style={{ color:"#8898aa", fontSize:13, marginBottom:24 }}>
        {user.dept} · {user.year} · {user.rollNo} · Semester 5
      </p>

      {/* Summary row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
        {[
          { icon:"📊", value:`${avgAttendance}%`, label:"Avg. Attendance", color:getAttColor(avgAttendance), bg:getAttBg(avgAttendance) },
          { icon:"📝", value:gpa,                 label:"Current CGPA",    color:"#7c3aed", bg:"#f5f3ff" },
          { icon:"✅", value:`${MOCK_MARKS.length}`, label:"Active Subjects", color:"#2563eb", bg:"#eff6ff" },
          { icon:"🏆", value:"3",                 label:"Backlogs",         color:"#059669", bg:"#f0fdf4" },
        ].map(s => (
          <div key={s.label} style={{ background:"white", borderRadius:16, padding:20,
            boxShadow:"0 2px 12px rgba(13,27,42,0.06)", display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:46, height:46, borderRadius:12, background:s.bg,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:24, fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:11, color:"#8898aa", fontWeight:500 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

        {/* Attendance */}
        <div style={{ background:"white", borderRadius:18, padding:24, boxShadow:"0 2px 12px rgba(13,27,42,0.06)" }}>
          <h3 style={{ fontSize:15, fontWeight:700, marginBottom:6 }}>Attendance</h3>
          <p style={{ fontSize:12, color:"#8898aa", marginBottom:20 }}>Minimum 75% required</p>

          {MOCK_ATTENDANCE.map(a => (
            <div key={a.subject} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:13, fontWeight:600, color:"#0d1b2a" }}>{a.subject}</span>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:11, color:"#8898aa" }}>{a.attended}/{a.conducted}</span>
                  <span style={{ fontWeight:800, fontSize:13, color:getAttColor(a.percent) }}>{a.percent}%</span>
                </div>
              </div>
              <div style={{ height:6, background:"#f5f2ed", borderRadius:99, overflow:"hidden" }}>
                <div style={{ width:`${a.percent}%`, height:"100%",
                  background:getAttColor(a.percent), borderRadius:99, transition:"width 0.4s" }}/>
              </div>
              {a.percent < 75 && (
                <div style={{ fontSize:10, color:"#dc2626", fontWeight:600, marginTop:3 }}>
                  ⚠ Below minimum — apply for medical leave if applicable
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Marks */}
        <div style={{ background:"white", borderRadius:18, padding:24, boxShadow:"0 2px 12px rgba(13,27,42,0.06)" }}>
          <h3 style={{ fontSize:15, fontWeight:700, marginBottom:6 }}>Internal & Mid-Term Marks</h3>
          <p style={{ fontSize:12, color:"#8898aa", marginBottom:20 }}>Semester 5 — Nov 2025</p>

          <div style={{ background:"#f5f2ed", borderRadius:10, overflow:"hidden" }}>
            {/* Header */}
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr",
              padding:"10px 16px", fontSize:11, fontWeight:700, color:"#8898aa",
              textTransform:"uppercase", letterSpacing:0.3, borderBottom:"1px solid #e8e4dc" }}>
              <span>Subject</span><span style={{ textAlign:"center" }}>Internal</span>
              <span style={{ textAlign:"center" }}>Mid</span><span style={{ textAlign:"center" }}>Grade</span>
            </div>
            {MOCK_MARKS.map((m, i) => {
              const total = m.internal + m.mid;
              const color = m.grade.includes("+") ? "#059669" : m.grade === "A" ? "#2563eb" : m.grade === "B" ? "#f59e0b" : "#dc2626";
              return (
                <div key={m.subject} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr",
                  padding:"12px 16px", background:i%2===0?"white":"#f5f2ed",
                  fontSize:13, alignItems:"center" }}>
                  <span style={{ fontWeight:600, color:"#0d1b2a" }}>{m.subject}</span>
                  <span style={{ textAlign:"center", fontWeight:600 }}>{m.internal}/100</span>
                  <span style={{ textAlign:"center", fontWeight:600 }}>{m.mid}/50</span>
                  <div style={{ textAlign:"center" }}>
                    <span style={{ background:color+"15", color, fontWeight:800,
                      fontSize:12, padding:"3px 10px", borderRadius:99 }}>{m.grade}</span>
                  </div>
                </div>
              );
            })}
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr",
              padding:"12px 16px", background:"#0d1b2a", fontSize:12, fontWeight:700 }}>
              <span style={{ color:"white" }}>Overall</span>
              <span style={{ textAlign:"center", color:"rgba(255,255,255,0.6)" }}>—</span>
              <span style={{ textAlign:"center", color:"rgba(255,255,255,0.6)" }}>—</span>
              <span style={{ textAlign:"center", color:"#e85d26" }}>CGPA {gpa}</span>
            </div>
          </div>

          {/* Alerts */}
          {MOCK_ATTENDANCE.some(a => a.percent < 75) && (
            <div style={{ background:"#fef2f2", border:"1.5px solid #fecaca", borderRadius:12,
              padding:"12px 16px", marginTop:16 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#dc2626", marginBottom:4 }}>
                ⚠ Attendance Warning
              </div>
              <div style={{ fontSize:12, color:"#ef4444" }}>
                {MOCK_ATTENDANCE.filter(a => a.percent < 75).map(a => a.subject).join(", ")} — below 75%.
                You may not be eligible to sit for the end-semester exam.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}