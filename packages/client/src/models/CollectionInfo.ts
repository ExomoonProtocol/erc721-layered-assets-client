import { JsonObject, JsonProperty } from "typescript-json-serializer";

/**
 * CollectionInfo interface model
 */
export interface ICollectionInfo {
  collectionName: string;

  traitIndexes: Record<string, number>;
}

/**
 * CollectionInfo class model
 */
@JsonObject()
export class CollectionInfo implements ICollectionInfo {
  @JsonProperty()
  public collectionName: string;

  @JsonProperty()
  public traitIndexes: Record<string, number>;

  constructor() {
    this.traitIndexes = {};
  }
}
