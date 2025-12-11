export class CreateSearchProfileDTO {
  authId: string;
  tags: string[];
  employmentStatus: string[];
  country: string;
  salaryMin?: number;
  salaryMax?: number;
  titles: string[];
}
