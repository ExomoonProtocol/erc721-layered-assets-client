#!/bin/bash

echo "Removing service."

ENV_NAME=development
STAGE_NAME=d1

if [ $# -eq 1 ] && [ $1 = "--prod" ] ; then
    ENV_NAME=production
    STAGE_NAME=p1
fi

echo Environment: $ENV_NAME
echo Stage: $STAGE_NAME

NODE_ENV=$ENV_NAME STAGE=$STAGE_NAME npx serverless remove --verbose
