import api from './api';

export const registerUser = (payload) => api.post('/auth/register', payload);
export const loginUser = (payload) => api.post('/auth/login', payload);
export const getMe = () => api.get('/auth/me');
export const updateProfile = (payload) => api.put('/users/profile', payload);
export const changePassword = (payload) => api.put('/users/change-password', payload);
