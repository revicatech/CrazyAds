import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const fetchCaseStudies = () => API.get('/case-studies').then((r) => r.data.data);
export const fetchCaseStudyBySlug = (slug) => API.get(`/case-studies/${slug}`).then((r) => r.data.data);
export const fetchCaseCategories = () => API.get('/case-categories').then((r) => r.data.data);
export const fetchIndustries = () => API.get('/industries').then((r) => r.data.data);
export const fetchPortfolio = () => API.get('/portfolio').then((r) => r.data.data);
export const fetchPortfolioCategories = () => API.get('/portfolio-categories').then((r) => r.data.data);
export const fetchServices = () => API.get('/services').then((r) => r.data.data);
export const fetchTeam = () => API.get('/team').then((r) => r.data.data);
export const fetchWhyUs = () => API.get('/why-us').then((r) => r.data.data);

export default API;
