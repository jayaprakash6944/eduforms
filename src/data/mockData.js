// ─── USERS ────────────────────────────────────────────────────────────────────
export const USERS = [
  { id:1, email:"student@college.edu",   password:"student123",   role:"student",            name:"Arjun Sharma",    dept:"Computer Science", year:"3rd Year", rollNo:"CS21B047", mentor:"Dr. Priya Nair", avatar:"AS" },
  { id:2, email:"faculty@college.edu",   password:"faculty123",   role:"faculty",            name:"Dr. Kavitha Rao", dept:"Computer Science", designation:"Associate Professor", employeeId:"FAC001", avatar:"KR" },
  { id:3, email:"mentor@college.edu",    password:"mentor123",    role:"mentor",             name:"Dr. Priya Nair",  dept:"Computer Science", avatar:"PN" },
  { id:4, email:"hod@college.edu",       password:"hod123",       role:"hod",                name:"Prof. Rajan Kumar",dept:"Computer Science", avatar:"RK" },
  { id:5, email:"admin@college.edu",     password:"admin123",     role:"college_admin",      name:"Mrs. Sunita Rao", avatar:"SR" },
  { id:6, email:"placement@college.edu", password:"placement123", role:"placement_director", name:"Mr. Vikram Mehta",avatar:"VM" },
  { id:7, email:"director@college.edu",  password:"director123",  role:"college_director",   name:"Dr. Anand Pillai",avatar:"AP" },
];

// ─── NAVIGATION ITEMS PER ROLE ────────────────────────────────────────────────
export const NAV_ITEMS = {
  student: [
    { key:"dashboard",         label:"Dashboard",         icon:"⊞" },
    { key:"browse-forms",      label:"Browse Forms",      icon:"🗂" },
    { key:"my-applications",   label:"My Applications",   icon:"📋" },
    { key:"academic-records",  label:"Academic Records",  icon:"📊" },
    { key:"notifications",     label:"Notifications",     icon:"🔔" },
    { key:"feedback",          label:"Feedback",          icon:"💬" },
  ],
  faculty: [
    { key:"dashboard",         label:"Dashboard",         icon:"⊞" },
    { key:"browse-forms",      label:"Apply for Forms",   icon:"📝" },
    { key:"my-applications",   label:"My Requests",       icon:"📋" },
    { key:"my-students",       label:"My Students",       icon:"👥" },
    { key:"class-schedule",    label:"Class Schedule",    icon:"🗓" },
    { key:"notifications",     label:"Notifications",     icon:"🔔" },
    { key:"feedback",          label:"Feedback",          icon:"💬" },
  ],
  mentor: [
    { key:"dashboard",         label:"Dashboard",         icon:"⊞" },
    { key:"pending-approvals", label:"Pending Approvals", icon:"⏳" },
    { key:"history",           label:"Approval History",  icon:"📜" },
    { key:"my-students",       label:"My Students",       icon:"👥" },
    { key:"notifications",     label:"Notifications",     icon:"🔔" },
  ],
  hod: [
    { key:"dashboard",         label:"Dashboard",         icon:"⊞" },
    { key:"pending-approvals", label:"Pending Approvals", icon:"⏳" },
    { key:"history",           label:"Approval History",  icon:"📜" },
    { key:"all-applications",  label:"All Applications",  icon:"📋" },
    { key:"reports",           label:"Reports",           icon:"📊" },
    { key:"notifications",     label:"Notifications",     icon:"🔔" },
  ],
  college_admin: [
    { key:"dashboard",         label:"Dashboard",         icon:"⊞" },
    { key:"manage-forms",      label:"Manage Forms",      icon:"📝" },
    { key:"manage-users",      label:"Manage Users",      icon:"👥" },
    { key:"all-applications",  label:"All Applications",  icon:"📋" },
    { key:"feedback-admin",    label:"Feedback",          icon:"💬" },
    { key:"reports",           label:"Reports & Analytics",icon:"📊" },
    { key:"notifications",     label:"Notifications",     icon:"🔔" },
  ],
  placement_director: [
    { key:"dashboard",         label:"Dashboard",         icon:"⊞" },
    { key:"pending-approvals", label:"Pending Approvals", icon:"⏳" },
    { key:"placement-tracker", label:"Student Tracker",   icon:"🎯" },
    { key:"reports",           label:"Reports",           icon:"📊" },
    { key:"notifications",     label:"Notifications",     icon:"🔔" },
  ],
  college_director: [
    { key:"dashboard",         label:"Dashboard",         icon:"⊞" },
    { key:"pending-approvals", label:"Pending Approvals", icon:"⏳" },
    { key:"all-applications",  label:"All Applications",  icon:"📋" },
    { key:"reports",           label:"Analytics",         icon:"📊" },
    { key:"notifications",     label:"Notifications",     icon:"🔔" },
  ],
};

