import { JsonObject, JsonProperty } from "typescript-json-serializer";

/**
 * Configuration object for a single variation.
 * It should be located inside the trait configuration object.
 */
export interface ITraitConfiguration {
  traitName: string;
  variationName: string;
  colorName?: string;
}

/**
 * Configuration object for the collection info. It handles all the more generic information about the collection.
 * A file with this configuration should be located at the root of the collection folder, and should be named `collection.json`.
 */
export interface ICollectionInfo {
  /**
   * Collection name. It will be used for metadata generation.
   */
  collectionName: string;

  /**
   * Description of the collection. It will be used for metadata generation.
   */
  description: string;

  /**
   * Order of the traits, under a rendering perspective. This order will be used by the `AssetsClient` and the other modules to generating metadata, image URLs, and more based on the correct rendering order of the traits.
   */
  traitsOrder: Array<string>;

  /**
   * Initial item configuration for the collection (optional).
   * It will be used for frontend development purposes, to have a starting point for the item configuration.
   */
  initialItemConfiguration?: Array<ITraitConfiguration>;
}

/**
 * Configuration object for the collection info. It handles all the more generic information about the collection.
 * A file with this configuration should be located at the root of the collection folder, and should be named `collection.json`.
 */
@JsonObject()
export class CollectionInfo implements ICollectionInfo {
  @JsonProperty({ required: true })
  collectionName: string;

  @JsonProperty({ required: false })
  description: string;

  @JsonProperty({ required: true })
  traitsOrder: Array<string>;

  @JsonProperty({ required: false })
  initialItemConfiguration?: Array<ITraitConfiguration>;

  constructor() {
    this.traitsOrder = [];
  }
}
