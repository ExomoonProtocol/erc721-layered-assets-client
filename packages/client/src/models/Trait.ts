import { JsonObject, JsonProperty } from "typescript-json-serializer";
import { IVariation, Variation } from "./Variation";

export interface ITrait {
  name: string;
  variationIndexes: Record<string, number>;
  variations?: Array<IVariation>;
}

@JsonObject()
export class Trait implements ITrait {
  @JsonProperty()
  public name: string;

  @JsonProperty()
  public variationIndexes: Record<string, number>;

  @JsonProperty({ type: Variation })
  public variations?: Array<Variation>;

  constructor() {
    this.variationIndexes = {};
  }
}
