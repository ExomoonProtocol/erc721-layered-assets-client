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
    let lambdaResponse: APIGatewayProxyResult = {
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
    let body = customBody || "Not Found";
    let lambdaResponse = this.response(404, body);
    return lambdaResponse;
  }

  /**
   * Creates a Server Error response
   *
   * @param customBody optional, the custom body in the response
   * @returns Server Error response as an object
   */
  public static serverError(customBody?: string | object) {
    let body = customBody || "Server Error";
    let lambdaResponse = this.response(500, body);
    return lambdaResponse;
  }

  /**
   * Creates a Bad Request response
   *
   * @param customBody optional, the custom body in the response
   * @returns Bad Request response as an object
   */
  public static badRequest(customBody?: string | object) {
    let body = customBody || "Bad Request";
    let lambdaResponse = this.response(400, body);
    return lambdaResponse;
  }

  /**
   * Creates a Forbidden response
   *
   * @param customBody optional, the custom body in the response
   * @returns Forbidden response as an object
   */
  public static forbidden(customBody?: string | object) {
    let body = customBody || "Forbidden";
    let lambdaResponse = this.response(403, body);
    return lambdaResponse;
  }

  /**
   * Creates a Unauthorized response
   *
   * @param customBody optional, the custom body in the response
   * @returns unauthorized response as an object
   */
  public static unauthorized(customBody?: string | object) {
    let body = customBody || "Unauthorized";
    let lambdaResponse = this.response(401, body);
    return lambdaResponse;
  }

  /**
   * Creates a Success response
   *
   * @param customBody optional, the custom body in the response
   * @returns Success response as an object
   */
  public static success(customBody?: string | object) {
    let body = customBody || "Success";
    let lambdaResponse = this.response(200, body);
    return lambdaResponse;
  }
}
