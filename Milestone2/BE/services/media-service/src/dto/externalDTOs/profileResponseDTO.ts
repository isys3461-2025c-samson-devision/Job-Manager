import { MediaResponseDTO } from "../internalDTOs/mediaResponseDTO";

export class ProfileResponseDTO {
  readonly items: MediaResponseDTO[];
  readonly count: number;
  
  constructor(items: MediaResponseDTO[]) {
    this.items = items;
    this.count = items.length;
  }
}