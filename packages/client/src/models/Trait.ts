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
   * List of variations for the trait.
   */
  variations: Array<IVariation>;

  /**
   * Conditional rendering configurations for the trait.
   */
  conditonalRenderingConfig?: Array<IConditionalRenderingConfig>;
}

@JsonObject()
export class Trait implements ITrait {
  @JsonProperty()
  public name: string;

  @JsonProperty({ type: Variation })
  public variations: Array<Variation>;

  @JsonProperty({ type: ConditionalRenderingConfig })
  public conditonalRenderingConfig?: Array<ConditionalRenderingConfig>;

  constructor() {
    this.variations = [];
  }
}
