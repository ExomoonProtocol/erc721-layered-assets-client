import { JsonObject, JsonProperty } from "typescript-json-serializer";

export interface IVariation {
  name: string;

  colors: Array<string>;
}

@JsonObject()
export class Variation implements IVariation {
  @JsonProperty()
  public name: string;

  @JsonProperty()
  public colors: Array<string>;

  constructor() {}
}
