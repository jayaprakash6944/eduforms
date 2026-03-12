import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppProvider, useApp }   from "./contexts/AppContext";
import LoginPage from "./pages/LoginPage";
import Sidebar   from "./components/Sidebar";
import Router    from "./pages/Router";

function AppShell() {
  const { user, logout }    = useAuth();
  const {
    unreadCount,
    getPendingCountForRole,
    refetchApps,
    refetchNotifs,
    refetchForms,
  } = useApp();

  const [currentPage, setCurrentPage] = useState("dashboard");

  // When user logs in, load all their data from backend
  useEffect(() => {
    if (user) {
      refetchForms();
      refetchApps();
      refetchNotifs();
    }
  }, [user]);

  if (!user) return <LoginPage />;

  const pendingCount = getPendingCountForRole(user.role);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#f5f2ed" }}>
      <Sidebar
        user={user}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={logout}
        unreadCount={unreadCount}
        pendingCount={pendingCount}
      />
      <main style={{ marginLeft:240, flex:1, minHeight:"100vh", overflowY:"auto" }}>
        <Router user={user} currentPage={currentPage} onNavigate={setCurrentPage} />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </AuthProvider>
  );
}