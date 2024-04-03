import { JsonObject, JsonProperty } from "typescript-json-serializer";

/**
 * CollectionInfo interface model
 */
export interface ICollectionInfo {
  collectionName: string;

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
  traitsOrder: Array<string>;

  constructor() {
    this.traitsOrder = [];
  }
}
