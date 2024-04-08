"use strict";

import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { LambdaResponses } from "../utils/LambdaResponses";
import { ValidationUtils } from "../utils";
import { RenderingManager } from "../lib/RenderingManager";
import {
  CollectionInfo,
  ModelsUtils,
} from "@exomoon/erc721-layered-assets-client";

export const render: APIGatewayProxyHandler = async (
  _event: APIGatewayProxyEvent
) => {
  if (!process.env.ASSETS_BASE_URL) {
    return LambdaResponses.serverError("ASSETS_BASE_URL is not set");
  }

  try {
    // Read and validates the requested file (eg. file name, extension, etc...)
    const fileInfo = ValidationUtils.validateRequestedFile(
      _event.pathParameters!.file!
    );

    // Read and validates the layers data
    const layersData = ValidationUtils.validateLayersDataFormat(
      _event.pathParameters!.data!
    );

    // Get the size of the image to be rendered (default is 1024 pixels)
    const imageSize = ValidationUtils.validateImageSize(
      (_event.queryStringParameters && _event.queryStringParameters.size) || ""
    );

    const id = parseInt(fileInfo.name);

    if (fileInfo.type === "metadata") {
      // If the requested file is a metadata file, render the metadata
      const metadata = await RenderingManager.instance.renderMetadata(
        id,
        layersData
      );
      return LambdaResponses.success(metadata);
    } else {
      // If the requested file is an image, render the image
      const image = await RenderingManager.instance.renderImage(
        id,
        layersData,
        imageSize
      );
      return LambdaResponses.success({});
    }

    return LambdaResponses.success({ imageSize, fileInfo, layersData });
    // return LambdaResponses.success(process.env);
  } catch (error) {
    console.error(error);
    return LambdaResponses.badRequest((error as any).message);
  }
};
