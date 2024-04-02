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
   * Get collection info
   * @param params Base fetching parameters
   * @returns Collection info
   * @public
   */
  public async getCollectionInfo(
    params: BaseFetchingParams
  ): Promise<CollectionInfo | null> {
    params = this.validateParams(params);

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

  public async getTraits(params: BaseFetchingParams): Promise<Array<Trait>> {
    params = this.validateParams(params);

    let traits: Array<Trait> = [];

    if (this._useCache && this._cachedAssetsInfo?.traits) {
      traits = this._cachedAssetsInfo.traits;
    } else {
      const response = await this.fetchResource(`${this.baseUrl}/traits.json`);
      const rawObj =
        ModelsUtils.instance.serializer.deserializeObjectArray<Trait>(
          response.data,
          Trait
        ) as Array<Trait>;

      traits = rawObj || [];

      if (traits.length > 0) {
        this._cachedAssetsInfo.traits = traits;
      }
    }

    return traits;
  }
}
