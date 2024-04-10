/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Base class for file providers
 */
export abstract class BaseFileProvider {
  constructor() {}

  public async fetchResource(
    _path: string,
    _options: Record<string, any> = {}
  ): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
