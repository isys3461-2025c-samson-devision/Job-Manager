import {ProfileWorkExperienceDTO, ProfileEducationDTO} from './UpdateBasicTextProfileDTO';

export class CreateProfileDTO {
    readonly phone?: string;
    readonly address?: string;
    readonly city?: string;
    readonly country: string;
    readonly birthday?: Date;
    readonly ispremium?: boolean;
    readonly name?: string;
    readonly skills?: string[];
    readonly summary?: string;
    readonly workExperiences?: ProfileWorkExperienceDTO;
    readonly education?: ProfileEducationDTO;
  
  constructor(data: Partial<CreateProfileDTO>) {
    if (!data.country) {
      throw new Error("country is required");
    }
    this.phone = data.phone;
    this.address = data.address;
    this.city = data.city;
    this.country = data.country;
    this.birthday = data.birthday;
    this.ispremium = data.ispremium;
    this.name = data.name;
    this.skills = data.skills;
    this.summary = data.summary;
    this.workExperiences = data.workExperiences;
    this.education = data.education;
  }
}