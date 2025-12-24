export class UpdateProfileDTO {
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  skills?: string[];

  name?: string;
  birthday?: string;
  isPremium?: boolean;
  mediaId?: string;

  summary?: string;
  education?: Array<{
    GPA?: number;
    degree: string;
    from: string;
    institution: string;
    to?: string;
  }>;
  workExperiences?: Array<{
    description?: string;
    endDate?: string;
    startDate: string;
    title: string;
  }>;
}
