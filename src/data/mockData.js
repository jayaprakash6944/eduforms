// ─── USERS ────────────────────────────────────────────────────────────────────
export const USERS = [
  {
    id: 1, email: "student@college.edu", password: "student123",
    role: "student", name: "Arjun Sharma",
    dept: "Computer Science", year: "3rd Year",
    rollNo: "CS21B047", mentor: "Dr. Priya Nair", avatar: "AS",
  },
  {
    id: 2, email: "mentor@college.edu", password: "mentor123",
    role: "mentor", name: "Dr. Priya Nair",
    dept: "Computer Science", avatar: "PN",
  },
  {
    id: 3, email: "hod@college.edu", password: "hod123",
    role: "hod", name: "Prof. Rajan Kumar",
    dept: "Computer Science", avatar: "RK",
  },
  {
    id: 4, email: "admin@college.edu", password: "admin123",
    role: "college_admin", name: "Mrs. Sunita Rao", avatar: "SR",
  },
  {
    id: 5, email: "placement@college.edu", password: "placement123",
    role: "placement_director", name: "Mr. Vikram Mehta", avatar: "VM",
  },
  {
    id: 6, email: "director@college.edu", password: "director123",
    role: "college_director", name: "Dr. Anand Pillai", avatar: "AP",
  },
];

// ─── FORM TEMPLATES ───────────────────────────────────────────────────────────
export const FORM_TEMPLATES = [
  {
    id: 1, name: "Bonafide Certificate", category: "Certificate",
    description: "Official certificate confirming student enrollment",
    signatories: ["HOD", "College Director"], time: "3–5 days",
    icon: "🎓", color: "#e85d26", popular: true,
    fields: ["Purpose", "Destination", "Duration"],
  },
  {
    id: 2, name: "Leave Application", category: "Leave",
    description: "Apply for leave from classes",
    signatories: ["Mentor", "HOD"], time: "1–2 days",
    icon: "📅", color: "#2563eb", popular: true,
    fields: ["From Date", "To Date", "Reason", "Contact Number"],
  },
  {
    id: 3, name: "Fee Payment Request", category: "Fee",
    description: "Request for fee payment extension or installment",
    signatories: ["HOD", "College Director"], time: "5–7 days",
    icon: "💰", color: "#059669", popular: false,
    fields: ["Fee Type", "Amount", "Reason", "Parent Contact"],
  },
  {
    id: 4, name: "Course Registration", category: "Fee",
    description: "Register for additional courses or semester",
    signatories: ["Mentor", "HOD"], time: "2–3 days",
    icon: "📚", color: "#7c3aed", popular: true,
    fields: ["Course Name", "Course Code", "Reason"],
  },
  {
    id: 5, name: "Internship NOC Letter", category: "Placement",
    description: "No Objection Certificate for internship",
    signatories: ["HOD", "Placement Director"], time: "3–4 days",
    icon: "💼", color: "#e85d26", popular: true,
    fields: ["Company Name", "Duration", "Location", "Stipend"],
  },
  {
    id: 6, name: "Scholarship Application", category: "Certificate",
    description: "Apply for merit or need-based scholarship",
    signatories: ["Mentor", "HOD", "College Director"], time: "7–10 days",
    icon: "🏆", color: "#f59e0b", popular: false,
    fields: ["Scholarship Name", "Category", "Family Income", "Achievements"],
  },
  {
    id: 7, name: "Hostel Room Allotment", category: "Hostel",
    description: "Request for hostel room or room change",
    signatories: ["College Admin", "College Director"], time: "5–7 days",
    icon: "🏠", color: "#06b6d4", popular: false,
    fields: ["Room Preference", "Reason", "Duration"],
  },
  {
    id: 8, name: "Exam Revaluation Request", category: "Exam",
    description: "Request for exam paper revaluation",
    signatories: ["HOD", "College Director"], time: "10–15 days",
    icon: "📝", color: "#ec4899", popular: false,
    fields: ["Subject", "Exam Date", "Roll Number", "Reason"],
  },
  {
    id: 9, name: "Placement Registration", category: "Placement",
    description: "Register for campus placement drives",
    signatories: ["Mentor", "Placement Director"], time: "1–2 days",
    icon: "🚀", color: "#2563eb", popular: true,
    fields: ["CGPA", "Backlogs", "Skills", "Resume Upload"],
  },
  {
    id: 10, name: "Medical Leave Certificate", category: "Leave",
    description: "Submit medical leave with doctor certificate",
    signatories: ["Mentor"], time: "Same Day",
    icon: "🏥", color: "#059669", popular: false,
    fields: ["From Date", "To Date", "Hospital Name"],
  },
  {
    id: 11, name: "Character Certificate", category: "Certificate",
    description: "Certificate confirming good conduct",
    signatories: ["HOD", "College Director"], time: "3–5 days",
    icon: "⭐", color: "#7c3aed", popular: false,
    fields: ["Purpose", "Required By", "Destination"],
  },
  {
    id: 12, name: "Research Lab Access", category: "Certificate",
    description: "Request access to research laboratories",
    signatories: ["Mentor", "HOD"], time: "2–3 days",
    icon: "🔬", color: "#e85d26", popular: false,
    fields: ["Lab Name", "Purpose", "Duration", "Supervisor Name"],
  },
];

