import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import Sidebar   from "./components/Sidebar";
import Router    from "./pages/Router";

function AppShell() {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");

  if (!user) return <LoginPage />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f2ed" }}>
      <Sidebar
        user={user}
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        onLogout={logout}
      />
      <main style={{ marginLeft: 240, flex: 1, minHeight: "100vh", overflowY: "auto" }}>
        <Router user={user} currentPage={currentPage} onNavigate={setCurrentPage} />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
