export class CreateSearchProfileDTO {
  authId: string;
  technicalTags: string[];
  employmentStatus: string[];
  country: string;
  salaryMin?: number;
  salaryMax?: number;
  jobTitles: string[];
}
