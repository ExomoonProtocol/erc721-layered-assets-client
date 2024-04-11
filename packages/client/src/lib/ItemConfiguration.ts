/* eslint-disable no-unused-vars */

import { NftMetadata } from "../models";
import { AssetsClient } from "./AssetsClient";
import { AssetsClientConsumer } from "./AssetsClientConsumer";
import { TraitConfiguration } from "./TraitConfiguration";
import lodash from "lodash";

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

export type ItemConfigurationState = Array<TraitConfiguration>;

/**
 * Handles configuration for a single NFT item.
 * It can be used to build an NFT item configuration by setting variations for each trait; it may be useful both for creating the NFT item in the frontend and for rendering the NFT item image in the backend.
 * Under the hood, it wraps the `AssetsClient` and `TraitConfiguration` classes, handling the state for a single item.
 */
export class ItemConfiguration extends AssetsClientConsumer {
  private _historyPreviousStates: Array<ItemConfigurationState>;

  private _historyNextStates: Array<ItemConfigurationState>;

  private _traitConfigurations: ItemConfigurationState;

  private _status: ItemConfigurationStatus;

  constructor(_client: AssetsClient) {
    super(_client);

    this._status = ItemConfigurationStatus.Unloaded;
    this._traitConfigurations = new Array<TraitConfiguration>();
    this._historyPreviousStates = new Array<ItemConfigurationState>();
    this._historyNextStates = new Array<ItemConfigurationState>();
  }

  /**
   * Check if the current item configuration is valid.
   * It will check if all required traits are present in the configuration.
   * @returns true if the configuration is valid, false otherwise
   */
  public isConfigurationValid(): boolean {
    // Checks if in current configured traits there is some missing required trait. If so the configuration is invalid.

    const collectionInfo = this.assetsClient.getCollectionInfo();
    if (!collectionInfo) {
      return false;
    }

    const requiredTraits = this.assetsClient
      .getTraits()
      .filter((trait) => trait.required);
    const configuredTraits = this._traitConfigurations.map(
      (tc) => tc.traitName
    );

    return requiredTraits.every((requiredTrait) =>
      configuredTraits.includes(requiredTrait.name)
    );
  }

  /**
   * Set default item configuration based on the initial item configuration in the collection info.
   */
  protected setDefaultItemConfiguration(): void {
    const collectionInfo = this.assetsClient.getCollectionInfo();

    if (collectionInfo?.initialItemConfiguration) {
      collectionInfo.initialItemConfiguration.forEach((traitConfiguration) => {
        this.setVariation(
          traitConfiguration.traitName,
          traitConfiguration.variationName,
          traitConfiguration.colorName
        );
      });
    }

    if (!this.isConfigurationValid()) {
      throw new Error("Invalid initial configuration");
    } else {
      console.log("Default item configuration set");
    }
  }

  /**
   * Prepares item configuration, and makes sure all assets are loaded in the `AssetsClient` instance.
   */
  public async load(): Promise<void> {
    await this.assetsClient.fetchAssetsObject();
    this._status = ItemConfigurationStatus.Ready;

    this.setDefaultItemConfiguration();
    this.clearHistory();
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
   * Saves the current state of the item configuration to the previous history.
   */
  protected pushStateToPreviousHistory(): void {
    this._historyPreviousStates.push(
      lodash.cloneDeep(this._traitConfigurations)
    );
  }

  /**
   * Saves the current state of the item configuration to the next history.
   */
  protected pushStateToNextHistory(): void {
    this._historyNextStates.unshift(
      lodash.cloneDeep(this._traitConfigurations)
    );
  }

  /**
   * Removes the last state from the previous history.
   */
  protected popStateFromPreviousHistory(): ItemConfigurationState | undefined {
    return this._historyPreviousStates.pop();
  }

  /**
   * Removes the last state from the next history.
   */
  protected popStateFromNextHistory(): ItemConfigurationState | undefined {
    return this._historyNextStates.shift();
  }

  /**
   * Undo the last change in the item configuration.
   */
  public historyUndo(): void {
    this.requireReady();

    if (this._historyPreviousStates.length > 0) {
      this.pushStateToNextHistory();
      this._traitConfigurations = this.popStateFromPreviousHistory() || [];
    }
  }

  /**
   * Redo the last change in the item configuration.
   */
  public historyRedo(): void {
    this.requireReady();

    if (this._historyNextStates.length > 0) {
      this.pushStateToPreviousHistory();
      this._traitConfigurations = this.popStateFromNextHistory() || [];
    }
  }

  /**
   * Clear the previous history.
   * This will remove all the states from the previous history.
   */
  public clearPreviousHistory(): void {
    this._historyPreviousStates = [];
  }

  /**
   * Clear the next history.
   * This will remove all the states from the next history.
   */
  public clearNextHistory(): void {
    this._historyNextStates = [];
  }

  /**
   * Clear the history.
   * This will remove all the states from the previous and next history.
   */
  public clearHistory(): void {
    this.clearPreviousHistory();
    this.clearNextHistory();
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

    this.pushStateToPreviousHistory();

    if (traitConfiguration) {
      traitConfiguration.variationName = variation;
      traitConfiguration.colorName = selectedColor || undefined;
    } else {
      const newTraitConfiguration = new TraitConfiguration();
      newTraitConfiguration.traitName = trait;
      newTraitConfiguration.variationName = variation;
      newTraitConfiguration.colorName = selectedColor || undefined;
      this._traitConfigurations.push(newTraitConfiguration);
      this.sortTraitConfigurations();
    }

    this.clearNextHistory();
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

      this.pushStateToPreviousHistory();
      this._traitConfigurations.splice(traitConfigurationIndex, 1);
      this.clearNextHistory();
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
          return tc.getImageUrl(this.assetsClient, conditionalRenderingConfig);
        }
      }

