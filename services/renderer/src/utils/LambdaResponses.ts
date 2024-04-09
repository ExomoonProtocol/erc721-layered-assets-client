import { APIGatewayProxyResult } from "aws-lambda";

/**
 * Utils class for validating lambda responses (eg. validates Not Found response, etc...)
 */
export class LambdaResponses {
  /**
   * LambdaResponses creator
   *
   * @param statusCode statusCode to be in the response
   * @param body body to be in the response
   * @returns APIGatewayProxyResult objects made of the two parameters
   */
  public static response(
    statusCode: number,
    body: string | object
  ): APIGatewayProxyResult {
    const lambdaResponse: APIGatewayProxyResult = {
      statusCode: statusCode,
      body: JSON.stringify(
        typeof body === "object" ? body : this.responseMessage(body)
      ),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
    return lambdaResponse;
  }

  /**
   * LambdaResponses creator for images
   *
   * @param statusCode statusCode to be in the response
   * @param imageBuffer imageBuffer to be in the response
   * @returns APIGatewayProxyResult objects made of the two parameters
   */
  public static imageResponse(
    statusCode: number,
    imageBuffer: Buffer
  ): APIGatewayProxyResult {
    const lambdaResponse: APIGatewayProxyResult = {
      statusCode: statusCode,
      headers: {
        "Content-Type": "image/png",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, OPTIONS, PUT, PATCH, DELETE",
      },
      body: imageBuffer.toString("base64"),
      isBase64Encoded: true,
    };
    return lambdaResponse;
  }

  /**
   * Transforms a message into an object
   *
   * @param message the message to be transformed
   * @returns the object created
   */

  private static responseMessage(message: string): object {
    return { message: message };
  }

  /**
   * Creates a Not Found response
   *
   * @param customBody optional, the custom body in the response
   * @returns Not Found response as an object
   */
  public static notFound(customBody?: string | object) {
    const body = customBody || "Not Found";
    const lambdaResponse = this.response(404, body);
    return lambdaResponse;
  }

  /**
   * Creates a Server Error response
   *
   * @param customBody optional, the custom body in the response
   * @returns Server Error response as an object
   */
  public static serverError(customBody?: string | object) {
    const body = customBody || "Server Error";
    const lambdaResponse = this.response(500, body);
    return lambdaResponse;
  }

  /**
   * Creates a Bad Request response
   *
   * @param customBody optional, the custom body in the response
   * @returns Bad Request response as an object
   */
  public static badRequest(customBody?: string | object) {
    const body = customBody || "Bad Request";
    const lambdaResponse = this.response(400, body);
    return lambdaResponse;
  }

  /**
   * Creates a Forbidden response
   *
   * @param customBody optional, the custom body in the response
   * @returns Forbidden response as an object
   */
  public static forbidden(customBody?: string | object) {
    const body = customBody || "Forbidden";
    const lambdaResponse = this.response(403, body);
    return lambdaResponse;
  }

  /**
   * Creates a Unauthorized response
   *
   * @param customBody optional, the custom body in the response
   * @returns unauthorized response as an object
   */
  public static unauthorized(customBody?: string | object) {
    const body = customBody || "Unauthorized";
    const lambdaResponse = this.response(401, body);
    return lambdaResponse;
  }

  /**
   * Creates a Success response
   *
   * @param customBody optional, the custom body in the response
   * @returns Success response as an object
   */
  public static success(customBody?: string | object) {
    const body = customBody || "Success";
    const lambdaResponse = this.response(200, body);
    return lambdaResponse;
  }
}
