import type { ProfileFormData, Skill } from '../types';
import appApi from './httpApp';
import profileApi from './httpProfile';

type ApiEnvelope<T> = {
    success?: boolean;
    data?: T;
    message?: string;
    error?: string;
};

type ProfileResponseDto = {
    name?: string;
    birthday?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    skills?: string[];
};

export const profileService = {

    getSkills: async (): Promise<Skill[]> => {
        const response = await appApi.get('/skills');
        return response.data;
    },

    createProfile: async (profileData: ProfileFormData): Promise<void> => {
        await appApi.post('/profile', profileData);
    },

    getProfile: async (authId: string): Promise<ProfileFormData> => {
        const response = await profileApi.get<ApiEnvelope<ProfileResponseDto>>(`/${authId}`);
        const dto = response.data?.data;

        return {
            name: dto?.name ?? '',
            birthday: dto?.birthday ?? '',
            email: '',
            country: dto?.country ?? '',
            phone: dto?.phone,
            street: dto?.address,
            city: dto?.city,
            skills: dto?.skills ?? [],
        };
    },

    updateProfile: async (authId: string, profileData: ProfileFormData): Promise<void> => {
        const optionalString = (value: unknown): string | undefined => {
            if (typeof value !== 'string') return undefined;
            const trimmed = value.trim();
            return trimmed.length > 0 ? trimmed : undefined;
        };

        const payload = {
            // required by backend (on create) and generally expected
            country: profileData.country,
            skills: profileData.skills,

            ...(optionalString(profileData.name) ? { name: optionalString(profileData.name) } : {}),
            ...(optionalString(profileData.birthday) ? { birthday: optionalString(profileData.birthday) } : {}),

            ...(optionalString(profileData.phone) ? { phone: optionalString(profileData.phone) } : {}),
            ...(optionalString(profileData.street) ? { address: optionalString(profileData.street) } : {}),
            ...(optionalString(profileData.city) ? { city: optionalString(profileData.city) } : {}),
        };

        await profileApi.put(`/${authId}`, payload);
    },
};