      return tc.getImageUrl(this.assetsClient);
    });
  }

  protected static randomNumber(): number {
    console.log("Random number");
    return Math.random();
  }

  /**
   * Build a random item configuration.
   * It will randomly select a variation for each trait, based on the randomness factor of the trait.
   * If the trait is required, it will always be picked.
   * @param client Assets client
   * @returns Item configuration
   */
  public static async buildRandomItemConfiguration(
    client: AssetsClient
  ): Promise<ItemConfiguration> {
    const itemConfiguration = new ItemConfiguration(client);
    await itemConfiguration.load();

    const traits = client.getTraits();
    traits.forEach((trait) => {
      let shouldBePicked = false;

      if (trait.required) {
        shouldBePicked = true;
      } else {
        shouldBePicked = this.randomNumber() < (trait.radnomnessFactor || 0.5);
      }

      if (!shouldBePicked) {
        return;
      }

      const randomVariation =
        trait.variations[
          Math.floor(this.randomNumber() * trait.variations.length)
        ];
      itemConfiguration.setVariation(
        trait.name,
        randomVariation.name,
        randomVariation.colors
          ? randomVariation.colors[
              Math.floor(this.randomNumber() * randomVariation.colors.length)
            ]
          : undefined
      );
    });

    return itemConfiguration;
  }

  public async randomize(): Promise<void> {
    this.requireReady();

    const randomItemConfiguration =
      await ItemConfiguration.buildRandomItemConfiguration(this.assetsClient);

    this.pushStateToPreviousHistory();
    this._traitConfigurations = randomItemConfiguration._traitConfigurations;
    this.clearNextHistory();
  }

  /**
   * Build an item configuration from a layers data string.
   * @param layersData Layers data string
   * @param client Assets client
   * @returns Item configuration
   * @throws Error if trait or variation not found, or if color is not supported by the variation
   * @note This method is useful for building an item configuration from a layers data string, which can be used in the frontend to render the NFT item.
   */
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

  /**
   * Encode layers data string based on the current item configuration.
   * @returns Layers data string
   * @throws Error if trait or variation not found, or if color is not supported by the variation
   * @note This method is useful for encoding the item configuration into a layers data string, which can be used in the frontend to render the NFT item.
   */
  public encodeLayersDataString(): string {
    this.requireReady();

    let layersData = "0x";

    // TODO check if trait index has always the correct index pos compared to the collection info traits order
    this._traitConfigurations.forEach((tc) => {
      const trait = this.assetsClient.getTrait(tc.traitName);
      if (!trait) {
        throw new Error(`Trait ${tc.traitName} not found`);
      }

      const variationIndex = trait.variations.findIndex(
        (v) => v.name === tc.variationName
      );

      if (variationIndex === -1) {
        throw new Error(
          `Variation ${tc.variationName} not found for trait ${tc.traitName}`
        );
      }

      const colorIndex = trait.variations[variationIndex].colors?.findIndex(
        (c) => c === tc.colorName
      );

      if (colorIndex === -1) {
        throw new Error(
          `Color ${tc.colorName} not found for trait ${tc.traitName}`
        );
      }

      const traitByte = (variationIndex << 3) + (colorIndex || 0);
      layersData += traitByte.toString(16).padStart(2, "0");
    });

    return layersData;
  }
}
