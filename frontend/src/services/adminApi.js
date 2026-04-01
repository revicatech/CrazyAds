import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const adminLogin = (username, password) =>
  API.post('/auth/login', { username, password }).then((r) => r.data);
export const adminVerify = () =>
  API.get('/auth/me').then((r) => r.data);

// Site Content
export const getSiteContent = (group) =>
  API.get(`/site-content${group ? `?group=${group}` : ''}`).then((r) => r.data.data);
export const updateSiteContentKey = (key, value, group) =>
  API.put(`/site-content/${key}`, { value, group }).then((r) => r.data.data);
export const bulkUpdateSiteContent = (items) =>
  API.put('/site-content', items).then((r) => r.data.data);

// Generic CRUD helpers
const crud = (resource) => ({
  getAll: () => API.get(`/${resource}`).then((r) => r.data.data),
  getById: (id) => API.get(`/${resource}/${id}`).then((r) => r.data.data),
  create: (data) => API.post(`/${resource}`, data).then((r) => r.data.data),
  update: (id, data) => API.put(`/${resource}/${id}`, data).then((r) => r.data.data),
  remove: (id) => API.delete(`/${resource}/${id}`).then((r) => r.data),
});

// FormData CRUD for models with image uploads
const crudWithUpload = (resource) => ({
  ...crud(resource),
  create: (formData) =>
    API.post(`/${resource}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data.data),
  update: (id, formData) =>
    API.put(`/${resource}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data.data),
});

export const servicesApi = crudWithUpload('services');
export const industriesApi = crudWithUpload('industries');
export const portfolioApi = crudWithUpload('portfolio');
export const portfolioCategoriesApi = crud('portfolio-categories');
export const caseStudiesApi = crudWithUpload('case-studies');
export const caseCategoriesApi = crud('case-categories');
export const teamApi = crudWithUpload('team');
export const whyUsApi = crud('why-us');
export const eventsApi = crudWithUpload('events');

export default API;
