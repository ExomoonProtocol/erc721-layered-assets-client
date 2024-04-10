import { BaseCommandHandler } from "../lib/BaseCommandHandler";
import chalk from "chalk";
import inquirer from "inquirer";
import {
  AssetsClient,
  Trait,
  Variation,
} from "@exomoon/erc721-layered-assets-client";
import { FilesystemProvider } from "../lib/FilesystemProvider";
import { createCanvas, loadImage } from "canvas";
import path from "path";
import fs from "fs";

export class GenThumbnailsCommand extends BaseCommandHandler {
  protected path: string;

  protected assetsClient: AssetsClient;

  constructor() {
    super();
  }

  public async menu() {
    // Create a menu for let the user insert the Assets folder absolute path in their file system
    const response = await inquirer.prompt([
      {
        name: "path",
        type: "input",
        message: "Insert the absolute path of the Assets folder",
        validate: (value) => {
          if (value.length) {
            return true;
          } else {
            return "Please insert a valid path";
          }
        },
      },
    ]);

    console.log(chalk.green(`The path is: ${response.path}`));

    this.path = response.path;
    console.log("Typeof of path", typeof this.path, typeof response.path);

    const client = new AssetsClient({
      baseUrl: this.path,
      useCache: true,
      fileProvider: new FilesystemProvider(),
    });

    this.assetsClient = client;
  }

  public async loadAssetsInfo() {
    // Load the assets info
    console.log(chalk.green("Loading assets info..."));
    await this.assetsClient.fetchAssetsObject();
  }

  public async genVariationThumbnail(trait: Trait, variation: Variation) {
    if (!variation.previewImageUrl) {
      console.log(
        chalk.red(
          `No preview image for variation ${trait.name} ${variation.name}`
        )
      );
      return;
    }

    // Generate the thumbnail for a variation
    console.log(
      chalk.green(
        `Generating thumbnail for variation ${trait.name} ${variation.name}...`
      )
    );

    const filePath = path.join(
      variation.previewImageUrl,
      "..",
      variation.colors ? `${variation.colors[0]}.png` : `${variation.name}.png`
    );

    const finalSize = 100;
    const thumbnailFileBuffer = await this.resizePngImage(
      filePath,
      finalSize,
      finalSize
    );

    fs.writeFileSync(variation.previewImageUrl, thumbnailFileBuffer);
  }

  public async resizePngImage(
    imageFilePath: string,
    finalWidth: number,
    finalHeight: number
  ): Promise<Buffer> {
    // Createa a canvas for the image, load it, resize it and return it as a buffer
    const canvas = createCanvas(finalWidth, finalHeight);
    const ctx = canvas.getContext("2d");

    const image = await loadImage(imageFilePath);
    ctx.drawImage(image, 0, 0, finalWidth, finalHeight);

    return canvas.toBuffer();
  }

  public async genThumbnails() {
    // Generate the thumbnails
    console.log(chalk.green("Generating thumbnails..."));

    const traits = this.assetsClient.getTraits();

    const promises: Array<Promise<void>> = [];

    traits.forEach((t) => {
      t.variations.forEach((v) => {
        promises.push(this.genVariationThumbnail(t, v));
      });
    });

    await Promise.all(promises);
  }

  public async run() {
    await this.menu();

    await this.loadAssetsInfo();

    await this.genThumbnails();
  }
}
