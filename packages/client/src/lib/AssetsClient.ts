import { CollectionInfo } from "../models";
import axios from "axios";

export interface AssetsClientInitParams {
  baseUrl: string;
}

export class AssetsClient {
  private _baseUrl: string;

  constructor(initParams: AssetsClientInitParams) {
    this._baseUrl = initParams.baseUrl;
  }

  public get baseUrl(): string {
    return this._baseUrl;
  }

  public async getCollectionInfo(): Promise<CollectionInfo> {
    const response = await axios.get(`${this.baseUrl}/collection.json`);
    return response.data;
  }
}