// ─── APPLICATIONS ─────────────────────────────────────────────────────────────
export const APPLICATIONS = [
  {
    id: "APP-2024-001", formName: "Bonafide Certificate",
    studentName: "Arjun Sharma", rollNo: "CS21B047", dept: "Computer Science",
    submittedOn: "2024-01-15", status: "approved", currentStep: 3, totalSteps: 3,
    steps: [
      { name: "Mentor",          status: "approved", date: "2024-01-16", comment: "Verified" },
      { name: "HOD",             status: "approved", date: "2024-01-17", comment: "Approved" },
      { name: "College Director",status: "approved", date: "2024-01-18", comment: "Granted"  },
    ],
  },
  {
    id: "APP-2024-002", formName: "Leave Application",
    studentName: "Arjun Sharma", rollNo: "CS21B047", dept: "Computer Science",
    submittedOn: "2024-01-18", status: "pending", currentStep: 1, totalSteps: 2,
    steps: [
      { name: "Mentor", status: "pending", date: null, comment: null },
      { name: "HOD",    status: "waiting", date: null, comment: null },
    ],
  },
  {
    id: "APP-2024-003", formName: "Internship NOC Letter",
    studentName: "Arjun Sharma", rollNo: "CS21B047", dept: "Computer Science",
    submittedOn: "2024-01-10", status: "rejected", currentStep: 2, totalSteps: 3,
    steps: [
      { name: "Mentor",            status: "approved", date: "2024-01-11", comment: "OK" },
      { name: "HOD",               status: "rejected", date: "2024-01-13", comment: "CGPA requirement not met. Minimum 7.5 required." },
      { name: "Placement Director",status: "waiting",  date: null,         comment: null },
    ],
  },
  {
    id: "APP-2024-004", formName: "Course Registration",
    studentName: "Riya Patel", rollNo: "CS21B052", dept: "Computer Science",
    submittedOn: "2024-01-19", status: "pending", currentStep: 0, totalSteps: 2,
    steps: [
      { name: "Mentor", status: "pending", date: null, comment: null },
      { name: "HOD",    status: "waiting", date: null, comment: null },
    ],
  },
  {
    id: "APP-2024-005", formName: "Scholarship Application",
    studentName: "Karan Singh", rollNo: "CS21B031", dept: "Computer Science",
    submittedOn: "2024-01-17", status: "in-review", currentStep: 1, totalSteps: 3,
    steps: [
      { name: "Mentor",          status: "approved", date: "2024-01-18", comment: "Recommended" },
      { name: "HOD",             status: "pending",  date: null,         comment: null },
      { name: "College Director",status: "waiting",  date: null,         comment: null },
    ],
  },
  {
    id: "APP-2024-006", formName: "Placement Registration",
    studentName: "Meera Joshi", rollNo: "CS21B028", dept: "Computer Science",
    submittedOn: "2024-01-20", status: "pending", currentStep: 0, totalSteps: 2,
    steps: [
      { name: "Mentor",            status: "pending", date: null, comment: null },
      { name: "Placement Director",status: "waiting", date: null, comment: null },
    ],
  },
];

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const NOTIFICATIONS = [
  { id: 1, type: "approval",  title: "Bonafide Certificate Approved!",  message: "Your application APP-2024-001 has been fully approved. Download your certificate.", time: "2 hours ago",  read: false, icon: "✅" },
  { id: 2, type: "reminder",  title: "Deadline Reminder",               message: "Exam fee payment deadline is in 3 days. Submit your fee payment request.",          time: "5 hours ago",  read: false, icon: "⏰" },
  { id: 3, type: "pending",   title: "Application Under Review",         message: "Your Leave Application is pending mentor approval.",                                  time: "1 day ago",    read: true,  icon: "🔄" },
  { id: 4, type: "rejection", title: "Internship NOC Rejected",          message: "Your NOC for TCS has been rejected. Reason: CGPA below 7.5.",                        time: "2 days ago",   read: true,  icon: "❌" },
];

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
export const ANALYTICS = {
  totalForms: 1247,
  pendingApprovals: 34,
  approvedThisMonth: 189,
  rejectedThisMonth: 12,
  avgProcessingDays: 3.2,
  byCategory: [
    { name: "Certificate", count: 412, color: "#e85d26" },
    { name: "Leave",       count: 387, color: "#2563eb" },
    { name: "Placement",   count: 198, color: "#059669" },
    { name: "Fee",         count: 143, color: "#7c3aed" },
    { name: "Hostel",      count: 107, color: "#06b6d4" },
  ],
  monthly: [
    { month: "Aug", forms: 89  },
    { month: "Sep", forms: 134 },
    { month: "Oct", forms: 112 },
    { month: "Nov", forms: 98  },
    { month: "Dec", forms: 67  },
    { month: "Jan", forms: 145 },
  ],
};

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
export const ROLE_LABELS = {
  student:            "Student",
  mentor:             "Mentor",
  hod:                "Head of Department",
  college_admin:      "College Admin",
  placement_director: "Placement Director",
  college_director:   "College Director",
};

