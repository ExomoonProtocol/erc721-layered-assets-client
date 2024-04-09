/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CollectionInfo,
  AssetsObject,
  Trait,
  ConditionalRenderingConfig,
} from "../models";
import axios from "axios";
import { ModelsUtils } from "../utils/ModelsUtils";

/**
 * Parameters for initializing a new AssetsClient instance.
 */
export interface AssetsClientInitParams {
  /**
   * Base URL to be used for fetching assets (N.B. the asets should be served as static files, and should be compliant with the Exomoon ERC721 Layered NFT standard)
   * It can be a link to a public S3 bucket or a web server you own.
   * @example "https://example.com"
   * @example "http://localhost:3000"
   **/
  baseUrl: string;

  /**
   * Specifies if client should use cache for fetching assets.
   * True by default.
   * @default true
   */
  useCache?: boolean;
}

/**
 * Base fetching parameters
 * (empty for now, will be used for future extensions)
 */
export interface BaseFetchingParams {}

/**
 * Assets client class. Represents a client for fetching assets.
 * It implements methods for fetching all the necessary assets about a Exomoon ERC721 Layered NFT collection: collection info, traits, variations, colors.
 * It also provides a caching mechanism for the fetched assets, in order to avoid fetching the same assets multiple times.
 *
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

  protected async fetchResource(url: string): Promise<any> {
    console.log(`[AssetsClient] Fetching resource: ${url}`);
    const res = await axios.get(url);
    return res;
  }

  /**
   * Gets the base URL set during initialization
   * @returns Base URL string
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
   * Fetches collection info from remote server. If cache is enabled, it will return the cached collection info if it exists.
   * @param params Extra fetching parameters
   * @returns Collection info object, or null if not found
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

      console.log("[AssetsClient] Collection info raw:", rawObj);

      collectionInfoObj = rawObj || null;

      if (collectionInfoObj) {
        this._cachedAssetsInfo.collectionInfo = collectionInfoObj;
      }
    }

    return collectionInfoObj;
  }

  /**
   * Fetches traits info from remote server. If cache is enabled, it will return the cached traits if they exist.
   * @param params Extra fetching parameters
   * @returns Traits list array, or empty array if not found
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
   * Fetches a single trait from remote server. If cache is enabled, it will return the cached trait if it exists.
   * @param traitName Trait name
   * @param params Extra fetching parameters
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
   * Fetches all assets info from remote server. If cache is enabled, it will return the cached assets info if it exists.
   * The `AssetsObject` contains the collection info and the traits list, so it's a single object containing all the necessary assets info: after fetching this object, you can access all the other assets info through the cached object.
   * @param params Extra fetching parameters
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
   * Get cached assets object. If no assets are cached, it will return null.
   * This method should be called after being sure that the assets have been fetched, otherwise it will return null.
   *
   * @returns Cached assets object
   * @public
   */
  public getAssetsObject(): AssetsObject | null {
    return this._cachedAssetsInfo || null;
  }

  /**
   * Get traits list. If no traits are cached, it will return an empty array.
   * This method should be called after being sure that the traits have been fetched, otherwise it will return an empty array.
   *
   * @returns Traits list array
   * @public
   */
  public getTrais(): Trait[] {
    return this._cachedAssetsInfo.traits || [];
  }

  /**
   * Get a single trait by name. If the trait is not cached, it will return null.
   * This method should be called after being sure that the trait has been fetched, otherwise it will return null.
   *
   * @param traitName Trait name
   * @returns Trait object, or null if not found
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

  /**
   * Get a single trait by index. If the trait is not cached, it will return null.
   * This method should be called after being sure that the trait has been fetched, otherwise it will return null.
   *
   * @param index Trait index
   * @returns Trait object, or null if not found
   * @public
   */
  public getTraitByIndex(index: number): Trait | null {
    if (this._cachedAssetsInfo.traits) {
      return this._cachedAssetsInfo.traits[index] || null;
    }

    return null;
  }

  /**
   * Get collection info. If no collection info is cached, it will return null.
   * This method should be called after being sure that the collection info has been fetched, otherwise it will return null.
   *
   * @returns Collection info object, or null if not found
   * @public
   */
  public getCollectionInfo(): CollectionInfo | null {
    return this._cachedAssetsInfo.collectionInfo || null;
  }

  /**
   * Clears the cache of fetched assets.
   * After calling this method, all the fetched assets will be removed from the cache, and the next time you call a method that fetches assets, it will fetch them again from the remote server.
   * @public
   */
  public clearCache(): void {
    this.initCache();
  }

  /**
   * Evals the image url for the provided trait, variation and color (optional).
   * If a conditional trait config is provided, it will override the default trait, variation and color, according to the conditional trait config itself.
   *
   * @param params Parameters for getting the image URL
   * @returns Image URL string
   * @public
   */
  public getTraitImageUrl(params: {
    traitName: string;
    variationName: string;
    colorName?: string;
    conditionalTraitConfig?: ConditionalRenderingConfig;
  }): string {
    const trait = this.getTrait(params.traitName);

    if (!trait) {
      throw new Error(`Trait ${params.traitName} not found`);
    }

    let traitUrlSection = trait.name;
    const variationUrlSection = params.variationName;
    const colorUrlSection = params.colorName
      ? params.colorName
      : params.variationName;

    if (params.conditionalTraitConfig) {
      const traits = this.getTrais();

      let configMatchedWithTrait = false;

      const config = params.conditionalTraitConfig;
      const trait = traits.find((t) => t.name === config.traitName);

      if (trait) {
        // If there is no variation name, use match only by trait name
        if (!config.variationName) {
          configMatchedWithTrait = true;
        }

        // If there is a variation name, match by trait name and variation name
        const variation = trait.variations.find(
          (v) => v.name === config.variationName
        );

        if (variation) {
          if (config.colorName) {
            // If there is a color name, match by trait name, variation name and color name
            const color = variation.colors.find((c) => c === config.colorName);

            if (color) {
              configMatchedWithTrait = true;
            }
          } else {
            // If there is no color name, match by trait name and variation name
            configMatchedWithTrait = true;
          }
        }

        if (configMatchedWithTrait) {
          traitUrlSection = `${params.traitName}/${config.folderName}`;
        }
      }
    }

    const imageUrl = `${this.baseUrl}/traits/${traitUrlSection}/${variationUrlSection}/${colorUrlSection}.png`;

    return imageUrl;
  }
}
