import { AssetsClient } from "./AssetsClient";

/**
 * Base class for consumers of AssetsClient
 */
export class AssetsClientConsumer {
  private _assetsClient: AssetsClient;

  constructor(client: AssetsClient) {
    this._assetsClient = client;
  }

  public get assetsClient(): AssetsClient {
    return this._assetsClient;
  }
}
