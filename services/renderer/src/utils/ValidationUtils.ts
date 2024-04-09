import { FileInfo, FileType } from "../models/FileInfo";

/**
 * Provides utility methods for validation.
 */
export class ValidationUtils {
  /**
   * Validates the requested file.
   * @param file The requested file.
   * @returns The file information.
   */
  public static validateRequestedFile(file: string): FileInfo {
    if (!file) {
      throw new Error("Missing file parameter");
    }

    const fileParts = file.split(".");
    if (fileParts.length !== 2) {
      throw new Error("Invalid file parameter");
    }

    const extension = fileParts[1];
    let type: FileType;
    if (extension === "png") {
      type = FileType.Image;
    } else if (extension === "json") {
      type = FileType.Metadata;
    } else {
      throw new Error("Invalid file extension");
    }

    const name = fileParts[0];
    if (isNaN(parseInt(name)) || parseInt(name) < 1) {
      throw new Error("Invalid file name");
    }

    return {
      fullName: file,
      name,
      extension,
      type,
    };
  }

  /**
   * Validates the image size.
   * @param size The requested image size.
   * @returns The image size.
   */
  public static validateImageSize(size?: string): number {
    let sizeNumber = parseInt(size || "");
    if (isNaN(sizeNumber) || sizeNumber < 1 || sizeNumber > 2048) {
      sizeNumber = 1024;
    }

    return sizeNumber;
  }

  /**
   * Validates the layers data format.
   * N.B. This method does not validate the layers data itself, only the format.
   * @param layersData The layers data.
   */
  public static validateLayersDataFormat(layersData: string): string {
    if (!layersData) {
      throw new Error("Missing layers data");
    }

    if (!layersData.startsWith("0x")) {
      throw new Error("Invalid layers data format");
    }

    const hex = layersData.substring(2);

    if (!/^[0-9a-f]+$/.test(hex)) {
      throw new Error("Invalid layers data format");
    }

    return layersData;
  }
}
