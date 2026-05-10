import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_URL
  ?? (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const API = axios.create({
  baseURL,
});

// Attache le token automatiquement à chaque requête
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Intercepteur de réponse — gestion token expiré
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────
export const login    = (email, password) => API.post('/auth/login', { email, password });
export const register = (data)            => API.post('/auth/register', data);
export const logout   = ()                => API.post('/auth/logout');
export const getMe    = ()                => API.get('/auth/me');

// ─── Dashboard ──────────────────────────────────────────
export const getDashboardStats    = () => API.get('/dashboard/stats');
export const getMonthlyChart      = () => API.get('/dashboard/monthly');
export const getDistributionChart = () => API.get('/dashboard/distribution');
export const getTeacherSummary    = () => API.get('/dashboard/teachers');

// ─── Users ──────────────────────────────────────────────
export const getUsers      = (params) => API.get('/users', { params });
export const getUser       = (id)     => API.get(`/users/${id}`);
export const createUser    = (data)   => API.post('/users', data);
export const updateUser    = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser    = (id)     => API.delete(`/users/${id}`);

// ─── Teachers ───────────────────────────────────────────
export const getTeachers       = (params) => API.get('/teachers', { params });
export const getTeacher        = (id)     => API.get(`/teachers/${id}`);
export const getMyTeacherProfile = ()     => API.get('/teachers/me');
export const createTeacher     = (data)   => API.post('/teachers', data);
export const updateTeacher     = (id, data) => API.put(`/teachers/${id}`, data);
export const importTeachers    = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return API.post('/teachers/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const getTeacherBalance = (id, year) => API.get(`/teachers/${id}/balance`, { params: { year } });

// ─── Hours ──────────────────────────────────────────────
export const getHours        = (params) => API.get('/hours', { params });
export const getHour         = (id)     => API.get(`/hours/${id}`);
export const createHour      = (data)   => API.post('/hours', data);
export const updateHour      = (id, data) => API.put(`/hours/${id}`, data);
export const deleteHour      = (id)     => API.delete(`/hours/${id}`);
export const getRecentHours  = (limit)  => API.get('/hours/recent', { params: { limit } });

// ─── Validation ─────────────────────────────────────────
export const getPendingHours = ()       => API.get('/validation/pending');
export const validateHour    = (id)     => API.put(`/validation/${id}/validate`);
export const validateAllHours = ()      => API.put('/validation/validate-all');
export const contestHour     = (id, reason) => API.put(`/validation/${id}/contest`, { reason });

// ─── Settings ───────────────────────────────────────────
export const getEquivalences    = ()       => API.get('/settings/equivalences');
export const updateEquivalence  = (data)   => API.put('/settings/equivalences', data);
export const getHourlyRates     = ()       => API.get('/settings/rates');
export const updateHourlyRate   = (data)   => API.put('/settings/rates', data);
export const getAcademicYears   = ()       => API.get('/settings/academic-years');
export const getCurrentYear     = ()       => API.get('/settings/academic-years/current');
export const createAcademicYear = (data)   => API.post('/settings/academic-years', data);
export const activateYear       = (id)     => API.put(`/settings/academic-years/${id}/activate`);
export const closeYear          = (id)     => API.put(`/settings/academic-years/${id}/close`);

// ─── Academic ───────────────────────────────────────────
export const getDepartments  = ()       => API.get('/academic/departments');
export const getUEs          = (params) => API.get('/academic/ues', { params });
export const getSubjects     = (params) => API.get('/academic/subjects', { params });
export const createSubject   = (data)   => API.post('/academic/subjects', data);

// ─── Export ─────────────────────────────────────────────
export const exportTeacherPDF  = (teacherId) => API.get(`/export/pdf/${teacherId}`, { responseType: 'blob' });
export const exportGlobalPDF   = ()          => API.get('/export/pdf-global', { responseType: 'blob' });
export const exportExcel       = ()          => API.get('/export/excel', { responseType: 'blob' });
export const getPaymentStatus  = ()          => API.get('/export/payments');

// ─── Audit ──────────────────────────────────────────────
export const getAuditLogs    = (params) => API.get('/audit', { params });
export const getRecentAudit  = (limit)  => API.get('/audit/recent', { params: { limit } });

// ─── Dashboard Extra ────────────────────────────────────
export const getDepartmentStats = () => API.get('/dashboard/departments');
export const getProgramStats    = () => API.get('/dashboard/programs');

export default API;