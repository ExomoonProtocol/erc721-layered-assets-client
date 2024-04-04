/* eslint-disable no-unused-vars */

import { AssetsClient } from "./AssetsClient";
import { AssetsClientConsumer } from "./AssetsClientConsumer";
import { TraitConfiguration } from "./TraitConfiguration";

export enum ItemConfigurationStatus {
  Unloaded = 0,
  Ready,
}

export class ItemConfiguration extends AssetsClientConsumer {
  private _traitConfigurations: Array<TraitConfiguration>;

  private _status: ItemConfigurationStatus;

  constructor(_client: AssetsClient) {
    super(_client);

    this._status = ItemConfigurationStatus.Unloaded;
    this._traitConfigurations = new Array<TraitConfiguration>();
  }

  /**
   * Prepare item configuration, and make sure all assets are loaded.
   */
  public async load(): Promise<void> {
    this._status = ItemConfigurationStatus.Ready;
    await this.assetsClient.fetchAssetsObject();
  }

  /**
   * Get trait configuration by trait name
   */
  public get traitConfigurations(): Array<TraitConfiguration> {
    return this._traitConfigurations;
  }

  /**
   * Get status of item configuration
   */
  public get status(): ItemConfigurationStatus {
    return this._status;
  }

  /**
   * Require item configuration to be ready
   */
  protected requireReady(): void {
    if (this._status !== ItemConfigurationStatus.Ready) {
      throw new Error("Item configuration not ready");
    }
  }

  /**
   * Set variation for a trait
   * @param trait Trait name
   * @param variation Variation name
   * @param color Color name
   */
  public setVariation(trait: string, variation: string, color?: string): void {
    this.requireReady();

    const traitConfiguration = this._traitConfigurations.find(
      (tc) => tc.traitName === trait
    );

    const traitObj = this.assetsClient.getTrait(trait);

    if (!traitObj) {
      throw new Error(`Trait ${trait} not found`);
    }

    const variationObj = traitObj.variations.find((v) => v.name === variation);

    if (!variationObj) {
      throw new Error(`Variation ${variation} not found`);
    }

    const variationHasColors =
      variationObj.colors && variationObj.colors.length > 0;

    let selectedColor: string | null = null;

    if (variationHasColors) {
      if (color) {
        selectedColor = variationObj.colors.find((c) => c === color) || null;

        if (!selectedColor) {
          throw new Error(`Color ${color} not found`);
        }
      } else {
        selectedColor = variationObj.colors[0];
      }
    } else if (color) {
      throw new Error("Variation doesn't support colors");
    }

    if (traitConfiguration) {
      traitConfiguration.variationName = variation;
      traitConfiguration.colorName = selectedColor || undefined;
    } else {
      const newTraitConfiguration = new TraitConfiguration(this.assetsClient);
      newTraitConfiguration.traitName = trait;
      newTraitConfiguration.variationName = variation;
      newTraitConfiguration.colorName = selectedColor || undefined;
      this._traitConfigurations.push(newTraitConfiguration);
    }
  }
}
