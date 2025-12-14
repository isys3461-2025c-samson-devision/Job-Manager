import type { ProfileFormData, Skill } from '../types';
import appApi from './httpApp';

export const profileService = {

    getSkills: async (): Promise<Skill[]> => {
        const response = await appApi.get('/skills');
        return response.data;
    },

    createProfile: async (profileData: ProfileFormData): Promise<void> => {
        await appApi.post('/profile', profileData);
    },

    getProfile: async (): Promise<ProfileFormData> => {
        const response = await appApi.get('/profile');
        return response.data;
    },

    updateProfile: async (profileData: ProfileFormData): Promise<void> => {
        await appApi.put('/profile', profileData);
    },
};