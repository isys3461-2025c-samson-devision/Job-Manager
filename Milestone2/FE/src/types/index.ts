export interface User {
  id: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
}

export interface ProfileFormData {
  email: string;
  country: string;
  phone?: string;
  street?: string;
  city?: string;
  skills: string[];
}

export interface ProfileState {
  profileData: ProfileFormData | null;
  skills: Skill[];
  loading: boolean;
  error: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  profile: ProfileState;
}