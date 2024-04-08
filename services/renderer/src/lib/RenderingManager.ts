import {
  AssetsClient,
  ItemConfiguration,
  ItemConfigurationStatus,
  NftMetadata,
} from "@exomoon/erc721-layered-assets-client";
import { FileInfo } from "../models";

export class RenderingManager {
  private static _instance: RenderingManager;

  private _assetsClient: AssetsClient;

  private constructor() {
    this._assetsClient = new AssetsClient({
      baseUrl: process.env.ASSETS_BASE_URL!,
      useCache: true,
    });
  }

  public static get instance(): RenderingManager {
    if (!RenderingManager._instance) {
      RenderingManager._instance = new RenderingManager();
    }

    return RenderingManager._instance;
  }

  public get assetsClient(): AssetsClient {
    return this._assetsClient;
  }

  public async renderMetadata(
    file: FileInfo,
    data: string
  ): Promise<NftMetadata> {
    console.log("init render");
    const traitsConfigurations =
      await ItemConfiguration.buildFromLayersDataString(
        data,
        this.assetsClient
      );
    console.log("render completed");

    return traitsConfigurations.renderMetadata();
  }
}
