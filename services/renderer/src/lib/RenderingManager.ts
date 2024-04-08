import {
  AssetsClient,
  INftMetadata,
  ItemConfiguration,
  ItemConfigurationStatus,
  NftMetadata,
} from "@exomoon/erc721-layered-assets-client";
import { FileInfo } from "../models";
import axios from "axios";
import { createCanvas, Canvas, loadImage } from "canvas";

/**
 * Rendering manager class
 */
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

  /**
   * Renders metadata based on the provided layers data.
   * @param id Item ID
   * @param data Layers data
   * @returns Rendered metadata
   * @throws Error if the metadata cannot be rendered
   */
  public async renderMetadata(id: number, data: string): Promise<INftMetadata> {
    const traitsConfigurations =
      await ItemConfiguration.buildFromLayersDataString(
        data,
        this.assetsClient
      );

    const metadata = traitsConfigurations.renderMetadata();

    metadata.setVariables({
      id: id,
    });

    metadata.substituteVariables();

    return metadata.serialize();
  }

  public static async fetchImage(imageUrl: string): Promise<Buffer> {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    return Buffer.from(response.data, "binary");
  }

  public static async layerizeImages(
    images: Array<Buffer>,
    size: number
  ): Promise<Buffer> {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");

    for (let i = 0; i < images.length; i++) {
      const image = await loadImage(images[i]);
      ctx.drawImage(image, 0, 0);
    }

    return canvas.toBuffer();
  }

  /**
   * Renders an image based on the provided layers data.
   * @param data Layers data
   * @param size Image size
   * @returns Rendered image
   * @throws Error if the image cannot be rendered
   */
  public async renderImage(data: string, size: number): Promise<Buffer> {
    const traitsConfigurations =
      await ItemConfiguration.buildFromLayersDataString(
        data,
        this.assetsClient
      );

    const imagesUrls = traitsConfigurations.getTraitsUrls();

    console.log("Images URLs: ", imagesUrls);

    const images = await Promise.all(
      imagesUrls.map((imageUrl) => RenderingManager.fetchImage(imageUrl))
    );

    console.log("Images: ", images);
    const image = await RenderingManager.layerizeImages(images, size);

    return image;
  }
}
