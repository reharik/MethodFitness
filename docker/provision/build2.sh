#!/bin/bash

###########################################
#
# This script is used to dynamically build all Docker Images for a project
#  compose/provision/build.sh <aws profile name> <build plan name> 
#  This script must be run at the root of a project plan directory
#
###########################################

set -e

# echo "Logging into the ECR"
# $(aws ecr get-login --profile $AWS_PROFILE --region us-east-1)

echo "Creating the Build artifacts directory"
rm -f docker/.envrc

DOCKER_REPO="709865789463.dkr.ecr.us-east-2.amazonaws.com/methodfitness/"
export TAG=$(git rev-parse --short HEAD)

SERVICES=("data" "api" "workflows" "projections" "frontend")
for IMG in ${SERVICES[@]}
do

IMAGE_NAME=$DOCKER_REPO$IMG:$TAG
IMAGE_NAME_KEY="mf_"$IMG"_image"
export $IMAGE_NAME_KEY=$IMAGE_NAME
echo "$IMAGE_NAME_KEY=$IMAGE_NAME" >> docker/.envrc

done

echo "image names in env file"
cat docker/.envrc 2>/dev/null

echo "Building docker images and deployment artifacts"

sudo docker-compose -f docker/docker-compose-build.yml build

sudo docker-compose -f docker/docker-compose-build.yml push

sudo docker-compose -f docker/docker-compose-build.yml down --rmi local --remove-orphans

echo "All Docker Images have been built and deploy artifacts have been created, Happy deploying!"
