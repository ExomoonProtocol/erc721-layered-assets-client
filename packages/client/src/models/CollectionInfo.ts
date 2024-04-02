import { JsonObject } from "typescript-json-serializer";

/**
 * CollectionInfo interface model
 */
export interface ICollectionInfo {}

/**
 * CollectionInfo class model
 */
@JsonObject()
export class CollectionInfo implements ICollectionInfo {
  constructor() {}
}
