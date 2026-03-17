const BASE = "http://localhost:5000/api";

export const getToken   = ()  => localStorage.getItem("token");
export const saveToken  = (t) => localStorage.setItem("token", t);
export const clearToken = ()  => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const apiFetch = async (path, options = {}) => {
  const token = getToken();
  const headers = { ...(options.headers || {}) };
  if (token) headers["Authorization"] = "Bearer " + token;
  if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const res  = await fetch(BASE + path, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed " + res.status);
  return data;
};

// AUTH
export const loginAPI = async (email, password) => {
  const data = await apiFetch("/auth/login", { method:"POST", body: JSON.stringify({ email, password }) });
  saveToken(data.token);
  localStorage.setItem("eduforms_user", JSON.stringify(data.user));
  return data.user;
};
export const getMeAPI  = async () => { const d = await apiFetch("/auth/me"); return d.user; };
export const logoutAPI = ()       => clearToken();

// FORMS
export const getFormsAPI = async (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiFetch("/forms" + (qs ? "?" + qs : ""));
};
export const getFormAPI = (id) => apiFetch("/forms/" + id);

// APPLICATIONS
export const submitApplicationAPI = async (formTemplateId, formData, remarks, files) => {
  const body = new FormData();
  body.append("formTemplateId", formTemplateId);
  body.append("formData", JSON.stringify(formData || {}));
  body.append("remarks",  remarks || "");
  (files || []).forEach(f => body.append("attachments", f));
  const token = getToken();
  const res   = await fetch(BASE + "/applications", {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
    body,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Submit failed");
  return data;
};
export const getApplicationsAPI = async (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiFetch("/applications" + (qs ? "?" + qs : ""));
};
export const getMyStatsAPI     = () => apiFetch("/applications/mystats");
export const getApplicationAPI = (id) => apiFetch("/applications/" + id);
export const actionApplicationAPI = (id, action, comment) =>
  apiFetch("/applications/" + id + "/action", { method:"PUT", body: JSON.stringify({ action, comment }) });
export const getAnalyticsAPI = () => apiFetch("/applications/analytics");

// NOTIFICATIONS
export const getNotificationsAPI = () => apiFetch("/notifications");
export const getUnreadCountAPI   = () => apiFetch("/notifications/unread-count");
export const markReadAPI         = (id) => apiFetch("/notifications/" + id + "/read", { method:"PUT" });
export const markAllReadAPI      = ()   => apiFetch("/notifications/read-all",         { method:"PUT" });

// USERS
export const getUsersAPI   = (p={}) => apiFetch("/users?" + new URLSearchParams(p));
export const createUserAPI = (b)    => apiFetch("/users",      { method:"POST",   body: JSON.stringify(b) });
export const updateUserAPI = (id,b) => apiFetch("/users/"+id,  { method:"PUT",    body: JSON.stringify(b) });
export const deleteUserAPI = (id)   => apiFetch("/users/"+id,  { method:"DELETE" });

// DASHBOARD
export const getStudentDashboardAPI = () => apiFetch("/dashboard/student");
export const getStaffDashboardAPI   = () => apiFetch("/dashboard/staff");