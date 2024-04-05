/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CollectionInfo, AssetsObject, Trait } from "../models";
import axios from "axios";
import { ModelsUtils } from "../utils/ModelsUtils";

/**
 * AssetsClient class constructor parameters
 */
export interface AssetsClientInitParams {
  /**
   * Base URL
   * @example "https://example.com"
   * @example "http://localhost:3000"
   **/
  baseUrl: string;

  /**
   * Use cache
   * @default false
   */
  useCache?: boolean;
}

/**
 * Base fetching parameters
 */
export interface BaseFetchingParams {}

/**
 * AssetsClient class
 */
export class AssetsClient {
  private _baseUrl: string;

  private _useCache: boolean;

  private _cachedAssetsInfo: AssetsObject;

  constructor(initParams: AssetsClientInitParams) {
    this._baseUrl = initParams.baseUrl;
    this._useCache = initParams.useCache || false;

    this.initCache();
  }

  protected initCache() {
    this._cachedAssetsInfo = {};
  }

  protected fetchResource(url: string): Promise<any> {
    console.log(`[AssetsClient] Fetching resource: ${url}`);
    return axios.get(url);
  }

  /**
   * Get base URL
   * @returns Base URL
   * @public
   */
  public get baseUrl(): string {
    return this._baseUrl;
  }

  protected validateParams(params: BaseFetchingParams): BaseFetchingParams {
    return {
      ...params,
    };
  }

  /**
   * Fetches collection info
   * @param params Base fetching parameters
   * @returns Collection info
   * @public
   */
  public async fetchCollectionInfo(
    params?: BaseFetchingParams
  ): Promise<CollectionInfo | null> {
    const validatedParams = this.validateParams(params || {});

    let collectionInfoObj: CollectionInfo | null = null;

    if (this._useCache && this._cachedAssetsInfo?.collectionInfo) {
      collectionInfoObj = this._cachedAssetsInfo.collectionInfo;
    } else {
      const response = await this.fetchResource(
        `${this.baseUrl}/collection.json`
      );
      const rawObj =
        ModelsUtils.instance.serializer.deserializeObject<CollectionInfo>(
          response.data,
          CollectionInfo
        );

      collectionInfoObj = rawObj || null;

      if (collectionInfoObj) {
        this._cachedAssetsInfo.collectionInfo = collectionInfoObj;
      }
    }

    return collectionInfoObj;
  }

  /**
   * Fetches traits
   * @param params Base fetching parameters
   * @returns Traits list
   * @public
   */
  public async fetchTraits(params?: BaseFetchingParams): Promise<Array<Trait>> {
    const validatedParams = this.validateParams(params || {});
    const collectionInfo = await this.fetchCollectionInfo({});

    let traits: Array<Trait> = [];

    if (
      this._useCache &&
      this._cachedAssetsInfo?.traits &&
      this._cachedAssetsInfo.traits.length == collectionInfo?.traitsOrder.length
    ) {
      traits = this._cachedAssetsInfo.traits;
    } else {
      const traitNames = collectionInfo?.traitsOrder || [];
      traits = await Promise.all(
        traitNames.map(async (traitName) => {
          return await this.fetchTrait(traitName);
        })
      );

      if (traits.length > 0) {
        this._cachedAssetsInfo.traits = traits;
      }
    }

    return traits;
  }

  /**
   * Fetches trait
   * @param traitName Trait name
   * @param params Base fetching parameters
   * @returns Trait object
   * @public
   */
  public async fetchTrait(
    traitName: string,
    params?: BaseFetchingParams
  ): Promise<Trait> {
    const validatedParams = this.validateParams(params || {});

    const response = await this.fetchResource(
      `${this.baseUrl}/traits/${traitName}/trait.json`
    );
    const rawObj = ModelsUtils.instance.serializer.deserializeObject<Trait>(
      response.data,
      Trait
    );

    if (rawObj) {
      // Cache trait
      if (this._cachedAssetsInfo.traits) {
        const traitIndex = this._cachedAssetsInfo.traits.findIndex(
          (t) => t.name === traitName
        );
        if (traitIndex !== -1) {
          this._cachedAssetsInfo.traits[traitIndex] = rawObj;
        } else {
          this._cachedAssetsInfo.traits.push(rawObj);
        }
      }

      return rawObj;
    } else {
      throw new Error("Trait not found");
    }
  }

  /**
   * Fetches assets object
   * @param _params Base fetching parameters
   * @returns Assets object
   * @public
   */
  public async fetchAssetsObject(
    _params?: BaseFetchingParams
  ): Promise<AssetsObject> {
    const collectionInfo = await this.fetchCollectionInfo();
    const traits = await this.fetchTraits();

    this._cachedAssetsInfo.collectionInfo = collectionInfo!;
    this._cachedAssetsInfo.traits = traits;

    return this._cachedAssetsInfo;
  }

  /**
   * Get cached assets object
   * @returns Cached assets object
   * @public
   */
  public getAssetsObject(): AssetsObject | null {
    return this._cachedAssetsInfo || null;
  }

  /**
   * Get cached traits
   * @returns Cached traits
   * @public
   */
  public getTrais(): Trait[] {
    return this._cachedAssetsInfo.traits || [];
  }

  /**
   * Get trait
   * @param traitName Trait name
   * @returns Trait object
   * @public
   */
  public getTrait(traitName: string): Trait | null {
    if (this._cachedAssetsInfo.traits) {
      return (
        this._cachedAssetsInfo.traits.find((t) => t.name === traitName) || null
      );
    }

    return null;
  }

  public getCollectionInfo(): CollectionInfo | null {
    return this._cachedAssetsInfo.collectionInfo || null;
  }

  /**
   * Clear cache
   * @public
   */
  public clearCache(): void {
    this.initCache();
  }

  public getTraitImageUrl(
    _traitName: string,
    _variationName: string,
    _colorName: string | undefined
  ): string {
    const trait = this.getTrait(_traitName);

    if (!trait) {
      throw new Error(`Trait ${_traitName} not found`);
    }

    let traitUrlSection = trait.name;
    const variationUrlSection = "";
    const colorUrlSection = "";

    const conditionalTraitConfig = trait.conditonalRenderingConfig;
    if (conditionalTraitConfig) {
      const traits = this.getTrais();

      let configIndex = -1;

      for (let i = 0; i < conditionalTraitConfig.length; i++) {
        const config = conditionalTraitConfig[i];
        const trait = traits.find((t) => t.name === config.traitName);

        if (trait) {
          // If there is no variation name, use match only by trait name
          if (!config.variationName) {
            configIndex = i;
          }

          // If there is a variation name, match by trait name and variation name
          const variation = trait.variations.find(
            (v) => v.name === config.variationName
          );

          if (variation) {
            if (config.colorName) {
              // If there is a color name, match by trait name, variation name and color name
              const color = variation.colors.find(
                (c) => c === config.colorName
              );

              if (color) {
                configIndex = i;
              }
            } else {
              // If there is no color name, match by trait name and variation name
              configIndex = i;
            }
          }
        }
      }

      if (configIndex !== -1) {
        const config = conditionalTraitConfig[configIndex];

        traitUrlSection = `${trait.name}/${config.folderName}`;
      }
    }

    const imageUrl = `${this.baseUrl}/traits/${traitUrlSection}/${variationUrlSection}/${colorUrlSection}.png`;

    return imageUrl;
  }
}
