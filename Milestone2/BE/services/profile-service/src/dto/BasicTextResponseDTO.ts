export class BasicTextProfileResponseDTO {
    id: string; 
    summary: string;
    workExperiences?: string[];
    education?: string[];

    constructor(entity: any) {
        this.summary = entity.summary;
        this.workExperiences = entity.workExperiences;
        this.education = entity.education;
    }

}