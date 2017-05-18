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

echo "Logging into the ECR"
#$(aws ecr get-login --profile $AWS_PROFILE --region us-east-1)

echo "Creating the Build artifacts directory"
rm -rf artifacts
mkdir -p artifacts
cp ./docker/docker-compose-deploy.yml artifacts/docker-compose.yml
cp ./.envrc.example artifacts/.envrc.example
cp ./deploy_containers.sh artifacts/deploy_containers.sh


export DOCKER_REPO="999447569257.dkr.ecr.us-east-1.amazonaws.com/wk/"

BAMBOO_BRANCHNAME=$BUILD_PLANNAME
BAMBOO_BUILDNUMBER=$(git rev-parse HEAD)
BAMBOO_BUILDNUMBER=${BAMBOO_BUILDNUMBER:(-7)}
export TAG="$BAMBOO_BRANCHNAME"_v"$BAMBOO_BUILDNUMBER"

for IMG in $(make dockerListServices)
do
IMAGE_NAME_KEY=wk_"$IMG"_image
IMAGE_NAME=$DOCKER_REPO$IMG:$TAG
export IMAGE_NAME_KEY=$IMAGE_NAME
echo "IMAGE_NAME_KEY=$IMAGE_NAME" >> artifacts/.envrc.example
done
cp ./artifacts/.envrc.example ./docker/.envrc.example
echo "Building docker images and deployment artifacts"
make dockerBuild



echo "All Docker Images have been built and deploy artifacts have been created, Happy deploying!"
