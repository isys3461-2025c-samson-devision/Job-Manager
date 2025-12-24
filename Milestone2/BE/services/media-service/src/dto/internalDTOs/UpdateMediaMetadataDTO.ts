export class UpdateMediaMetadataDTO {
  readonly tags?: string[];
  readonly description?: string;
  readonly title?: string;

  constructor(data: { title?: string; description?: string; tags?: string[] }) {
    this.title = data.title;
    this.description = data.description;
    this.tags = data.tags;
  }
}