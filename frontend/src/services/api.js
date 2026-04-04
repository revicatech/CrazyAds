import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const fetchCaseStudies = () => API.get('/case-studies').then((r) => r.data.data);
export const fetchCaseStudyBySlug = (slug) => API.get(`/case-studies/${slug}`).then((r) => r.data.data);
export const fetchCaseCategories = () => API.get('/case-categories').then((r) => r.data.data);
export const fetchIndustries = () => API.get('/industries').then((r) => r.data.data);
export const fetchPortfolio = () => API.get('/portfolio').then((r) => r.data.data);
export const fetchPortfolioBySlug = (slug) => API.get(`/portfolio/slug/${slug}`).then((r) => r.data.data);
export const fetchPortfolioCategories = () => API.get('/portfolio-categories').then((r) => r.data.data);
export const fetchServices = () => API.get('/services').then((r) => r.data.data);
export const fetchTeam = () => API.get('/team').then((r) => r.data.data);
export const fetchWhyUs = () => API.get('/why-us').then((r) => r.data.data);
export const fetchEvents = () => API.get('/events').then((r) => r.data.data);
export const fetchEventById = (id) => API.get(`/events/${id}`).then((r) => r.data.data);
export const fetchSiteContent = (group) =>
  API.get(`/site-content${group ? `?group=${group}` : ''}`).then((r) => {
    const map = {};
    r.data.data.forEach((item) => { map[item.key] = item.value; });
    return map;
  });

export default API;
