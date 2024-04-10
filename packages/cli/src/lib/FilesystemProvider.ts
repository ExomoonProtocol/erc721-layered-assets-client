/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseFileProvider } from "@exomoon/erc721-layered-assets-client";
import fs from "fs";

export class FilesystemProvider extends BaseFileProvider {
  constructor() {
    super();
  }

  public async fetchResource(
    _path: string,
    _options: Record<string, any> = {}
  ): Promise<any> {
    const absolutePath: fs.PathLike = _path as any;

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${absolutePath}`);
    }

    return fs.readFileSync(absolutePath, _options.encoding || "utf-8");
  }
}
