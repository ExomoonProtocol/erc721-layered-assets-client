import { JsonObject, JsonProperty } from "typescript-json-serializer";

export interface IVariation {
  name: string;
}

@JsonObject()
export class Variation implements IVariation {
  @JsonProperty()
  public name: string;

  constructor() {}
}