export const ROLE_COLORS = {
  student:            "#e85d26",
  mentor:             "#2563eb",
  hod:                "#7c3aed",
  college_admin:      "#059669",
  placement_director: "#f59e0b",
  college_director:   "#dc2626",
};

export const NAV_ITEMS = {
  student: [
    { key: "dashboard",       label: "Dashboard",      icon: "⊞" },
    { key: "browse-forms",    label: "Browse Forms",   icon: "🗂" },
    { key: "my-applications", label: "My Applications",icon: "📋" },
    { key: "notifications",   label: "Notifications",  icon: "🔔", badge: 2 },
  ],
  mentor: [
    { key: "dashboard",        label: "Dashboard",        icon: "⊞" },
    { key: "pending-approvals",label: "Pending Approvals",icon: "⏳", badge: 2 },
    { key: "history",          label: "Approval History", icon: "📜" },
    { key: "notifications",    label: "Notifications",    icon: "🔔" },
  ],
  hod: [
    { key: "dashboard",        label: "Dashboard",        icon: "⊞" },
    { key: "pending-approvals",label: "Pending Approvals",icon: "⏳", badge: 3 },
    { key: "history",          label: "Approval History", icon: "📜" },
    { key: "reports",          label: "Reports",          icon: "📊" },
    { key: "notifications",    label: "Notifications",    icon: "🔔" },
  ],
  college_admin: [
    { key: "dashboard",        label: "Dashboard",           icon: "⊞" },
    { key: "manage-forms",     label: "Manage Forms",        icon: "📝" },
    { key: "manage-users",     label: "Manage Users",        icon: "👥" },
    { key: "all-applications", label: "All Applications",    icon: "📋" },
    { key: "reports",          label: "Reports & Analytics", icon: "📊" },
  ],
  placement_director: [
    { key: "dashboard",          label: "Dashboard",        icon: "⊞" },
    { key: "pending-approvals",  label: "Pending Approvals",icon: "⏳", badge: 1 },
    { key: "placement-tracker",  label: "Student Tracker",  icon: "🎯" },
    { key: "reports",            label: "Reports",          icon: "📊" },
  ],
  college_director: [
    { key: "dashboard",        label: "Dashboard",       icon: "⊞" },
    { key: "pending-approvals",label: "Pending Approvals",icon: "⏳", badge: 4 },
    { key: "all-applications", label: "All Applications",icon: "📋" },
    { key: "reports",          label: "Analytics",       icon: "📊" },
    { key: "notifications",    label: "Notifications",   icon: "🔔" },
  ],
};
