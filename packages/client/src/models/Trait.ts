import { JsonObject, JsonProperty } from "typescript-json-serializer";
import { IVariation, Variation } from "./Variation";

export interface ITrait {
  name: string;
  variationsOrder: Array<string>;
  variations?: Array<IVariation>;
}

@JsonObject()
export class Trait implements ITrait {
  @JsonProperty()
  public name: string;

  @JsonProperty()
  public variationsOrder: Array<string>;

  @JsonProperty({ type: Variation })
  public variations?: Array<Variation>;

  constructor() {
    this.variationsOrder = [];
  }
}
