export class SearchProfileResponseDTO {
  id: string;
  authId: string;
  technicalTags: string[];
  employmentStatus: string[];
  country: string;
  salaryMin?: number;
  salaryMax?: number;
  jobTitles: string[];
  updatedAt: Date;

  constructor(entity: any) {
    this.id = entity.id;
    this.authId = entity.authId;
    this.technicalTags = entity.tags;
    this.employmentStatus = entity.employmentStatus;
    this.country = entity.country;
    this.salaryMin = entity.salaryMin;
    this.salaryMax = entity.salaryMax;
    this.jobTitles = entity.titles;
    this.updatedAt = entity.updatedAt;
  }
}
