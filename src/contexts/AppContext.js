import { createContext, useContext, useState, useEffect, useCallback } from "react";

// Context must be created at module level, never inside a component
const AppContext = createContext({
  applications: [],
  notifications: [],
  unreadCount: 0,
  forms: [],
  loadingApps: false,
  loadingNotifs: false,
  submitApplication: async () => {},
  actionApplication: async () => {},
  markNotificationRead: async () => {},
  markAllRead: async () => {},
  refetchApps: async () => {},
  refetchNotifs: async () => {},
  refetchForms: async () => {},
  getPendingForRole: () => [],
  getPendingCountForRole: () => 0,
});

const BASE = "http://localhost:5000/api";

const apiCall = async (path, options = {}) => {
  const token      = localStorage.getItem("token");
  const isFormData = options.body instanceof FormData;
  const headers    = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
  };
  const res  = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export function AppProvider({ children }) {
  const [applications,  setApplications]  = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [forms,         setForms]         = useState([]);
  const [loadingApps,   setLoadingApps]   = useState(false);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const hasToken = () => !!localStorage.getItem("token");

  const fetchForms = useCallback(async () => {
    if (!hasToken()) return;
    try { setForms(await apiCall("/forms")); }
    catch (e) { console.error("fetchForms:", e.message); }
  }, []);

  const fetchApplications = useCallback(async () => {
    if (!hasToken()) return;
    setLoadingApps(true);
    try { setApplications(await apiCall("/applications")); }
    catch (e) { console.error("fetchApplications:", e.message); }
    finally { setLoadingApps(false); }
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!hasToken()) return;
    setLoadingNotifs(true);
    try { setNotifications(await apiCall("/notifications")); }
    catch (e) { console.error("fetchNotifications:", e.message); }
    finally { setLoadingNotifs(false); }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    if (!hasToken()) return;
    try {
      const data = await apiCall("/notifications/unread-count");
      setUnreadCount(data.count || 0);
    } catch (e) {}
  }, []);

  // Load data on mount if already logged in
  useEffect(() => {
    if (hasToken()) {
      fetchForms();
      fetchApplications();
      fetchNotifications();
      fetchUnreadCount();
    }
  }, []);

  // Poll every 30s to keep badge counts live
  useEffect(() => {
    const timer = setInterval(() => {
      if (hasToken()) fetchUnreadCount();
    }, 30000);
    return () => clearInterval(timer);
  }, [fetchUnreadCount]);

  const submitApplication = async (formTemplate, formData, remarks, files = []) => {
    const body = new FormData();
    body.append("formTemplateId", formTemplate._id);
    body.append("formData", JSON.stringify(formData));
    body.append("remarks", remarks || "");
    (files || []).forEach(f => body.append("attachments", f));
    const newApp = await apiCall("/applications", { method: "POST", body });
    await fetchApplications();
    await fetchNotifications();
    await fetchUnreadCount();
    return newApp.appId;
  };

  const actionApplication = async (mongoId, action, comment) => {
    await apiCall(`/applications/${mongoId}/action`, {
      method: "PUT",
      body: JSON.stringify({ action, comment }),
    });
    await fetchApplications();
    await fetchNotifications();
    await fetchUnreadCount();
  };

  const markNotificationRead = async (notifId) => {
    try {
      await apiCall(`/notifications/${notifId}/read`, { method: "PUT" });
      setNotifications(prev => prev.map(n =>
        (n._id === notifId || n.id === notifId) ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {}
  };

  const markAllRead = async () => {
    try {
      await apiCall("/notifications/read-all", { method: "PUT" });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {}
  };

  const getPendingForRole = (role) =>
    applications.filter(a =>
      (a.steps || []).some(s => s.role === role && s.status === "pending")
    );

  const getPendingCountForRole = (role) => getPendingForRole(role).length;

  return (
    <AppContext.Provider value={{
      applications, notifications, unreadCount, forms,
      loadingApps, loadingNotifs,
      submitApplication, actionApplication,
      markNotificationRead, markAllRead,
      refetchApps: fetchApplications,
      refetchNotifs: fetchNotifications,
      refetchForms: fetchForms,
      getPendingForRole,
      getPendingCountForRole,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// Safe hook — returns default values if used outside provider
export const useApp = () => useContext(AppContext);