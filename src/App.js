// ─────────────────────────────────────────────────────────────────────────────
// App.js  —  Top-level state machine
// Screens: "portal" → "login" (per-role) / "register" → dashboard
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppProvider, useApp }   from "./contexts/AppContext";
import PortalPage  from "./pages/PortalPage";
import LoginPage   from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Sidebar     from "./components/Sidebar";
import Router      from "./pages/Router";

function AppShell() {
  const { user, logout } = useAuth();
  const { unreadCount, getPendingCountForRole, openFeedbackCount, refetchApps, refetchNotifs, refetchForms } = useApp();

  // Pre-app screen: "portal" | "login" | "register"
  const [preScreen,    setPreScreen]    = useState("portal");
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentPage,  setCurrentPage]  = useState("dashboard");

  // When user logs in, fetch all their data
  useEffect(() => {
    if (user) {
      refetchForms();
      refetchApps();
      refetchNotifs();
    }
  }, [user]);

  // ── Logged in → full app ──────────────────────────────────────────────────
  if (user) {
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
          openFeedbackCount={openFeedbackCount}
        />
        <main style={{ marginLeft:240, flex:1, minHeight:"100vh", overflowY:"auto" }}>
          <Router user={user} currentPage={currentPage} onNavigate={setCurrentPage} />
        </main>
      </div>
    );
  }

  // ── Portal selection ──────────────────────────────────────────────────────
  if (preScreen === "portal") return (
    <PortalPage onSelectPortal={(role) => {
      setSelectedRole(role);
      setPreScreen("login");
    }}/>
  );

  // ── Role login ────────────────────────────────────────────────────────────
  if (preScreen === "login") return (
    <LoginPage
      role={selectedRole}
      onBack={() => setPreScreen("portal")}
      onRegister={() => setPreScreen("register")}
    />
  );

  // ── Register ──────────────────────────────────────────────────────────────
  if (preScreen === "register") return (
    <RegisterPage
      preRole={selectedRole}
      onBack={() => setPreScreen("login")}
      onSuccess={(role) => {
        setSelectedRole(role);
        setPreScreen("login");
      }}
    />
  );

  return null;
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