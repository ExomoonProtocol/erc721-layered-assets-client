import { BaseCommandHandler } from "../lib/BaseCommandHandler";
import chalk from "chalk";
import inquirer from "inquirer";
import { AssetsClient } from "@exomoon/erc721-layered-assets-client";
import { FilesystemProvider } from "../lib/FilesystemProvider";

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

  public async run() {
    await this.menu();

    await this.loadAssetsInfo();

    console.log(
      "Assets client:",
      JSON.stringify(this.assetsClient.getAssetsObject(), null, 2)
    );
  }
}
