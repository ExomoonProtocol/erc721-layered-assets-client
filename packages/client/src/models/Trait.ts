import { JsonObject, JsonProperty } from "typescript-json-serializer";
import { IVariation, Variation } from "./Variation";
import {
  ConditionalRenderingConfig,
  IConditionalRenderingConfig,
} from "./ConditionalRenderingConfig";

export interface ITrait {
  /**
   * Trait name
   */
  name: string;

  /**
   * Variations
   */
  variations: Array<IVariation>;

  /**
   * Conditional rendering config
   */
  conditonalRenderingConfig?: Array<IConditionalRenderingConfig>;
}

@JsonObject()
export class Trait implements ITrait {
  @JsonProperty()
  public name: string;

  @JsonProperty({ type: Variation })
  public variations: Array<Variation>;

  @JsonProperty()
  public conditonalRenderingConfig?: Array<ConditionalRenderingConfig>;

  constructor() {
    this.variations = [];
  }
}
