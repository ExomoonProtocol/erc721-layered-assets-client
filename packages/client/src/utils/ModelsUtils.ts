import { JsonSerializer } from "typescript-json-serializer";

export class ModelsUtils {
  private static _instance: ModelsUtils;

  private _serializer: JsonSerializer;

  constructor() {
    this._serializer = new JsonSerializer();
  }

  public static get instance(): ModelsUtils {
    if (!this._instance) this._instance = new ModelsUtils();

    return this._instance;
  }

  public get serializer(): JsonSerializer {
    return this._serializer;
  }
}
