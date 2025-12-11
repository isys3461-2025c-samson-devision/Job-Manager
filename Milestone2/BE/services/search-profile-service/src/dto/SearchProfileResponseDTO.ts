export class SearchProfileResponseDTO {
  id: string;
  authId: string;
  tags: string[];
  employmentStatus: string[];
  country: string;
  salaryMin?: number;
  salaryMax?: number;
  titles: string[];
  updatedAt: Date;

  constructor(entity: any) {
    this.id = entity.id;
    this.authId = entity.authId;
    this.tags = entity.tags;
    this.employmentStatus = entity.employmentStatus;
    this.country = entity.country;
    this.salaryMin = entity.salaryMin;
    this.salaryMax = entity.salaryMax;
    this.titles = entity.titles;
    this.updatedAt = entity.updatedAt;
  }
}
