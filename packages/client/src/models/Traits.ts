import { JsonObject, JsonProperty } from "typescript-json-serializer";

export interface ITraits {
  traitIndexes: Array<number>;
}

@JsonObject()
export class Traits implements ITraits {
  @JsonProperty()
  public traitIndexes: Array<number>;

  constructor() {
    this.traitIndexes = [];
  }
}
