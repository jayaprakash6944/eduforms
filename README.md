# 🎓 EduForms – Digital College Forms Management System

A fully working React frontend with role-based dashboards for 6 user types.

---

## 📁 File Structure

```
college-forms/
│
├── public/
│   └── index.html                         # HTML entry point + Google Fonts
│
├── src/
│   │
│   ├── index.js                           # React DOM entry point
│   ├── index.css                          # Global styles, CSS variables, animations
│   ├── App.js                             # Root – AuthProvider + Sidebar + Router
│   │
│   ├── data/
│   │   └── mockData.js                    # All mock data + constants
│   │                                        (USERS, FORM_TEMPLATES, APPLICATIONS,
│   │                                         NOTIFICATIONS, ANALYTICS,
│   │                                         ROLE_LABELS, ROLE_COLORS, NAV_ITEMS)
│   │
│   ├── contexts/
│   │   └── AuthContext.js                 # Login / logout state via React Context
│   │
│   ├── components/
│   │   ├── UI.jsx                         # Shared UI primitives:
│   │   │                                    StatusBadge, Avatar, StatCard,
│   │   │                                    Btn, PageWrapper, FilterTabs,
│   │   │                                    Table, Tr, Td, EmptyState
│   │   └── Sidebar.jsx                    # Role-aware sidebar navigation
│   │
│   └── pages/
│       ├── Router.jsx                     # Maps currentPage → component per role
│       │
│       ├── LoginPage.jsx                  # Login form + 6 demo quick-login buttons
│       ├── NotificationsPage.jsx          # Notification centre (mark read)
│       ├── PendingApprovalsPage.jsx       # Approve / Reject with comments
│       │                                   (shared: mentor, hod, directors)
│       ├── GenericDashboard.jsx           # Default dashboard for staff roles
│       │
│       ├── student/
│       │   ├── StudentDashboard.jsx       # Stats, quick-apply, deadlines widget
│       │   ├── BrowseForms.jsx            # Search + filter grid + 3-step form wizard
│       │   └── MyApplications.jsx         # Application list + timeline detail view
│       │
│       └── admin/
│           └── AdminPages.jsx             # Barrel of admin/director pages:
│                                            HistoryPage
│                                            ReportsPage (bar chart + analytics)
│                                            AllApplicationsPage
│                                            ManageFormsPage (add/delete templates)
│                                            ManageUsersPage
│                                            PlacementTrackerPage
│
└── package.json
```

---

## 🚀 Getting Started

```bash
# 1. Enter the project
cd college-forms

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Demo Login Credentials

| Role               | Email                       | Password      |
|--------------------|-----------------------------|---------------|
| 🎓 Student         | student@college.edu         | student123    |
| 👨‍🏫 Mentor         | mentor@college.edu          | mentor123     |
| 🏛️ HOD             | hod@college.edu             | hod123        |
| ⚙️ College Admin   | admin@college.edu           | admin123      |
| 💼 Placement Dir.  | placement@college.edu       | placement123  |
| 👨‍💼 College Dir.   | director@college.edu        | director123   |

> Click any role button on the login page to auto-fill credentials, then press **Sign In**.

---

## ✅ Features by Role

### 🎓 Student
- Dashboard with stats, quick-apply shortcuts, notification preview, deadlines
- Browse & search 12 form types across 6 categories
- 3-step form wizard (fill → review → submit) with file upload UI
- Application tracker with live approval timeline
- Notifications centre

### 👨‍🏫 Mentor
- Pending approvals queue
- Approve / Reject with typed comments
- Approval history log
- Notifications

### 🏛️ HOD
- All mentor features +
- Reports & analytics page

### ⚙️ College Admin
- Manage form templates (add / edit / delete)
- Manage all users
- All applications view (filterable)
- Reports & analytics

### 💼 Placement Director
- Pending NOC / placement approvals
- Student placement tracker with drive schedule

### 👨‍💼 College Director
- Executive dashboard
- All pending approvals (final authority)
- All applications overview
- Analytics dashboard

---

## 🎨 Design System

| Token          | Value              |
|----------------|--------------------|
| Primary Navy   | `#0d1b2a`          |
| Accent Coral   | `#e85d26`          |
| Background     | `#f5f2ed` (cream)  |
| Font           | Sora + JetBrains Mono |
| Border radius  | 10px – 18px        |
| Shadow         | `0 4px 24px rgba(13,27,42,0.10)` |
