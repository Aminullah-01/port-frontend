import { apiClient, buildQueryString, resourceUrl } from "@/lib/api-client";
import type {
  BlogData,
  CertificateData,
  ContactMessageData,
  DashboardData,
  LoginResponse,
  ProfileData,
  ProjectData,
  ServiceData,
  SettingData,
  SkillData,
  User,
} from "@/types/api";

/* Auth */
export const authApi = {
  login: (email: string, password: string) =>
    apiClient<LoginResponse>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () => apiClient<null>("/logout", { method: "POST" }),
  user: () => apiClient<User>("/user"),
  changePassword: (data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) =>
    apiClient<null>("/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  forgotPassword: (email: string) =>
    apiClient<{ email: string; reset_code?: string }>("/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (data: {
    email: string;
    code: string;
    password: string;
    password_confirmation: string;
  }) =>
    apiClient<LoginResponse>("/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

/* Profile */
export const profileApi = {
  get: () => apiClient<ProfileData>("/profile"),
  update: (data: FormData) =>
    apiClient<ProfileData>("/profile", {
      method: "POST",
      body: data,
    }),
};

/* Settings */
export const settingsApi = {
  get: () => apiClient<SettingData>("/settings"),
  update: (data: FormData | Record<string, unknown>) => {
    const isFormData = data instanceof FormData;
    return apiClient<SettingData>("/settings", {
      method: "POST",
      body: isFormData ? data : JSON.stringify(data),
      ...(!isFormData ? {} : {}),
    });
  },
};

/* Dashboard */
export const dashboardApi = {
  get: () => apiClient<DashboardData>("/dashboard"),
};

/* Projects */
export const projectsApi = {
  list: (params?: { per_page?: number; category?: string; featured?: boolean }) =>
    apiClient<ProjectData[]>(`/projects${buildQueryString(params || {})}`),
  get: (slug: string) => apiClient<ProjectData>(`/projects/${slug}`),
  create: (data: FormData) => apiClient<ProjectData>("/projects", { method: "POST", body: data }),
  update: (id: number, data: FormData) =>
    apiClient<ProjectData>(`/projects/${id}`, { method: "POST", body: data }),
  delete: (id: number) => apiClient<null>(`/projects/${id}`, { method: "DELETE" }),
};

/* Blogs */
export const blogsApi = {
  list: (params?: { per_page?: number; category?: string; status?: string }) =>
    apiClient<BlogData[]>(`/blogs${buildQueryString(params || {})}`),
  get: (id: number) => apiClient<BlogData>(`/blogs/${id}`),
  create: (data: FormData) => apiClient<BlogData>("/blogs", { method: "POST", body: data }),
  update: (id: number, data: FormData) =>
    apiClient<BlogData>(`/blogs/${id}`, { method: "POST", body: data }),
  delete: (id: number) => apiClient<null>(`/blogs/${id}`, { method: "DELETE" }),
};

/* Skills */
export const skillsApi = {
  list: (params?: { per_page?: number }) =>
    apiClient<SkillData[]>(`/skills${buildQueryString(params || {})}`),
  get: (id: number) => apiClient<SkillData>(`/skills/${id}`),
  create: (data: Record<string, unknown>) =>
    apiClient<SkillData>("/skills", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Record<string, unknown>) =>
    apiClient<SkillData>(`/skills/${id}`, { method: "POST", body: JSON.stringify(data) }),
  delete: (id: number) => apiClient<null>(`/skills/${id}`, { method: "DELETE" }),
};

/* Services */
export const servicesApi = {
  list: (params?: { per_page?: number }) =>
    apiClient<ServiceData[]>(`/services${buildQueryString(params || {})}`),
  get: (id: number) => apiClient<ServiceData>(`/services/${id}`),
  create: (data: Record<string, unknown>) =>
    apiClient<ServiceData>("/services", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Record<string, unknown>) =>
    apiClient<ServiceData>(`/services/${id}`, { method: "POST", body: JSON.stringify(data) }),
  delete: (id: number) => apiClient<null>(`/services/${id}`, { method: "DELETE" }),
};

/* Certificates */
export const certificatesApi = {
  list: (params?: { per_page?: number }) =>
    apiClient<CertificateData[]>(`/certificates${buildQueryString(params || {})}`),
  get: (id: number) => apiClient<CertificateData>(`/certificates/${id}`),
  create: (data: FormData) =>
    apiClient<CertificateData>("/certificates", { method: "POST", body: data }),
  update: (id: number, data: FormData) =>
    apiClient<CertificateData>(`/certificates/${id}`, { method: "POST", body: data }),
  delete: (id: number) => apiClient<null>(`/certificates/${id}`, { method: "DELETE" }),
};

/* Contact */
export const contactApi = {
  send: (data: { name: string; email: string; subject: string; message: string }) =>
    apiClient<ContactMessageData>("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  list: (params?: { per_page?: number; is_read?: boolean }) =>
    apiClient<ContactMessageData[]>(`/contact${buildQueryString(params || {})}`),
  get: (id: number) => apiClient<ContactMessageData>(`/contact/${id}`),
  markAsRead: (id: number) =>
    apiClient<ContactMessageData>(`/contact/${id}/read`, { method: "POST" }),
  delete: (id: number) => apiClient<null>(`/contact/${id}`, { method: "DELETE" }),
};

/* Analytics */
export const analyticsApi = {
  trackVisit: (page_url?: string) =>
    apiClient<null>("/analytics/visit", {
      method: "POST",
      body: JSON.stringify({ page_url: page_url || "/" }),
    }),
  trackCvDownload: (page_url?: string) =>
    apiClient<null>("/analytics/cv-download", {
      method: "POST",
      body: JSON.stringify({ page_url: page_url || "/resume" }),
    }),
};
