import { JsonObject, JsonProperty } from "typescript-json-serializer";

export interface IConditionalRenderingConfig {
  traitName: string;

  variationName?: string;

  colorName?: string;
}

@JsonObject()
export class ConditionalRenderingConfig implements IConditionalRenderingConfig {
  @JsonProperty()
  public traitName: string;

  @JsonProperty()
  public variationName?: string;

  @JsonProperty()
  public colorName?: string;

  constructor() {}

  public get folderName(): string {
    let value = this.traitName;

    if (this.variationName) {
      value += `_${this.variationName}`;
    }

    if (this.colorName) {
      value += `_${this.colorName}`;
    }

    return value;
  }
}
