// ─────────────────────────────────────────────────────────────────────────────
// src/utils/api.js
// Copy this file to:  digigicol/src/utils/api.js
// Create the folder:  digigicol/src/utils/
// ─────────────────────────────────────────────────────────────────────────────

const BASE = "http://localhost:5000/api";

// ── Token helpers ─────────────────────────────────────────────────────────────
const getToken = ()       => localStorage.getItem("token");
const setToken = (t)      => localStorage.setItem("token", t);
const clearToken = ()     => { localStorage.removeItem("token"); localStorage.removeItem("user"); };

const authHeaders = (formData = false) => {
  const h = { Authorization: `Bearer ${getToken()}` };
  if (!formData) h["Content-Type"] = "application/json";
  return h;
};

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────
export const loginAPI = async (email, password) => {
  const res  = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await handle(res);
  setToken(data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data.user;
};

export const getMeAPI = async () => {
  const res = await fetch(`${BASE}/auth/me`, { headers: authHeaders() });
  return handle(res);
};

export const logoutAPI = () => clearToken();

// ─────────────────────────────────────────────────────────────────────────────
// FORMS
// ─────────────────────────────────────────────────────────────────────────────
export const getFormsAPI = async (params = {}) => {
  const qs  = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/forms?${qs}`, { headers: authHeaders() });
  return handle(res);
};

export const getFormAPI = async (id) => {
  const res = await fetch(`${BASE}/forms/${id}`, { headers: authHeaders() });
  return handle(res);
};

export const createFormAPI = async (body) => {
  const res = await fetch(`${BASE}/forms`, {
    method: "POST", headers: authHeaders(), body: JSON.stringify(body),
  });
  return handle(res);
};

export const updateFormAPI = async (id, body) => {
  const res = await fetch(`${BASE}/forms/${id}`, {
    method: "PUT", headers: authHeaders(), body: JSON.stringify(body),
  });
  return handle(res);
};

export const deleteFormAPI = async (id) => {
  const res = await fetch(`${BASE}/forms/${id}`, {
    method: "DELETE", headers: authHeaders(),
  });
  return handle(res);
};

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const submitApplicationAPI = async (formTemplateId, formData, remarks, files) => {
  const body = new FormData();
  body.append("formTemplateId", formTemplateId);
  body.append("formData", JSON.stringify(formData));
  body.append("remarks", remarks || "");
  (files || []).forEach(f => body.append("attachments", f));

  const res = await fetch(`${BASE}/applications`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` }, // NO Content-Type for multipart
    body,
  });
  return handle(res);
};

export const getApplicationsAPI = async (params = {}) => {
  const qs  = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/applications?${qs}`, { headers: authHeaders() });
  return handle(res);
};

export const getApplicationAPI = async (id) => {
  const res = await fetch(`${BASE}/applications/${id}`, { headers: authHeaders() });
  return handle(res);
};

export const actionApplicationAPI = async (id, action, comment) => {
  const res = await fetch(`${BASE}/applications/${id}/action`, {
    method: "PUT", headers: authHeaders(),
    body: JSON.stringify({ action, comment }),
  });
  return handle(res);
};

export const getAnalyticsAPI = async () => {
  const res = await fetch(`${BASE}/applications/analytics`, { headers: authHeaders() });
  return handle(res);
};

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const getNotificationsAPI = async () => {
  const res = await fetch(`${BASE}/notifications`, { headers: authHeaders() });
  return handle(res);
};

export const getUnreadCountAPI = async () => {
  const res = await fetch(`${BASE}/notifications/unread-count`, { headers: authHeaders() });
  return handle(res);
};

export const markReadAPI = async (id) => {
  const res = await fetch(`${BASE}/notifications/${id}/read`, {
    method: "PUT", headers: authHeaders(),
  });
  return handle(res);
};

export const markAllReadAPI = async () => {
  const res = await fetch(`${BASE}/notifications/read-all`, {
    method: "PUT", headers: authHeaders(),
  });
  return handle(res);
};

// ─────────────────────────────────────────────────────────────────────────────
// USERS (admin)
// ─────────────────────────────────────────────────────────────────────────────
export const getUsersAPI = async (params = {}) => {
  const qs  = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/users?${qs}`, { headers: authHeaders() });
  return handle(res);
};

export const createUserAPI = async (body) => {
  const res = await fetch(`${BASE}/users`, {
    method: "POST", headers: authHeaders(), body: JSON.stringify(body),
  });
  return handle(res);
};

export const updateUserAPI = async (id, body) => {
  const res = await fetch(`${BASE}/users/${id}`, {
    method: "PUT", headers: authHeaders(), body: JSON.stringify(body),
  });
  return handle(res);
};

export const deleteUserAPI = async (id) => {
  const res = await fetch(`${BASE}/users/${id}`, {
    method: "DELETE", headers: authHeaders(),
  });
  return handle(res);
};

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export const getStudentDashboardAPI = async () => {
  const res = await fetch(`${BASE}/dashboard/student`, { headers: authHeaders() });
  return handle(res);
};

export const getStaffDashboardAPI = async () => {
  const res = await fetch(`${BASE}/dashboard/staff`, { headers: authHeaders() });
  return handle(res);
};