// ─── STUDENT CATEGORIES ───────────────────────────────────────────────────────
export const STUDENT_CATEGORIES = ["All","Certificate","Leave","Placement","Fee","Hostel","Exam","Activity","Library"];

// ─── FACULTY CATEGORIES ───────────────────────────────────────────────────────
export const FACULTY_CATEGORIES = ["All","Leave","Academic","Research","Admin","Professional"];

// ─── MOCK ATTENDANCE (Student) ────────────────────────────────────────────────
export const MOCK_ATTENDANCE = [
  { subject:"Data Structures",          conducted:52, attended:48, percent:92 },
  { subject:"Operating Systems",        conducted:48, attended:40, percent:83 },
  { subject:"Database Management",      conducted:50, attended:45, percent:90 },
  { subject:"Computer Networks",        conducted:46, attended:32, percent:70 },
  { subject:"Software Engineering",     conducted:44, attended:44, percent:100 },
  { subject:"Machine Learning Lab",     conducted:24, attended:20, percent:83 },
];

// ─── MOCK MARKS (Student) ─────────────────────────────────────────────────────
export const MOCK_MARKS = [
  { subject:"Data Structures",     internal:87, mid:34, grade:"A+" },
  { subject:"Operating Systems",   internal:72, mid:28, grade:"B+"  },
  { subject:"Database Management", internal:91, mid:38, grade:"A+"  },
  { subject:"Computer Networks",   internal:65, mid:25, grade:"B"   },
  { subject:"Software Engineering",internal:80, mid:36, grade:"A"   },
];

// ─── MOCK CLASS SCHEDULE (Faculty) ────────────────────────────────────────────
export const MOCK_SCHEDULE = {
  Monday:    [{ time:"9:00-10:00",   subject:"Data Structures",     batch:"CS-B",  room:"Lab 2" }, { time:"11:00-12:00", subject:"DBMS Lab", batch:"CS-A", room:"Lab 1" }],
  Tuesday:   [{ time:"10:00-11:00",  subject:"Operating Systems",   batch:"CS-A",  room:"204"   }, { time:"2:00-3:00",   subject:"Data Structures", batch:"CS-C", room:"201" }],
  Wednesday: [{ time:"9:00-10:00",   subject:"Data Structures",     batch:"CS-C",  room:"203"   }, { time:"3:00-4:00",   subject:"Project Review",  batch:"Final Year", room:"Seminar Hall" }],
  Thursday:  [{ time:"11:00-12:00",  subject:"Operating Systems",   batch:"CS-A",  room:"204"   }, { time:"1:00-2:00",   subject:"DBMS Lab",        batch:"CS-B", room:"Lab 1" }],
  Friday:    [{ time:"9:00-10:00",   subject:"Faculty Meeting",     batch:"Dept",  room:"Conference Room" }, { time:"2:00-3:00", subject:"Data Structures", batch:"CS-B", room:"201" }],
};