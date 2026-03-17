import { MOCK_SCHEDULE } from "../../data/mockData";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
const TODAY = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];

const HOURS = ["8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];

const DAY_COLORS = { Monday:"#e85d26", Tuesday:"#2563eb", Wednesday:"#7c3aed", Thursday:"#059669", Friday:"#f59e0b" };

export default function ClassSchedule() {
  return (
    <div style={{ padding:"28px 32px" }}>
      <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Class Schedule</h1>
      <p style={{ color:"#8898aa", fontSize:13, marginBottom:24 }}>Weekly timetable — Today is <strong style={{ color:DAY_COLORS[TODAY]||"#0d1b2a" }}>{TODAY}</strong></p>

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:24 }}>
        {DAYS.map(day => {
          const classes = MOCK_SCHEDULE[day] || [];
          const isToday = day === TODAY;
          return (
            <div key={day} style={{ background:isToday?"#0d1b2a":"white", borderRadius:14, padding:16,
              boxShadow:"0 2px 12px rgba(0,0,0,0.06)", border:isToday?`2px solid ${DAY_COLORS[day]}`:"2px solid transparent" }}>
              <div style={{ fontSize:12, fontWeight:800, color:isToday?DAY_COLORS[day]:"#8898aa",
                textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 }}>{day.slice(0,3)} {isToday?"(Today)":""}</div>
              <div style={{ fontSize:28, fontWeight:900, color:isToday?"white":"#0d1b2a", marginBottom:4 }}>
                {classes.length}
              </div>
              <div style={{ fontSize:11, color:isToday?"rgba(255,255,255,0.5)":"#aaa" }}>
                {classes.length === 0 ? "Free day" : `class${classes.length>1?"es":""}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed schedule */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14 }}>
        {DAYS.map(day => {
          const classes = MOCK_SCHEDULE[day] || [];
          const isToday = day === TODAY;
          return (
            <div key={day}>
              <div style={{ fontWeight:800, fontSize:13, color:DAY_COLORS[day], marginBottom:10,
                padding:"6px 12px", background:(DAY_COLORS[day]||"#e85d26")+"15",
                borderRadius:8, textAlign:"center" }}>
                {day} {isToday?"⬅":""} 
              </div>
              {classes.length === 0 ? (
                <div style={{ background:"white", borderRadius:12, padding:16, textAlign:"center",
                  border:"2px dashed #e8e4dc", color:"#aaa", fontSize:12 }}>
                  Free Day
                </div>
              ) : classes.map((cls, i) => (
                <div key={i} style={{ background:isToday?"#0d1b2a":"white", borderRadius:12, padding:14, marginBottom:10,
                  boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
                  borderLeft:`4px solid ${DAY_COLORS[day]||"#e85d26"}` }}>
                  <div style={{ fontSize:11, fontWeight:700, color:DAY_COLORS[day], marginBottom:6 }}>{cls.time}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:isToday?"white":"#0d1b2a", marginBottom:4 }}>{cls.subject}</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    <span style={{ fontSize:10, fontWeight:600, background:(DAY_COLORS[day]||"#e85d26")+"20",
                      color:DAY_COLORS[day], padding:"2px 7px", borderRadius:99 }}>{cls.batch}</span>
                    <span style={{ fontSize:10, fontWeight:600, background:isToday?"rgba(255,255,255,0.1)":"#f5f2ed",
                      color:isToday?"rgba(255,255,255,0.6)":"#8898aa", padding:"2px 7px", borderRadius:99 }}>{cls.room}</span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}