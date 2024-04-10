/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseFileProvider } from "./BaseFileProvider";
import axios from "axios";

export class HttpFileProvider extends BaseFileProvider {
  constructor() {
    super();
  }

  public async fetchResource(path: string): Promise<any> {
    const response = await axios.get(path);

    return response.data;
  }
}
