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

// Compress and resize an image File in the browser before uploading
const compressImage = (file) =>
  new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1920;
      const scale = img.width > MAX ? MAX / img.width : 1;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => resolve(new File([blob], file.name, { type: 'image/webp' })), 'image/webp', 0.8);
    };
    img.src = url;
  });

// Upload a file directly to Cloudinary (avoids double-hop through Vercel)
const uploadImageDirect = async (file) => {
  const compressed = await compressImage(file);
  const { timestamp, signature, apiKey, cloudName, folder } =
    await API.get('/upload/sign').then((r) => r.data);
  const fd = new FormData();
  fd.append('file', compressed);
  fd.append('timestamp', timestamp);
  fd.append('signature', signature);
  fd.append('api_key', apiKey);
  fd.append('folder', folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: fd,
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.secure_url;
};

// Replaces any image File in a FormData with the Cloudinary URL before sending to backend
const resolveImages = async (formData) => {
  const imageFile = formData.get('image');
  if (imageFile instanceof File) {
    const url = await uploadImageDirect(imageFile);
    formData.set('image', url);
  }
  return formData;
};

// FormData CRUD for models with image uploads
const crudWithUpload = (resource) => ({
  ...crud(resource),
  create: async (formData) => {
    await resolveImages(formData);
    return API.post(`/${resource}`, formData).then((r) => r.data.data);
  },
  update: async (id, formData) => {
    await resolveImages(formData);
    return API.put(`/${resource}/${id}`, formData).then((r) => r.data.data);
  },
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
