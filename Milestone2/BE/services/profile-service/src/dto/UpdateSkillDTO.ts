export class UpdateSkillsDTO {
  readonly skills: string[];
  
  constructor(data: Partial<UpdateSkillsDTO>) {
    this.skills = data.skills || [];
  }
}