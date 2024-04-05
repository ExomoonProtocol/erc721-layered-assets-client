import { JsonObject, JsonProperty } from "typescript-json-serializer";
import { ICollectionInfo } from "./CollectionInfo";
import { ITrait, Trait } from "./Trait";

/**
 * Assets object interface
 */
export interface IAssetsObject {
  /**
   * Collection info
   */
  collectionInfo?: ICollectionInfo;

  /**
   * Traits list
   */
  traits?: Array<ITrait>;
}

@JsonObject()
export class AssetsObject implements IAssetsObject {
  @JsonProperty()
  public collectionInfo?: ICollectionInfo;

  @JsonProperty()
  public traits?: Array<Trait>;

  constructor() {}
}
