import { AssetsClient } from "./AssetsClient";
import { AssetsClientConsumer } from "./AssetsClientConsumer";

export class TraitConfiguration extends AssetsClientConsumer {
  private _traitName: string;

  private _variationName: string;

  private _colorName: string;

  constructor(_client: AssetsClient) {
    super(_client);
  }

  public get traitName(): string {
    return this._traitName;
  }

  public set traitName(value: string) {
    this._traitName = value;
  }

  public get variationName(): string {
    return this._variationName;
  }

  public set variationName(value: string) {
    this._variationName = value;
  }

  public get colorName(): string {
    return this._colorName;
  }

  public set colorName(value: string) {
    this._colorName = value;
  }
}
