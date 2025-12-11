import axios from 'axios';
import type { ProfileFormData, Skill } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

const profileAPI = axios.create({
    baseURL: API_BASE_URL,
});

// Add token to requests
profileAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const profileService = {

    getSkills: async (): Promise<Skill[]> => {
        const response = await profileAPI.get('/skills');
        return response.data;
    },

    createProfile: async (profileData: ProfileFormData): Promise<void> => {
        await profileAPI.post('/profile', profileData);
    },

    getProfile: async (): Promise<ProfileFormData> => {
        const response = await profileAPI.get('/profile');
        return response.data;
    },

    updateProfile: async (profileData: ProfileFormData): Promise<void> => {
        await profileAPI.put('/profile', profileData);
    },
};