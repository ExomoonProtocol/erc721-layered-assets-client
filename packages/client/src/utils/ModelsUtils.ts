import { JsonSerializer } from "typescript-json-serializer";

/**
 * Helper class for accomplishing common tasks with models.
 * Under a structural point of view, this class is a singleton, so it can be used to share the same instance of the serializer across the application.
 */
export class ModelsUtils {
  private static _instance: ModelsUtils;

  private _serializer: JsonSerializer;

  constructor() {
    this._serializer = new JsonSerializer({
      errorCallback: (error) => {
        console.error(error);
      },
    });
  }

  /**
   * Get the instance of the class.
   * @returns {ModelsUtils} The instance of the class.
   */
  public static get instance(): ModelsUtils {
    if (!this._instance) this._instance = new ModelsUtils();

    return this._instance;
  }

  /**
   * Get the serializer instance.
   * @returns {JsonSerializer} The serializer instance.
   */
  public get serializer(): JsonSerializer {
    return this._serializer;
  }
}
