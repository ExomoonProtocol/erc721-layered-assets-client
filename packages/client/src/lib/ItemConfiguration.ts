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

  public async load(): Promise<void> {
    this._status = ItemConfigurationStatus.Ready;
    // TODO load base item configuration
  }

  public get traitConfigurations(): Array<TraitConfiguration> {
    return this._traitConfigurations;
  }

  public get status(): ItemConfigurationStatus {
    return this._status;
  }

  // public async setVariation(
  //   trait: string,
  //   variation: string,
  //   color?: string
  // ): void {
  //   const traitConfiguration = this._traitConfigurations.find(
  //     (tc) => tc.traitName === trait
  //   );

  //   const traitObj = await this.assetsClient.getTrait(trait);

  //   const variationObj = traitObj.variations.find((v) => v.name === variation);

  //   if (!variationObj) {
  //     throw new Error(`Variation ${variation} not found`);
  //   }

  //   const variationHasColors =
  //     variationObj.colors && variationObj.colors.length > 0;

  //   if (traitConfiguration) {
  //     traitConfiguration.variationName = variation;
  //     traitConfiguration.colorName = color;
  //   } else {
  //     const newTraitConfiguration = new TraitConfiguration(this.assetsClient);
  //     newTraitConfiguration.traitName = trait;
  //     newTraitConfiguration.variationName = variation;
  //     newTraitConfiguration.colorName = color;

  //     this._traitConfigurations.push(newTraitConfiguration);
  //   }
  // }
}
