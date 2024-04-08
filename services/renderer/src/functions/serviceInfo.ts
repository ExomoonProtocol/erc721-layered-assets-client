/* eslint-disable @typescript-eslint/ban-ts-comment */
"use strict";

import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";

export const serviceInfo: APIGatewayProxyHandler = async (
  _event: APIGatewayProxyEvent
) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ status: "ok" }),
  };
};
