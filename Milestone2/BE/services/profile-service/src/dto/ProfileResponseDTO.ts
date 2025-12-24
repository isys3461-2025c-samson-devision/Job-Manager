export class ProfileResponseDTO {
  phone?: string;
  address?: string;
  city?: string;
  country: string;
  birthday?: string;
  isPremium?: boolean;
  name?: string;
  skills?: string[];
  summary?: string;
  mediaId?: string;
  workExperiences?: Array<{
    description?: string;
    endDate?: string;
    startDate: string;
    title: string;
  }>;
  education?: Array<{
    GPA?: number;
    degree: string;
    from: string;
    institution: string;
    to?: string;
  }>;


  constructor(entity: any) {
    this.phone = entity.phone;
    this.address = entity.address;
    this.city = entity.city;
    this.country = entity.country;
    this.birthday = entity.birthday;
    this.isPremium = entity.isPremium;
    this.name = entity.name;
    this.skills = entity.skills;
    this.summary = entity.summary;
    this.mediaId = entity.mediaId;
    this.workExperiences = entity.workExperiences;
    this.education = entity.education;
  }
}
