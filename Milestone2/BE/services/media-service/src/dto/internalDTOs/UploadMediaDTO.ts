import { MediaType } from "./mediaResponseDTO";

export class UploadMediaDTO {
  readonly profileId: string;
  readonly mediaType: MediaType;

  constructor(data: { profileId: string; mediaType: MediaType }) {
    this.profileId = data.profileId;
    this.mediaType = data.mediaType;
  }
}