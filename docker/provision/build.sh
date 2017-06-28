#!/bin/bash

###########################################
#
# This script is used to dynamically build all Docker Images for a project
#  compose/provision/build.sh <aws profile name> <build plan name> 
#  This script must be run at the root of a project plan directory
#
###########################################

AWS_PROFILE=$1
BUILD_PLANNAME=$2
set -e

echo "Logging into the ECR"
$(aws ecr get-login --profile $AWS_PROFILE --region us-east-1)

echo "Creating the Build artifacts directory"
rm -rf artifacts
mkdir -p artifacts
cp ./docker/docker-compose-deploy.yml artifacts/docker-compose.yml
cp ./docker/provision/deploy_containers.sh artifacts/deploy_containers.sh
cp ./docker/provision/deploy.sh artifacts/deploy.sh
cp ./docker/provision/env_builder.sh artifacts/env_builder.sh
cp ./.envrc.example artifacts/.envrc.example

touch artifacts/.env

DOCKER_REPO="709865789463.dkr.ecr.us-east-2.amazonaws.com/methodfitness/"
export TAG=$(git rev-parse --short HEAD)

SERVICES=("data" "api" "serve" "frontend")
for IMG in ${SERVICES[@]}
do

IMAGE_NAME=$DOCKER_REPO$IMG:$TAG
IMAGE_NAME_KEY="mf_"$IMG"_image"
export $IMAGE_NAME_KEY=$IMAGE_NAME
echo "$IMAGE_NAME_KEY=$IMAGE_NAME" >> artifacts/.env

done

echo "image names in env file"
cat artifacts/.env

cp artifacts/.env docker/.envrc.example

echo "Building docker images and deployment artifacts"

docker-compose -f docker/docker-compose-build.yml build

docker-compose -f docker/docker-compose-build.yml push

rm docker/.envrc.example

#docker-compose -f docker/docker-compose-build.yml down --rmi local --remove-orphans

echo "All Docker Images have been built and deploy artifacts have been created, Happy deploying!"
