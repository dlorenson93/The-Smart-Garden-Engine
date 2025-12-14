import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (import.meta.env.DEV) {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Log responses and errors
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  signup: (email: string, password: string) =>
    api.post('/auth/signup', { email, password }),
  
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

// Profile API
export const profileApi = {
  get: () => api.get('/profile'),
  
  create: (data: {
    name: string;
    location: string;
    experienceLevel: string;
    gardenType: string;
  }) => api.post('/profile', data),
  
  update: (data: Partial<{
    name: string;
    location: string;
    experienceLevel: string;
    gardenType: string;
  }>) => api.put('/profile', data),
  
  upsert: (data: {
    name: string;
    location: string;
    experienceLevel: string;
    gardenType: string;
    climateZone?: string;
    postalCode?: string;
  }) => api.post('/profile/upsert', data),
};

// Gardens API
export const gardensApi = {
  getAll: () => api.get('/gardens'),
  
  get: (id: string) => api.get(`/gardens/${id}`),
  
  create: (data: { name: string; description?: string }) =>
    api.post('/gardens', data),
  
  update: (id: string, data: { name?: string; description?: string }) =>
    api.put(`/gardens/${id}`, data),
  
  delete: (id: string) => api.delete(`/gardens/${id}`),
  
  getBeds: (gardenId: string) => api.get(`/gardens/${gardenId}/beds`),
  
  createBed: (gardenId: string, data: {
    name: string;
    length: number;
    width: number;
    sunExposure: string;
    notes?: string;
  }) => api.post(`/gardens/${gardenId}/beds`, data),
};

// Beds API
export const bedsApi = {
  get: (id: string) => api.get(`/beds/${id}`),
  
  update: (id: string, data: Partial<{
    name: string;
    length: number;
    width: number;
    sunExposure: string;
    notes: string;
  }>) => api.put(`/beds/${id}`, data),
  
  delete: (id: string) => api.delete(`/beds/${id}`),
};

// Crops API
export const cropsApi = {
  getAll: (params?: {
    category?: string;
    difficulty?: string;
    sunRequirement?: string;
  }) => api.get('/crops', { params }),
  
  get: (id: string) => api.get(`/crops/${id}`),
  
  getRecommendations: (bedId: string) =>
    api.get('/crops/recommendations', { params: { bedId } }),
};

// Plantings API
export const plantingsApi = {
  getAll: () => api.get('/plantings'),
  
  get: (id: string) => api.get(`/plantings/${id}`),
  
  create: (data: {
    gardenId: string;
    bedId: string;
    cropId: string;
    variety?: string;
    plantingDate: string;
    quantity: number;
  }) => api.post('/plantings', data),
  
  update: (id: string, data: { quantity?: number }) =>
    api.put(`/plantings/${id}`, data),
  
  delete: (id: string) => api.delete(`/plantings/${id}`),
  
  getHarvests: (id: string) => api.get(`/plantings/${id}/harvests`),
  
  logHarvest: (id: string, data: {
    date: string;
    amount: number;
    units: string;
    notes?: string;
    surplusFlag?: boolean;
    surplusAmount?: number;
  }) => api.post(`/plantings/${id}/harvests`, data),
};

// Tasks API
export const tasksApi = {
  getAll: (scope?: 'today' | 'upcoming' | 'completed' | 'all') =>
    api.get('/tasks', { params: { scope } }),
  
  get: (id: string) => api.get(`/tasks/${id}`),
  
  complete: (id: string) => api.put(`/tasks/${id}/complete`),
  
  incomplete: (id: string) => api.put(`/tasks/${id}/incomplete`),
  
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

// Integration API
export const integrationApi = {
  getStatus: () => api.get('/integration/status'),
  
  syncHarvest: (harvestLogId: string) =>
    api.post('/integration/harvest-sync', { harvestLogId }),
  
  syncProfile: () => api.post('/integration/grower-profile-sync'),
  
  getSurplusInterest: (harvestLogId: string) =>
    api.post('/integration/surplus-interest', { harvestLogId }),
};

// Photos API
export const photosApi = {
  getAll: (params?: { plantingId?: string; gardenId?: string; type?: string }) =>
    api.get('/photos', { params }),
  
  create: (data: {
    url: string;
    caption?: string;
    type: 'progress' | 'harvest' | 'problem' | 'general';
    plantingId?: string;
    gardenId?: string;
  }) => api.post('/photos', data),
  
  delete: (id: string) => api.delete(`/photos/${id}`),
};

// Seeds API
export const seedsApi = {
  getAll: (params?: { cropName?: string; sortBy?: string; order?: string }) =>
    api.get('/seeds', { params }),
  
  get: (id: string) => api.get(`/seeds/${id}`),
  
  create: (data: {
    cropName: string;
    variety?: string;
    quantity: number;
    unit?: 'packets' | 'seeds' | 'grams' | 'oz';
    source?: string;
    purchaseDate?: string;
    expirationDate?: string;
    notes?: string;
  }) => api.post('/seeds', data),
  
  update: (id: string, data: Partial<{
    cropName: string;
    variety: string;
    quantity: number;
    unit: 'packets' | 'seeds' | 'grams' | 'oz';
    source: string;
    purchaseDate: string;
    expirationDate: string;
    notes: string;
  }>) => api.put(`/seeds/${id}`, data),
  
  delete: (id: string) => api.delete(`/seeds/${id}`),
  
  use: (id: string, amount: number) => api.post(`/seeds/${id}/use`, { amount }),
};

// Soil API
export const soilApi = {
  // Get soil profile for a garden or bed
  getProfile: (scopeType: 'garden' | 'bed', scopeId: string) =>
    api.get(`/soil/profile/${scopeType}/${scopeId}`),
  
  // Create or update soil profile
  updateProfile: (
    scopeType: 'garden' | 'bed',
    scopeId: string,
    data: {
      soilType?: string;
      texture?: string;
      drainage?: 'poor' | 'average' | 'well';
      ph?: number;
      organicMatter?: number;
      notes?: string;
    }
  ) => api.put(`/soil/profile/${scopeType}/${scopeId}`, data),
  
  // Add a soil test
  addTest: (data: {
    scopeType: 'garden' | 'bed';
    scopeId: string;
    testDate: string;
    ph?: number;
    nitrogen?: number;
    phosphorus?: number;
    potassium?: number;
    moisture?: number;
    salinity?: number;
    source: 'manual' | 'kit' | 'lab' | 'sensor';
    notes?: string;
  }) => api.post('/soil/test', data),
  
  // Get tests for a scope
  getTests: (scopeType: 'garden' | 'bed', scopeId: string) =>
    api.get(`/soil/tests/${scopeType}/${scopeId}`),
  
  // Add a soil event (amendment, compost, etc.)
  addEvent: (data: {
    scopeType: 'garden' | 'bed';
    scopeId: string;
    eventType: 'amendment' | 'compost' | 'mulch' | 'lime' | 'sulfur' | 'fertilizer';
    amount: string;
    eventDate: string;
    notes?: string;
  }) => api.post('/soil/event', data),
  
  // Get events for a scope
  getEvents: (scopeType: 'garden' | 'bed', scopeId: string) =>
    api.get(`/soil/events/${scopeType}/${scopeId}`),
  
  // Get soil insights (health score + recommendations)
  getInsights: (scopeType: 'garden' | 'bed', scopeId: string) =>
    api.get(`/soil/insights/${scopeType}/${scopeId}`),
  
  // Get USDA soil lookup by location
  lookupByLocation: (lat: number, lon: number) =>
    api.get('/soil/lookup/location', { params: { lat, lon } }),
  
  // Get amendment products for a goal
  getAmendments: (goal: string) =>
    api.get(`/soil/amendments/${goal}`),
  
  // Get all user's soil profiles (for dashboard)
  getUserSummary: () => api.get('/soil/user-summary'),
};

export default api;
