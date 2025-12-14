export class ProfileResponseDTO {
  phone?: string;
  address?: string;
  city?: string;
  country: string;
  birthday?: Date;
  ispremium?: boolean;
  name?: string;
  skills?: string[];
  summary?: string;
  workExperiences?: string[];
  education?: string[];


  constructor(entity: any) {
    this.phone = entity.phone;
    this.address = entity.address;
    this.city = entity.city;
    this.country = entity.country;
    this.birthday = entity.birthday;
    this.ispremium = entity.ispremium;
    this.name = entity.name;
    this.skills = entity.skills;
    this.summary = entity.summary;
    this.workExperiences = entity.workExperiences;
    this.education = entity.education;
  }
}
