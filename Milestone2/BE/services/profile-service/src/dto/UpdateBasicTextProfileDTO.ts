export type ProfileEducationDTO = {
  degree: string;
  institution: string;
  from: string;
  to?: string;
  GPA?: number;
}

export type ProfileWorkExperienceDTO = {
  title: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export type UpdateBasicTextProfileDTO = {
  summary?: string;
  education?: ProfileEducationDTO[];
  workExperiences?: ProfileWorkExperienceDTO[];
}