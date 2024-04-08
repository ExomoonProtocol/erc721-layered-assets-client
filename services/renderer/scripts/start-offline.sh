#!/bin/bash

echo "Starting service in offline mode."

ENV_NAME=development
STAGE_NAME=d1

echo Environment: $ENV_NAME
echo Stage: $STAGE_NAME


# NODE_ENV=$ENV_NAME STAGE=$STAGE_NAME npx sls generate-swagger
NODE_ENV=$ENV_NAME STAGE=$STAGE_NAME serverless offline start
