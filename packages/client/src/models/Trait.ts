import { JsonObject, JsonProperty } from "typescript-json-serializer";

export interface ITrait {
  variationIndexes: Array<number>;
}

@JsonObject()
export class Trait implements ITrait {
  @JsonProperty()
  public variationIndexes: Array<number>;

  constructor() {
    this.variationIndexes = [];
  }
}
