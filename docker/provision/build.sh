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
$(aws ecr get-login --region us-east-2)

echo "Creating the Build artifacts directory"
rm -rf ./deploy
mkdir ./deploy
cp docker/docker-compose-deploy.yml deploy/docker-compose.yml
cp docker/provision/deploy_containers.sh deploy/deploy_containers.sh

DOCKER_REPO="709865789463.dkr.ecr.us-east-2.amazonaws.com/methodfitness/"
export TAG=$(git rev-parse --short HEAD)

SERVICES=("data" "api" "workflows" "projections" "frontend")
for IMG in ${SERVICES[@]}
    do

        IMAGE_NAME=$DOCKER_REPO$IMG:$TAG
        IMAGE_NAME_KEY="mf_"$IMG"_image"
        export $IMAGE_NAME_KEY=$IMAGE_NAME
        echo "$IMAGE_NAME_KEY=$IMAGE_NAME" >> deploy/.env

    done

echo "image names in env file"
cat .envrc.qa >> deploy/.env
cat deploy/.env 2>/dev/null

echo "Building docker images and deployment artifacts"

IMAGE_CHECK=$(aws ecr list-images --repository-name methodfitness/api | grep "$TAG") || echo ''
echo $IMAGE_CHECK
if [ -z "${IMAGE_CHECK}" ]; then

     docker rm -vf $(docker ps -a -q) 2>/dev/null || echo "No more containers to remove."
     docker images | grep "/methodfitness" | awk '{print $1 ":" $2}' | xargs docker rmi

    docker-compose -f docker/docker-compose-build2.yml build

    docker-compose -f docker/docker-compose-build2.yml push

else

  echo "$DOCKER_REPO/api:$TAG exists in the ECR skipping build process"
  echo "------------------------"

fi

echo "All Docker Images have been built and deploy artifacts have been created, Happy deploying!"
