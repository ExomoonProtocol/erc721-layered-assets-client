import { JsonObject, JsonProperty } from "typescript-json-serializer";

/**
 * Configuration object for a single variation.
 * It should be located inside the trait configuration object.
 */
export interface IVariation {
  /**
   * Name of the variation. This is the name that will be displayed in the UI, and will also be used for finding the variation images:
   * - There should be a folder with the same name inside the trait folder. (eg. trait_name/variation_name/etc.../ )
   * - Inside te folder mentioned above, there should be the image(s) for the variation. (depending on the colors configuration, there might be more than one image for a single variation). Here is a more detailed explanation of the folder structure:
   *    - If the variation has no colors (so the property `colors` is an empty array, or not present at all), the folder should contain a single PNG image named with the same name as the variation (eg. if the variation name is "Milky Way", the image should be named "Milky Way.png", so the final image path might be "Galaxy/Milky way/Milky Way.png").
   *    - If instead the variation has colors (so the property `colors` is not empty), the folder should contain a PNG image for each color, named with the same name as the variation, followed by the color name (eg. if the variation name is "Nebula" and the colors are "blue" and "red", the images should be named "blue.png" and "red.png", so the final image paths might be "Background/Nebula/blue.png" and "Background/Nebula/red.png").
   */
  name: string;

  /**
   * Array of colors that the variation can have. If this array is empty, the variation has no colors, and the folder structure should be as described in the `name` property.
   * @example ["blue", "red"]
   */
  colors: Array<string>;

  /**
   * Description of the variation (optional). Useful for UI and/or metadata generation.
   */
  description?: string;

  /**
   * Rarity of the variation. Useful for UI and/or metadata generation.
   */
  rarity?: number | string;

  /**
   * If the variation has a custom preview image.
   * Default is `false`.
   */
  hasCustomPreviewImage?: boolean;

  /**
   * Preview/Thumbnail image URL for the variation.
   * If not provided, the image url will be generated based on the expected default thumbnail image url.
   */
  previewImageUrl?: string;
}

/**
 * @inheritdoc
 */
@JsonObject()
export class Variation implements IVariation {
  @JsonProperty({ required: true })
  public name: string;

  @JsonProperty({ required: false })
  public colors: Array<string>;

  @JsonProperty({ required: false })
  public description?: string;

  @JsonProperty({ required: false })
  public rarity?: number | string;

  @JsonProperty({ required: false })
  public hasCustomPreviewImage?: boolean;

  @JsonProperty({ required: false })
  public previewImageUrl?: string;

  constructor() {}
}
