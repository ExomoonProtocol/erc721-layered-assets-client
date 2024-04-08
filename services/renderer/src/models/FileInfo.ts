export enum FileType {
  Image = "image",
  Metadata = "metadata",
}

/**
 * Represents information about a file.
 */
export interface FileInfo {
  /**
   * The full name of the file, including the extension.
   */
  fullName: string;

  /**
   * The name of the file without the extension.
   */
  name: string;

  /**
   * The extension of the file.
   */
  extension: string;

  /**
   * The type of the file.
   */
  type: FileType;
}
