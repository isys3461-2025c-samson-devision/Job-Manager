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

export interface EducationEntry {
  degree: string;
  institution: string;
  from: string;
  to?: string;
  GPA?: number;
}

export interface WorkExperienceEntry {
  title: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface ProfileFormData {
  name?: string;
  email: string;
  country: string;
  phone?: string;
  street?: string;
  city?: string;
  skills: string[];


  birthday?: string;
  isPremium?: boolean;
  mediaId?: string;

  summary?: string;
  education?: EducationEntry[];
  workExperiences?: WorkExperienceEntry[];
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