import StudentDashboard    from "./student/StudentDashboard";
import BrowseForms         from "./student/BrowseForms";
import MyApplications      from "./student/MyApplications";
import NotificationsPage   from "./NotificationsPage";
import PendingApprovalsPage from "./PendingApprovalsPage";
import GenericDashboard    from "./GenericDashboard";
import {
  HistoryPage,
  ReportsPage,
  AllApplicationsPage,
  ManageFormsPage,
  ManageUsersPage,
  PlacementTrackerPage,
} from "./admin/AdminPages";

export default function Router({ user, currentPage, onNavigate }) {
  // Student routes
  if (user.role === "student") {
    if (currentPage === "dashboard")       return <StudentDashboard user={user} onNavigate={onNavigate} />;
    if (currentPage === "browse-forms")    return <BrowseForms />;
    if (currentPage === "my-applications") return <MyApplications user={user} />;
    if (currentPage === "notifications")   return <NotificationsPage />;
  }

  // Shared routes
  if (currentPage === "dashboard")         return <GenericDashboard user={user} />;
  if (currentPage === "pending-approvals") return <PendingApprovalsPage />;
  if (currentPage === "history")           return <HistoryPage />;
  if (currentPage === "reports")           return <ReportsPage />;
  if (currentPage === "notifications")     return <NotificationsPage />;
  if (currentPage === "all-applications")  return <AllApplicationsPage />;

  // Admin routes
  if (currentPage === "manage-forms")      return <ManageFormsPage />;
  if (currentPage === "manage-users")      return <ManageUsersPage />;

  // Placement routes
  if (currentPage === "placement-tracker") return <PlacementTrackerPage />;

  // Default fallback
  return <GenericDashboard user={user} />;
}
