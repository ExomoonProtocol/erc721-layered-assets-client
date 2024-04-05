import { JsonObject, JsonProperty } from "typescript-json-serializer";

/**
 * CollectionInfo interface model
 */
export interface ICollectionInfo {
  collectionName: string;

  description: string;

  traitsOrder: Array<string>;
}

/**
 * CollectionInfo class model
 */
@JsonObject()
export class CollectionInfo implements ICollectionInfo {
  @JsonProperty()
  public collectionName: string;

  @JsonProperty()
  public description: string;

  @JsonProperty()
  public traitsOrder: Array<string>;

  constructor() {
    this.traitsOrder = [];
  }
}
