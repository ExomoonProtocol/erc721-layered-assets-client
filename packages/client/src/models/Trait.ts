import { JsonObject, JsonProperty } from "typescript-json-serializer";
import { IVariation, Variation } from "./Variation";
import {
  ConditionalRenderingConfig,
  IConditionalRenderingConfig,
} from "./ConditionalRenderingConfig";

/**
 * Configuration object for a single trait.
 * There should be a folder with the same name inside the `<root>/traits/` folder.
 */
export interface ITrait {
  /**
   * Trait name. It will be used in different parts of the application, like the UI, the metadata generation (more specifically inside the `attributes` objects), and more.
   *
   */
  name: string;

  /**
   * Description of the trait (optional). Useful for UI and/or metadata generation.
   */
  description?: string;

  /**
   * If the trait is required for the item generation.
   * Default is `false`.
   */
  required?: boolean;

  /**
   * List of variations for the trait.
   */
  variations: Array<IVariation>;

  /**
   * Conditional rendering configurations for the trait.
   */
  conditonalRenderingConfig?: Array<IConditionalRenderingConfig>;

  /**
   * Icon URL for the trait.
   * If not provided, the icon will be generated based on the expected default icon url.
   */
  iconUrl?: string;

  /**
   * Randomness factor for the trait.
   * If provided, it will be used to calculate the randomness for the trait.
   * It is a number between 0 and 1.
   *
   * @example 0.5 means 50% randomness.
   * @example 0.1 means 10% randomness.
   * @example 1 means 100% randomness.
   * @note If not provided, the default randomness factor will be set to 0.5 (50% randomness)
   * @note It is incompatible with the required flag. If the required flag is set to true, the randomness factor will be ignored.
   */
  radnomnessFactor?: number;
}

@JsonObject()
export class Trait implements ITrait {
  @JsonProperty({ required: true })
  public name: string;

  @JsonProperty({ type: Variation, required: true })
  public variations: Array<Variation>;

  @JsonProperty({ required: false })
  public description?: string;

  @JsonProperty({ required: false })
  public required?: boolean;

  @JsonProperty({ type: ConditionalRenderingConfig, required: false })
  public conditonalRenderingConfig?: Array<ConditionalRenderingConfig>;

  @JsonProperty({ required: false })
  public iconUrl?: string;

  @JsonProperty({ required: false })
  public radnomnessFactor?: number;

  constructor() {
    this.variations = [];
    this.required = false;
    this.radnomnessFactor = 0.5;
  }
}
