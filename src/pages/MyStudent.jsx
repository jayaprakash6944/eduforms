import { useState, useEffect } from "react";

export default function MyStudents() {
  const [search, setSearch] = useState("");

  const students = [
    { _id:"1", name:"Arjun Sharma",  rollNo:"CS21B047", year:"3rd Year", dept:"Computer Science", email:"arjun@college.edu",  attendance:88 },
    { _id:"2", name:"Meera Pillai",  rollNo:"CS21B048", year:"3rd Year", dept:"Computer Science", email:"meera@college.edu",   attendance:72 },
    { _id:"3", name:"Raj Verma",     rollNo:"CS22B001", year:"2nd Year", dept:"Computer Science", email:"raj@college.edu",     attendance:91 },
    { _id:"4", name:"Ananya Singh",  rollNo:"CS22B002", year:"2nd Year", dept:"Computer Science", email:"ananya@college.edu",  attendance:84 },
    { _id:"5", name:"Karan Mehta",   rollNo:"CS21B049", year:"3rd Year", dept:"Computer Science", email:"karan@college.edu",   attendance:68 },
    { _id:"6", name:"Divya Nair",    rollNo:"CS23B010", year:"1st Year", dept:"Computer Science", email:"divya@college.edu",   attendance:96 },
    { _id:"7", name:"Rohan Das",     rollNo:"CS23B011", year:"1st Year", dept:"Computer Science", email:"rohan@college.edu",   attendance:80 },
    { _id:"8", name:"Priya Iyer",    rollNo:"CS22B003", year:"2nd Year", dept:"Computer Science", email:"priya@college.edu",   attendance:77 },
  ];

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  const YEARS = ["1st Year","2nd Year","3rd Year","4th Year"];
  const grouped = YEARS.map(y => ({ year:y, list:filtered.filter(s => s.year===y) })).filter(g=>g.list.length>0);

  const getAttColor = (p) => p>=85?"#059669":p>=75?"#f59e0b":"#dc2626";
  const getAttBg    = (p) => p>=85?"#f0fdf4":p>=75?"#fffbeb":"#fef2f2";

  return (
    <div style={{ padding:"28px 32px" }}>
      <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>My Students</h1>
      <p style={{ color:"#8898aa", fontSize:13, marginBottom:20 }}>Students assigned to you for mentoring and approvals</p>

      <div style={{ background:"white", borderRadius:12, padding:"10px 16px",
        boxShadow:"0 2px 12px rgba(0,0,0,0.06)", marginBottom:24, display:"flex", gap:10, alignItems:"center" }}>
        <span>🔍</span>
        <input placeholder="Search by name or roll number..." value={search}
          onChange={e=>setSearch(e.target.value)}
          style={{ border:"none", background:"transparent", fontSize:14, flex:1, outline:"none" }}/>
        <span style={{ fontSize:12, color:"#aaa" }}>{filtered.length} students</span>
      </div>

      {grouped.map(g => (
        <div key={g.year} style={{ marginBottom:28 }}>
          <div style={{ fontSize:12, fontWeight:800, color:"#4a5568", textTransform:"uppercase",
            letterSpacing:0.5, marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
            {g.year}
            <span style={{ background:"#f5f2ed", borderRadius:99, padding:"2px 10px",
              fontSize:11, color:"#8898aa", fontWeight:600, textTransform:"none" }}>
              {g.list.length} student{g.list.length>1?"s":""}
            </span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
            {g.list.map(s => (
              <div key={s._id} style={{ background:"white", borderRadius:16, padding:20,
                boxShadow:"0 2px 12px rgba(13,27,42,0.06)", border:"1px solid #f0ebe3" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                  <div style={{ width:40, height:40, borderRadius:"50%", background:"#e85d26",
                    color:"white", display:"flex", alignItems:"center", justifyContent:"center",
                    fontWeight:800, fontSize:14, flexShrink:0 }}>
                    {s.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:"#0d1b2a" }}>{s.name}</div>
                    <div style={{ fontSize:11, color:"#8898aa" }}>{s.rollNo}</div>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}>
                    <span style={{ color:"#8898aa" }}>Attendance</span>
                    <span style={{ fontWeight:700, fontSize:12, color:getAttColor(s.attendance),
                      background:getAttBg(s.attendance), padding:"2px 8px", borderRadius:99 }}>
                      {s.attendance}%
                    </span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}>
                    <span style={{ color:"#8898aa" }}>Year</span>
                    <span style={{ fontWeight:600 }}>{s.year}</span>
                  </div>
                  <div style={{ fontSize:11, color:"#2563eb", fontWeight:500, marginTop:2 }}>{s.email}</div>
                </div>
                {s.attendance < 75 && (
                  <div style={{ background:"#fef2f2", borderRadius:8, padding:"6px 10px",
                    marginTop:10, fontSize:11, color:"#dc2626", fontWeight:600 }}>
                    ⚠ Low attendance — may be ineligible for exams
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}