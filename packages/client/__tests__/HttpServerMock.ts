import { readFileSync, statSync, readdirSync } from "fs";

/**
 * Response mapping object
 */
export interface ResponseMapping {
  /**
   * Url (or regex) to be matched
   */
  url: RegExp | string;

  /**
   * Response object to be returned by axios
   */
  responseObject?: any;

  /**
   * Path of the file to be used as response
   */
  filePath?: string;

  /**
   * File encoding. Unset by default
   */
  fileEncoding?: string;
}

export interface HttpServerMockResponse {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}

export class HttpServerMockResponseInstance implements HttpServerMockResponse {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;

  constructor(res?: HttpServerMockResponse) {
    if (res) {
      this.data = res.data;
      this.status = res.status;
      this.statusText = res.statusText;
      this.headers = res.headers;
      this.config = res.config;
      this.request = res.request;
    }
  }

  public async arrayBuffer(): Promise<any> {
    return this.data;
  }
}

/**
 * Class for simulating an http server, by mapping
 * urls to their corresponding responses
 */
export class HttpServerMock {
  private static _instance: HttpServerMock;

  private _responseMappings: Array<ResponseMapping>;

  private _temporaryResponseMappings: Array<ResponseMapping>;

  constructor() {
    this.clearAll();
  }

  public clearTemporary(): void {
    this._temporaryResponseMappings = [];
  }

  public clearAll(): void {
    this.clearTemporary();
    this._responseMappings = [];
  }

  public static get instance(): HttpServerMock {
    if (!this._instance) this._instance = new HttpServerMock();

    return this._instance;
  }

  public get temporaryResponseMappings(): Array<ResponseMapping> {
    return this._temporaryResponseMappings;
  }

  public get responseMappings(): Array<ResponseMapping> {
    return [...this._responseMappings, ...this.temporaryResponseMappings];
  }

  protected static validateResponseMapping(
    mapping: ResponseMapping
  ): Array<ResponseMapping> {
    console.log("Validating mapping", mapping);

    let mappings: Array<ResponseMapping> = [mapping];

    if (mapping.filePath) {
      const stats = statSync(mapping.filePath);

      if (stats.isDirectory()) {
        const files = readdirSync(mapping.filePath);

        mappings = files.map((file) => {
          const extension = file.split(".").pop();

          return {
            ...mapping,
            url: `${mapping.url}/${file}`,
            filePath: `${mapping.filePath}/${file}`,
            fileEncoding: ["json", "txt"].includes(extension || "")
              ? "utf-8"
              : undefined,
          };
        });

        return mappings.map(HttpServerMock.validateResponseMapping).flat();
      }
    }

    return mappings;
  }

  public setTemporaryResponseMappings(
    newResponseMappings: Array<ResponseMapping>
  ): void {
    this._temporaryResponseMappings = newResponseMappings;
  }

  public addTemporaryResponseMappings(
    newResponseMappings: Array<ResponseMapping>
  ): void {
    this.setTemporaryResponseMappings([
      ...this._temporaryResponseMappings,
      ...newResponseMappings.map(HttpServerMock.validateResponseMapping).flat(),
    ]);
  }

  public setResponseMappings(
    newResponseMappings: Array<ResponseMapping>
  ): void {
    this._responseMappings = newResponseMappings;
  }

  public addResponseMappings(
    newResponseMappings: Array<ResponseMapping>
  ): void {
    this.setResponseMappings([
      ...this._responseMappings,
      ...newResponseMappings,
    ]);
  }

  private makeObjectResponse(mapping: ResponseMapping): HttpServerMockResponse {
    return {
      data: mapping.responseObject,
      status: 200,
      statusText: "",
      headers: {},
      config: {},
    };
  }

  private makeFileResponse(mapping: ResponseMapping): HttpServerMockResponse {
    const content = readFileSync(mapping.filePath!, {
      encoding: mapping.fileEncoding as any,
    });

    return {
      data: content,
      status: 200,
      statusText: "",
      headers: {},
      config: {},
    };
  }

  public makeResponse(
    mapping: ResponseMapping | null
  ): HttpServerMockResponseInstance {
    let failureResponse = {
      data: null,
      status: 500,
      statusText: "",
      headers: {},
      config: {},
    };

    let response: HttpServerMockResponse = failureResponse;

    if (!mapping) {
      response = failureResponse;
    } else if (mapping.responseObject) {
      response = this.makeObjectResponse(mapping);
    } else if (mapping.filePath) {
      // Check if file or folder

      const stats = statSync(mapping.filePath);

      if (stats.isDirectory()) {
        // response = this.makeFolderResponse(mapping);
      } else {
        response = this.makeFileResponse(mapping);
      }

      // response = this.makeFileResponse(mapping);
    }

    return new HttpServerMockResponseInstance(response);
  }

  public findResponseMapping(url: string): ResponseMapping | null {
    let mapping: ResponseMapping | null = null;

    mapping =
      this.responseMappings.find((resMapping) => {
        if (typeof resMapping.url === "string") {
          return resMapping.url === url;
        }

        return resMapping.url.test(url);
      }) || null;

    return mapping;
  }
}
