// Feature 6: Universal Voice-Based Form Fill
// Works for ALL 49 forms and ALL field types
import { useState, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// UNIVERSAL FIELD EXTRACTOR
// Extracts any value from speech based on what field names exist in the form
// ─────────────────────────────────────────────────────────────────────────────
function extractAllFields(transcript, formFields) {
  const result = {};
  const t      = transcript.toLowerCase();
  const text   = transcript;

  // ── MONTHS MAP ────────────────────────────────────────────────────────────
  const MONTHS = {
    january:1,february:2,march:3,april:4,may:5,june:6,
    july:7,august:8,september:9,october:10,november:11,december:12,
    jan:1,feb:2,mar:3,apr:4,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12
  };
  const toDate = (d,m,y) => `${String(d).padStart(2,"0")}/${String(m).padStart(2,"0")}/${y||new Date().getFullYear()}`;

  // ── EXTRACT ALL POSSIBLE VALUES FROM SPEECH ───────────────────────────────

  // DATE RANGE: "from 10th April to 15th April 2026"
  let fromDate="", toDate2="";
  const rangePat = /from\s+(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)(?:\s+(\d{4}))?\s+to\s+(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)(?:\s+(\d{4}))?/i;
  const rm = text.match(rangePat);
  if (rm) {
    const m1=MONTHS[rm[2].toLowerCase()], m2=MONTHS[rm[5].toLowerCase()];
    if (m1) fromDate = toDate(rm[1],m1,rm[3]);
    if (m2) toDate2  = toDate(rm[4],m2,rm[6]||rm[3]);
  }
  // SAME MONTH RANGE: "10th to 15th April"
  if (!fromDate) {
    const sm = text.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(?:to|till|until)\s+(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)(?:\s+(\d{4}))?/i);
    if (sm) { const mon=MONTHS[sm[3].toLowerCase()]; if(mon){fromDate=toDate(sm[1],mon,sm[4]);toDate2=toDate(sm[2],mon,sm[4]);} }
  }
  // SINGLE DATE
  if (!fromDate) {
    const sd = text.match(/(?:on|from|date is|starting|dated)\s+(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)(?:\s+(\d{4}))?/i);
    if (sd) { const mon=MONTHS[sd[2].toLowerCase()]; if(mon) fromDate=toDate(sd[1],mon,sd[3]); }
  }
  // TOMORROW
  if (!fromDate && t.includes("tomorrow")) {
    const d=new Date(); d.setDate(d.getDate()+1);
    fromDate=d.toLocaleDateString("en-IN");
  }

  // REASON / PURPOSE
  let reason="";
  const reasonPats = [
    /reason\s+(?:is|for|being)?\s*[:\-]?\s*([^.!?,\n]{3,80})/i,
    /due\s+to\s+([^.!?,\n]{3,60})/i,
    /because\s+of\s+([^.!?,\n]{3,60})/i,
    /because\s+([^.!?,\n]{3,60})/i,
    /purpose\s+(?:is|of)?\s*[:\-]?\s*([^.!?,\n]{3,60})/i,
    /for\s+(marriage|medical|sick|fever|function|emergency|exam|hospital|wedding|interview|surgery|personal|work|event|competition|conference|training|internship|placement)[^.!?,\n]*/i,
    /i\s+(?:have|am|got|had)\s+(fever|cold|flu|sick|ill|injured|fracture|surgery|operation|accident|dengue|typhoid|covid)[^.!?,\n]*/i,
    /going\s+(?:for|to)\s+(marriage|wedding|function|hospital|native|hometown)[^.!?,\n]*/i,
  ];
  for (const rp of reasonPats) {
    const m=text.match(rp);
    if (m&&m[1]&&m[1].trim().length>2) { reason=m[1].trim(); break; }
  }

  // DURATION
  let duration="", noDays="";
  const dm=t.match(/(\d+)\s*(?:day|days)/i);
  if (dm) { const n=parseInt(dm[1]); duration=n+" day"+(n>1?"s":""); noDays=String(n); }

  // PHONE / CONTACT
  let phone="";
  const phm=text.match(/(\d{10})/)||text.match(/(?:contact|phone|mobile|number\s+is)\s+(\d[\d\s\-]{8,12})/i);
  if (phm) { const raw=(phm[1]||phm[2]||"").replace(/[\s\-]/g,""); if(raw.length>=10) phone=raw.slice(0,10); }

  // COMPANY / ORGANIZATION
  let company="";
  const cm=text.match(/(?:at|in|with|company is|joining|interning at|company name is)\s+([A-Z][a-zA-Z\s]{2,30}(?:Ltd|Inc|Pvt|Tech|Technologies|Solutions|Systems|Corp|Limited)?)\b/);
  if (cm) company=cm[1].trim();

  // SUBJECT / PAPER
  let subject="";
  const sm2=text.match(/(?:subject is|for subject|paper is|in subject)\s+([A-Z][a-zA-Z\s]{2,30})/i)
    ||text.match(/\b(DBMS|DSA|OS|Networks|Maths|Physics|Chemistry|English|Java|Python|C\+\+|Machine Learning|Data Science|Algorithms)\b/);
  if (sm2) subject=(sm2[1]||sm2[0]).trim();

  // NAME
  let studentName="";
  const nm=text.match(/(?:my name is|name is|I am|student name is)\s+([A-Z][a-zA-Z\s]{2,30})/i);
  if (nm) studentName=nm[1].trim();

  // ROLL NUMBER
  let rollNo="";
  const rnm=text.match(/(?:roll(?:\s+number)? is|register(?:ation)? number is|id is|roll no is)\s+([A-Z0-9]{4,15})/i);
  if (rnm) rollNo=rnm[1].trim();

  // YEAR
  let year="";
  const ym=text.match(/(?:year is|i am in|i'm in|studying in)\s+(\d+(?:st|nd|rd|th)?\s+year)/i)
    ||text.match(/(\d+(?:st|nd|rd|th))\s+year/i);
  if (ym) year=(ym[1]||ym[0]).trim();

  // DEPARTMENT
  let dept="";
  const dpm=text.match(/(?:department is|branch is|from)\s+(CSE|ECE|EEE|MECH|CIVIL|IT|MBA|MCA|Computer Science|Electronics|Mechanical|Civil)[^.!?,]*/i);
  if (dpm) dept=dpm[1].trim();

  // MARKS / PERCENTAGE
  let marks="";
  const mm=text.match(/(?:marks are|got|scored|percentage is)\s+(\d{1,3}(?:\.\d{1,2})?)/i);
  if (mm) marks=mm[1];

  // SEMESTER
  let semester="";
  const sem=text.match(/(?:semester is|sem is|in semester)\s+(\d+|[IVXivx]+)/i)||text.match(/(\d+)(?:st|nd|rd|th)\s+sem(?:ester)?/i);
  if (sem) semester=(sem[1]||sem[0]).trim();

  // AMOUNT / FEE
  let amount="";
  const amt=text.match(/(?:amount is|fee is|pay|cost is)\s+(?:rs\.?|inr)?\s*(\d+)/i);
  if (amt) amount=amt[1];

  // DESIGNATION
  let designation="";
  const des=text.match(/(?:designation is|post is|i am a|working as)\s+([a-zA-Z\s]{3,30})/i);
  if (des) designation=des[1].trim();

  // EMPLOYEE ID
  let empId="";
  const eid=text.match(/(?:employee id is|emp id is|staff id is)\s+([A-Z0-9\-]{3,15})/i);
  if (eid) empId=eid[1].trim();

  // ADDITIONAL REMARKS
  let remarks="";
  const remPat=text.match(/(?:remarks?(?:\s+(?:are|is))?|additional(?:\s+(?:note|info))?(?:\s+is)?)\s*[:\-]?\s*([^.!?\n]{3,100})/i);
  if (remPat) remarks=remPat[1].trim();

  // NUMBER OF COPIES / PAGES
  let copies="";
  const cop=text.match(/(\d+)\s+cop(?:y|ies)/i);
  if (cop) copies=cop[1];

  // PLACE / LOCATION
  let place="";
  const plm=text.match(/(?:place is|location is|at|held at|venue is)\s+([A-Z][a-zA-Z\s]{2,30})/);
  if (plm) place=plm[1].trim();

  // ── MAP EXTRACTED VALUES TO FORM FIELDS ───────────────────────────────────
  formFields.forEach(field => {
    const fl = field.toLowerCase().trim();

    // DATE FIELDS
    if ((fl.includes("from") && fl.includes("date")) || fl === "from date" || fl === "start date" || fl === "date of commencement") {
      if (fromDate) result[field] = fromDate;
    }
    else if ((fl.includes("to") && fl.includes("date")) || fl === "to date" || fl === "end date" || fl === "date of completion" || fl.includes("return")) {
      if (toDate2) result[field] = toDate2;
      else if (fromDate) result[field] = fromDate;
    }
    else if (fl === "date" || fl === "application date" || fl === "dated" || fl.includes("date of ") && !fl.includes("birth")) {
      if (fromDate) result[field] = fromDate;
    }
    else if (fl.includes("dob") || fl.includes("date of birth") || fl.includes("birth")) {
      // DOB - look for specific birth date pattern
      const dob=text.match(/(?:born on|dob is|date of birth is?|born)\s+(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)(?:\s+(\d{4}))?/i);
      if (dob) { const mon=MONTHS[dob[2].toLowerCase()]; if(mon) result[field]=toDate(dob[1],mon,dob[3]); }
    }
    else if (fl.includes("event date") || fl.includes("visit date") || fl.includes("interview date") || fl.includes("joining date")) {
      if (fromDate) result[field] = fromDate;
    }

    // REASON / PURPOSE FIELDS
    else if (fl.includes("reason") || fl.includes("purpose") || fl.includes("description") || fl === "cause" || fl.includes("nature of leave")) {
      if (reason) result[field] = reason;
    }

    // DURATION FIELDS
    else if (fl.includes("duration") || fl === "no of days" || fl === "number of days" || fl.includes("days required") || fl.includes("leave days")) {
      if (duration) result[field] = duration;
      else if (noDays) result[field] = noDays;
    }

    // PHONE FIELDS
    else if (fl.includes("contact") || fl.includes("phone") || fl.includes("mobile") || fl.includes("whatsapp") || (fl.includes("number") && !fl.includes("roll") && !fl.includes("register") && !fl.includes("hall") && !fl.includes("employee") && !fl.includes("serial"))) {
      if (phone) result[field] = phone;
    }

    // COMPANY FIELDS
    else if (fl.includes("company") || fl.includes("organisation") || fl.includes("organization") || fl.includes("employer") || fl.includes("firm name") || fl.includes("industry name")) {
      if (company) result[field] = company;
    }

    // SUBJECT FIELDS
    else if (fl.includes("subject") || fl.includes("paper") || fl.includes("course name") && !fl.includes("course registration")) {
      if (subject) result[field] = subject;
    }

    // NAME FIELDS (student / faculty / applicant)
    else if ((fl.includes("name") && !fl.includes("form") && !fl.includes("course") && !fl.includes("department") && !fl.includes("company") && !fl.includes("organization")) && !fl.includes("subject")) {
      if (studentName) result[field] = studentName;
    }

    // ROLL / ID FIELDS
    else if (fl.includes("roll") || fl.includes("register") || fl.includes("enrollment") || fl === "id number" || fl === "student id" || fl.includes("hall ticket")) {
      if (rollNo) result[field] = rollNo;
    }

    // YEAR FIELD
    else if ((fl === "year" || fl === "current year" || fl.includes("year of study")) && !fl.includes("academic year")) {
      if (year) result[field] = year;
    }

    // DEPARTMENT / BRANCH
    else if (fl.includes("department") || fl.includes("branch") || fl === "dept") {
      if (dept) result[field] = dept;
    }

    // MARKS / PERCENTAGE
    else if (fl.includes("marks") || fl.includes("percentage") || fl.includes("cgpa") || fl.includes("score")) {
      if (marks) result[field] = marks;
    }

    // SEMESTER
    else if (fl.includes("semester") || fl === "sem") {
      if (semester) result[field] = semester;
    }

    // AMOUNT / FEE
    else if (fl.includes("amount") || fl.includes("fee") || fl.includes("cost")) {
      if (amount) result[field] = amount;
    }

    // DESIGNATION
    else if (fl.includes("designation") || fl.includes("post") || fl.includes("position")) {
      if (designation) result[field] = designation;
    }

    // EMPLOYEE ID
    else if (fl.includes("employee id") || fl.includes("emp id") || fl.includes("staff id")) {
      if (empId) result[field] = empId;
    }

    // PLACE / VENUE
    else if (fl.includes("place") || fl.includes("venue") || fl.includes("location") || fl.includes("city")) {
      if (place) result[field] = place;
    }

    // COPIES
    else if (fl.includes("copies") || fl.includes("no of copies") || fl.includes("number of copies")) {
      if (copies) result[field] = copies;
    }

    // ADDITIONAL REMARKS
    else if (fl.includes("additional") || fl === "remarks" || fl.includes("extra info") || fl.includes("other details")) {
      if (remarks) result[field] = remarks;
    }

    // ── GENERIC FALLBACK: if someone says "FIELD NAME is VALUE" ─────────────
    // e.g. "CG is 8.5" matches "CG" field, "backlogs is 0" matches "Backlogs" field
    else {
      // Try to find "field_name is value" or "field_name: value" pattern in speech
      const escaped = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const fieldPat = new RegExp(escaped + "\\s+(?:is|are|:)\\s*([^.!?,\\n]{1,60})", "i");
      const fm = text.match(fieldPat);
      if (fm && fm[1] && fm[1].trim().length > 0) {
        result[field] = fm[1].trim();
      } else {
        // Also try abbreviated match e.g. "CG" for "CGPA" field
        const firstWord = field.split(" ")[0].toLowerCase();
        if (firstWord.length > 1) {
          const abbPat = new RegExp("\\b" + firstWord + "\\s+(?:is|are|:)?\\s*([^.!?,\\n]{1,60})", "i");
          const am = text.match(abbPat);
          if (am && am[1] && am[1].trim().length > 0 && !result[field]) {
            result[field] = am[1].trim();
          }
        }
      }
    }
  });

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function VoiceFormFill({ fields=[], onFill, accentColor="#e85d26" }) {
  const [listening,  setListening]  = useState(false);
  const [transcript, setTranscript] = useState("");
  const [filled,     setFilled]     = useState([]);
  const [error,      setError]      = useState("");
  const [open,       setOpen]       = useState(false);
  const recRef = useRef(null);

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setError("Voice not supported. Please use Chrome browser."); return; }
    setError(""); setFilled([]);
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-IN";
    let finalText = "";
    rec.onresult = (e) => {
      let interim = "";
      for (let i=e.resultIndex; i<e.results.length; i++) {
        if (e.results[i].isFinal) finalText += " " + e.results[i][0].transcript;
        else interim = e.results[i][0].transcript;
      }
      setTranscript((finalText + " " + interim).trim());
    };
    rec.onerror = (e) => { setError("Mic error: " + e.error + ". Try again."); setListening(false); };
    rec.onend   = () => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
  };

  const stopAndFill = () => {
    recRef.current?.stop();
    setListening(false);
    const currentTranscript = transcript.trim();
    if (!currentTranscript) { setError("No speech detected. Please try again."); return; }

    const extracted = extractAllFields(currentTranscript, fields);
    const filledList = Object.keys(extracted).filter(k => extracted[k]);

    if (filledList.length > 0) {
      onFill(extracted);
      setFilled(filledList);
      setError("");
    } else {
      // Give helpful hint based on what fields exist
      const hasDate   = fields.some(f => f.toLowerCase().includes("date"));
      const hasReason = fields.some(f => f.toLowerCase().includes("reason"));
      const hints     = [];
      if (hasReason) hints.push(`"reason is fever"`);
      if (hasDate)   hints.push(`"from 10th April to 15th April"`);
      hints.push(`"[field name] is [value]"`);
      setError(`Could not extract fields. Try saying: ${hints.join(", ")}`);
    }
  };

  // Build hint based on actual form fields
  const buildHint = () => {
    const hints = [];
    if (fields.some(f => f.toLowerCase().includes("reason"))) hints.push("reason is fever");
    if (fields.some(f => f.toLowerCase().includes("from")))   hints.push("from 10th April to 15th April");
    if (fields.some(f => f.toLowerCase().includes("contact")||f.toLowerCase().includes("phone"))) hints.push("contact 9876543210");
    if (fields.some(f => f.toLowerCase().includes("company"))) hints.push("company is TCS");
    if (fields.some(f => f.toLowerCase().includes("subject"))) hints.push("subject is DBMS");
    if (fields.some(f => f.toLowerCase().includes("marks")))   hints.push("marks are 85");
    if (hints.length === 0) hints.push("[field name] is [value]");
    return `"${hints.slice(0,3).join(", ")}"`;
  };

  return (
    <div style={{background:"white",borderRadius:14,padding:18,
      boxShadow:"0 2px 12px rgba(0,0,0,0.06)",border:"1px solid #f0ebe3"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:open?12:0}}>
        <div style={{fontSize:12,fontWeight:800,color:"#4a5568",textTransform:"uppercase",letterSpacing:0.3}}>
          🎙️ Voice Form Fill
        </div>
        <button type="button" onClick={()=>{setOpen(!open);if(open){recRef.current?.stop();setListening(false);}}}
          style={{fontSize:11,color:accentColor,fontWeight:700,background:"none",border:"none",cursor:"pointer"}}>
          {open?"Hide ▲":"Show ▼"}
        </button>
      </div>

      {open && (
        <>
          <div style={{fontSize:11,color:"#8898aa",marginBottom:10,lineHeight:1.6}}>
            Speak details for this form. Try: <em>{buildHint()}</em>
          </div>

          {/* Live transcript */}
          {transcript && (
            <div style={{background:"#f9fafb",borderRadius:8,padding:"8px 12px",
              marginBottom:10,fontSize:12,color:"#374151",border:"1px solid #e2e8f0",
              fontStyle:"italic",lineHeight:1.5,maxHeight:80,overflowY:"auto"}}>
              🗣️ "{transcript}"
            </div>
          )}

          {/* Filled confirmation */}
          {filled.length > 0 && (
            <div style={{background:"#eff6ff",borderRadius:8,padding:"10px 12px",
              marginBottom:10,border:"1px solid #bfdbfe",fontSize:12}}>
              <div style={{fontWeight:700,color:"#1d4ed8",marginBottom:6}}>
                ✅ {filled.length} field{filled.length>1?"s":""} extracted from voice!
              </div>
              {filled.map(f=>(
                <div key={f} style={{color:"#1e40af",marginBottom:2}}>🎙️ {f}</div>
              ))}
              <div style={{marginTop:8,fontSize:11,color:"#3b82f6",fontWeight:600,
                background:"#dbeafe",borderRadius:5,padding:"5px 8px"}}>
                💡 Click <strong>⚡ Auto-Fill</strong> above to also fill profile fields (name, roll no, branch etc.)
              </div>
            </div>
          )}

          {error && (
            <div style={{background:"#fef2f2",borderRadius:8,padding:"8px 12px",
              marginBottom:10,fontSize:12,color:"#dc2626",border:"1px solid #fecaca"}}>
              ❌ {error}
            </div>
          )}

          <div style={{display:"flex",gap:8}}>
            {!listening && (
              <button type="button" onClick={startListening}
                style={{flex:1,padding:"10px",borderRadius:9,
                  background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`,
                  color:"white",border:"none",fontWeight:700,fontSize:13,cursor:"pointer"}}>
                🎙️ {transcript?"Speak Again":"Start Speaking"}
              </button>
            )}
            {listening && (
              <button type="button" onClick={stopAndFill}
                style={{flex:1,padding:"10px",borderRadius:9,
                  background:"linear-gradient(135deg,#dc2626,#b91c1c)",
                  color:"white",border:"none",fontWeight:700,fontSize:13,cursor:"pointer"}}>
                🔴 Stop & Fill Fields
              </button>
            )}
            {transcript && !listening && (
              <button type="button" onClick={stopAndFill}
                style={{padding:"10px 16px",borderRadius:9,background:"#059669",
                  color:"white",border:"none",fontSize:12,cursor:"pointer",fontWeight:700}}>
                Fill Fields
              </button>
            )}
            {(transcript||filled.length>0) && !listening && (
              <button type="button" onClick={()=>{setTranscript("");setFilled([]);setError("");}}
                style={{padding:"10px 14px",borderRadius:9,border:"1.5px solid #e2e8f0",
                  background:"white",fontSize:12,cursor:"pointer",color:"#8898aa"}}>
                Clear
              </button>
            )}
          </div>

          {listening && (
            <div style={{marginTop:8,textAlign:"center",fontSize:11,color:"#dc2626",fontWeight:600}}>
              🔴 Listening... speak now, then click Stop & Fill Fields
            </div>
          )}
        </>
      )}
    </div>
  );
}