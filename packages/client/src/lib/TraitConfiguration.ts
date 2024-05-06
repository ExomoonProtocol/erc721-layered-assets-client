import { ConditionalRenderingConfig } from "../models";
import { AssetsClient } from "./AssetsClient";

/**
 * Configuration for a single trait. Used by other classes to represent a trait.
 * It is abkle to handle statefor a single trait.
 */
export class TraitConfiguration {
  private _traitName: string;

  private _variationName: string;

  private _colorName?: string;

  constructor() {}

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

  public get colorName(): string | undefined {
    return this._colorName;
  }

  public set colorName(value: string | undefined) {
    this._colorName = value;
  }

  /**
   * Get attribute trait name (referenced as `trait_type`) string to be used in the ERC721 collection metadata file.
   */
  public get metadataTraitName(): string {
    return this._traitName;
  }

  /**
   * Get attribute trait value (referenced as `value`) string to be used in the ERC721 collection metadata file.
   */
  public get metadataTraitValue(): string {
    return `${this._variationName || ""}${
      this._colorName ? ` ${this._colorName}` : ""
    }`;
  }

  /**
   * Get image URL for the trait configuration. the URL will be evaluated using the AssetsClient.
   * Also, it will take into account the conditional rendering configuration as optional parameter; if provided, it will be used to generate the URL.
   * @param conditionalRenderingConfig Optional conditional rendering configuration
   * @returns Image URL
   */
  public getImageUrl(
    assetsClient: AssetsClient,
    conditionalRenderingConfig?: ConditionalRenderingConfig
  ): string {
    return assetsClient.getTraitImageUrl({
      traitName: this._traitName,
      variationName: this._variationName,
      colorName: this._colorName,
      conditionalTraitConfig: conditionalRenderingConfig,
    });
  }
}
