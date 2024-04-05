import { HttpServerMock, ResponseMapping } from "./HttpServerMock";

export type AxiosMockRequestConfig = any;

/**
 * Mock response object
 */
export interface AxiosMockResponse {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}

/**
 * Mock implementation for Axios module
 */
export class AxiosMock {
  private static _instance: AxiosMock;

  constructor() {}

  public static get instance(): AxiosMock {
    if (!this._instance) this._instance = new AxiosMock();

    return this._instance;
  }

  private locateInstance(): AxiosMock {
    if (AxiosMock._instance) return AxiosMock.instance;

    return this;
  }

  private async _get(
    url: string,
    _config?: AxiosMockRequestConfig
  ): Promise<AxiosMockResponse> {
    let mapping = HttpServerMock.instance.findResponseMapping(url);

    return HttpServerMock.instance.makeResponse(mapping);
  }

  public async get(
    url: string,
    config?: AxiosMockRequestConfig
  ): Promise<AxiosMockResponse> {
    let instance = this.locateInstance();

    return instance._get(url, config);
  }

  private async _post(
    url: string,
    _data?: any,
    _config?: AxiosMockRequestConfig
  ): Promise<AxiosMockResponse> {
    return HttpServerMock.instance.makeResponse(
      HttpServerMock.instance.findResponseMapping(url)
    );
  }

  public async post(
    url: string,
    data?: any,
    config?: AxiosMockRequestConfig
  ): Promise<AxiosMockResponse> {
    let instance = this.locateInstance();

    return instance._post(url, data, config);
  }

  private async _put(
    url: string,
    _data?: any,
    _config?: AxiosMockRequestConfig
  ): Promise<AxiosMockResponse> {
    return HttpServerMock.instance.makeResponse(
      HttpServerMock.instance.findResponseMapping(url)
    );
  }

  public async put(
    url: string,
    data: any,
    config?: AxiosMockRequestConfig
  ): Promise<AxiosMockResponse> {
    let instance = this.locateInstance();

    return instance._put(url, data, config);
  }

  private async _delete(
    url: string,
    _config?: AxiosMockRequestConfig
  ): Promise<AxiosMockResponse> {
    return HttpServerMock.instance.makeResponse(
      HttpServerMock.instance.findResponseMapping(url)
    );
  }

  public async delete(
    url: string,
    config?: AxiosMockRequestConfig
  ): Promise<AxiosMockResponse> {
    let instance = this.locateInstance();

    return instance._delete(url, config);
  }
}
