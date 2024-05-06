/**
 * Base class for handling commands
 */
export class BaseCommandHandler {
  constructor() {}

  /**
   * Run the command
   */
  public async run() {
    throw new Error("Method not implemented.");
  }
}
