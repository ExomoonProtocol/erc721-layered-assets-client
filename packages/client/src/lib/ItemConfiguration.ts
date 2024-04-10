/* eslint-disable no-unused-vars */

import { NftMetadata } from "../models";
import { AssetsClient } from "./AssetsClient";
import { AssetsClientConsumer } from "./AssetsClientConsumer";
import { TraitConfiguration } from "./TraitConfiguration";

/**
 * Status of item configuration
 */
export enum ItemConfigurationStatus {
  /**
   * Item configuration is not ready to be used, and it needs to be loaded.
   * If this condition is encountered, the consumer should most likely call the `load` method.
   */
  Unloaded = 0,

  /**
   * Item configuration is ready to be used.
   */
  Ready,
}

/**
 * Handles configuration for a single NFT item.
 * It can be used to build an NFT item configuration by setting variations for each trait; it may be useful both for creating the NFT item in the frontend and for rendering the NFT item image in the backend.
 * Under the hood, it wraps the `AssetsClient` and `TraitConfiguration` classes, handling the state for a single item.
 */
export class ItemConfiguration extends AssetsClientConsumer {
  private _traitConfigurations: Array<TraitConfiguration>;

  private _status: ItemConfigurationStatus;

  constructor(_client: AssetsClient) {
    super(_client);

    this._status = ItemConfigurationStatus.Unloaded;
    this._traitConfigurations = new Array<TraitConfiguration>();
  }

  /**
   * Prepares item configuration, and makes sure all assets are loaded in the `AssetsClient` instance.
   */
  public async load(): Promise<void> {
    await this.assetsClient.fetchAssetsObject();
    this._status = ItemConfigurationStatus.Ready;
  }

  /**
   * Gets the list of all traits configurations for the item, sorted based on the order of traits in the collection info.
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
   * Set a variation configuration. It can be either a new configuration (eg. adding a new trait) or an existing one (eg. changing the color of an existing trait).
   * @param trait Trait name
   * @param variation Variation name
   * @param color Color name (optional)
   * @throws Error if trait or variation not found, or if color is not supported by the variation
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
      this.sortTraitConfigurations();
    }
  }

  /**
   * Remove a variation configuration for a trait.
   * @param trait Trait name
   */
  public removeVariation(trait: string): void {
    this.requireReady();

    const traitConfigurationIndex = this._traitConfigurations.findIndex(
      (tc) => tc.traitName === trait
    );

    if (traitConfigurationIndex !== -1) {
      // Checks if the selected trait/variation is required
      const traitObj = this.assetsClient.getTrait(trait);
      if (traitObj?.required) {
        throw new Error(`Trait ${traitObj.name} is required`);
      }

      this._traitConfigurations.splice(traitConfigurationIndex, 1);
    } else {
      throw new Error(`Trait ${trait} not found`);
    }
  }

  /**
   * Sort trait configurations based on the order of traits in collection info
   */
  protected sortTraitConfigurations(): void {
    this._traitConfigurations = (
      this.assetsClient.getCollectionInfo()?.traitsOrder || []
    )
      .map((traitName) => {
        console.log(traitName);
        return this._traitConfigurations.find(
          (tc) => tc.traitName === traitName
        ) as TraitConfiguration;
      })
      .filter((tc) => tc);
  }

  /**
   * Render metadata for the item.
   * It will use the collection info to get the item name and description, and will use the trait configurations to get the attributes.
   * @returns NFT metadata
   */
  public renderMetadata(): NftMetadata {
    this.requireReady();

    const collectionInfo = this.assetsClient.getCollectionInfo();

    const metadata = new NftMetadata();
    metadata.name = (collectionInfo?.collectionName || "") + " #{{id}}";
    metadata.description = collectionInfo?.description || "";
    metadata.image = "{{imageUrl}}";
    metadata.attributes = this._traitConfigurations.map((tc) => {
      return {
        trait_type: tc.traitName,
        value: tc.variationName + (tc.colorName ? ` ${tc.colorName}` : ""),
      };
    });

    return metadata;
  }

  /**
   * Get the image URLs for all traits in the item configuration.
   * It will also consider conditional rendering configurations, so that the correct image URL is returned for each trait.
   * Also, the order of the traits will be based on the order of traits in the collection info, so the output images are ready to be used for rendering the NFT item.
   *
   * @returns Array of trait image urls
   */
  public getTraitsUrls(): Array<string> {
    this.requireReady();

    return this._traitConfigurations.map((tc) => {
      // Getting info about trait (asset info)
      const traitAsset = this.assetsClient.getTrait(tc.traitName);
      console.log("Asset: ", traitAsset);

      // Check if there is a conditional rendering config for this trait
      if (traitAsset?.conditonalRenderingConfig) {
        const conditionalRenderingConfig =
          traitAsset.conditonalRenderingConfig.find(
            (currentConditionalConfig) => {
              const matchedConfiguration = this._traitConfigurations.find(
                (tcToMatch) => {
                  let matched = true;

                  if (
                    currentConditionalConfig.traitName !== tcToMatch.traitName
                  ) {
                    matched = false;
                  } else if (
                    currentConditionalConfig.variationName &&
                    currentConditionalConfig.variationName !==
                      tcToMatch.variationName
                  ) {
                    matched = false;
                  } else if (
                    currentConditionalConfig.colorName &&
                    currentConditionalConfig.colorName !== tcToMatch.colorName
                  ) {
                    matched = false;
                  }

                  return matched;
                }
              );

              return matchedConfiguration;
            }
          );

        if (conditionalRenderingConfig) {
          console.log(conditionalRenderingConfig);
          return tc.getImageUrl(conditionalRenderingConfig);
        }
      }

      return tc.getImageUrl();
    });
  }

  public static async buildFromLayersDataString(
    layersData: string,
    client: AssetsClient
  ): Promise<ItemConfiguration> {
    const itemConfiguration = new ItemConfiguration(client);
    await itemConfiguration.load();

    let layersDataHex = layersData.substring(2);
    let traitIndex = 0;

    // if length is not even, add a 0 at the end
    if (layersDataHex.length % 2 !== 0) {
      layersDataHex += "0";
    }

    while (layersDataHex.length > 0) {
      const traitByte = parseInt(layersDataHex.substring(0, 2), 16);
      layersDataHex = layersDataHex.substring(2);

      const variationIndex = traitByte >> 3;
      const colorIndex = traitByte & 0b111;

      const trait = client.getTraitByIndex(traitIndex);
      if (!trait) {
        throw new Error(`Trait with indexx ${traitIndex} not found`);
      }
      console.log(trait);

      const variation = trait.variations[variationIndex];
      if (!variation) {
        throw new Error(
          `Variation with index ${variationIndex} not found for trait ${trait.name}`
        );
      }

      let color: string | undefined;
      if (variation.colors && variation.colors.length > 0) {
        color = variation.colors[colorIndex];
      }

      itemConfiguration.setVariation(trait.name, variation.name, color);

      traitIndex++;
    }

    return itemConfiguration;
  }
}
