const BASE_URL = "http://localhost:3000/api";

// ── Helper ─────────────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("token");

const headers = (isFormData = false) => {
  const h = { Authorization: `Bearer ${getToken()}` };
  if (!isFormData) h["Content-Type"] = "application/json";
  return h;
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// ── AUTH ───────────────────────────────────────────────────────────────────────
export const loginAPI = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(res);
  localStorage.setItem("token", data.token);         // store JWT
  localStorage.setItem("user",  JSON.stringify(data.user));
  return data.user;
};

export const getMeAPI = async () => {
  const res = await fetch(`${BASE_URL}/auth/me`, { headers: headers() });
  return handleResponse(res);
};

export const logoutAPI = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ── FORMS ──────────────────────────────────────────────────────────────────────
export const getFormsAPI = async (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/forms?${qs}`, { headers: headers() });
  return handleResponse(res);
};

export const getFormAPI = async (id) => {
  const res = await fetch(`${BASE_URL}/forms/${id}`, { headers: headers() });
  return handleResponse(res);
};

export const createFormAPI = async (formData) => {
  const res = await fetch(`${BASE_URL}/forms`, {
    method: "POST", headers: headers(),
    body: JSON.stringify(formData),
  });
  return handleResponse(res);
};

export const updateFormAPI = async (id, formData) => {
  const res = await fetch(`${BASE_URL}/forms/${id}`, {
    method: "PUT", headers: headers(),
    body: JSON.stringify(formData),
  });
  return handleResponse(res);
};

export const deleteFormAPI = async (id) => {
  const res = await fetch(`${BASE_URL}/forms/${id}`, {
    method: "DELETE", headers: headers(),
  });
  return handleResponse(res);
};

// ── APPLICATIONS ───────────────────────────────────────────────────────────────
export const submitApplicationAPI = async (formTemplateId, formData, remarks, files) => {
  const body = new FormData();
  body.append("formTemplateId", formTemplateId);
  body.append("formData", JSON.stringify(formData));
  body.append("remarks", remarks || "");
  files.forEach((file) => body.append("attachments", file));

  const res = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: headers(true),   // no Content-Type so browser sets multipart boundary
    body,
  });
  return handleResponse(res);
};

export const getApplicationsAPI = async (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/applications?${qs}`, { headers: headers() });
  return handleResponse(res);
};

export const getApplicationAPI = async (id) => {
  const res = await fetch(`${BASE_URL}/applications/${id}`, { headers: headers() });
  return handleResponse(res);
};

export const actionApplicationAPI = async (id, action, comment) => {
  const res = await fetch(`${BASE_URL}/applications/${id}/action`, {
    method: "PUT", headers: headers(),
    body: JSON.stringify({ action, comment }),
  });
  return handleResponse(res);
};

export const getAnalyticsAPI = async () => {
  const res = await fetch(`${BASE_URL}/applications/analytics`, { headers: headers() });
  return handleResponse(res);
};

// ── NOTIFICATIONS ──────────────────────────────────────────────────────────────
export const getNotificationsAPI = async () => {
  const res = await fetch(`${BASE_URL}/notifications`, { headers: headers() });
  return handleResponse(res);
};

export const markReadAPI = async (id) => {
  const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
    method: "PUT", headers: headers(),
  });
  return handleResponse(res);
};

export const markAllReadAPI = async () => {
  const res = await fetch(`${BASE_URL}/notifications/read-all`, {
    method: "PUT", headers: headers(),
  });
  return handleResponse(res);
};

// ── USERS (admin) ──────────────────────────────────────────────────────────────
export const getUsersAPI = async (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/users?${qs}`, { headers: headers() });
  return handleResponse(res);
};

export const createUserAPI = async (userData) => {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST", headers: headers(),
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
};

export const updateUserAPI = async (id, userData) => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PUT", headers: headers(),
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
};

export const deleteUserAPI = async (id) => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE", headers: headers(),
  });
  return handleResponse(res);
};