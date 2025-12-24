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

// Job-related types based on JobPost schema
export interface Job {
  job_id: number;
  company_id: number;
  title: string;
  description: string;
  posted_date: string;
  location: string;
  employment_type: string;
  salary_type: string;
  salary_min?: number;
  salary_max?: number;
  is_published: boolean;
  
  // Optional fields that might come from joins
  company_name?: string;
  company_logo?: string;
  skills?: string[]; // Array of skill names
}

export interface JobFilters {
  search?: string;
  employment_type?: string[];
  location?: string;
  salary_min?: number;
  salary_max?: number;
}

export interface JobState {
  jobs: Job[];
  currentJob: Job | null;
  filters: JobFilters;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}