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

echo "--------------------------------------"
echo "Creating the Build artifacts directory"
echo "--------------------------------------"

rm -rf ./deploy
mkdir ./deploy
cp docker/docker-compose-deploy.yml deploy/docker-compose.yml
cp docker/provision/deploy_containers.sh deploy/deploy_containers.sh

DOCKER_REPO="709865789463.dkr.ecr.us-east-2.amazonaws.com/methodfitness/"
export TAG=$(git show -s --format=%h)

SERVICES=("data" "api" "workflows" "projections" "frontend")
for IMG in ${SERVICES[@]}
    do

        IMAGE_NAME=$DOCKER_REPO$IMG:$TAG
        IMAGE_NAME_KEY="mf_"$IMG"_image"
        export $IMAGE_NAME_KEY=$IMAGE_NAME
        echo "$IMAGE_NAME_KEY=$IMAGE_NAME" >> deploy/.env

    done

echo "POSTGRES_USER=$(printenv POSTGRES_USER)"  >> .envrc.qa
echo "POSTGRES_PASSWORD=$(printenv POSTGRES_PASSWORD)"  >> .envrc.qa
echo "EVENTSTORE_USER=$(printenv EVENTSTORE_USER)"  >> .envrc.qa
echo "EVENTSTORE_PASSWORD=$(printenv EVENTSTORE_PASSWORD)"  >> .envrc.qa
echo "LOGGLY_TOKEN=$(printenv LOGGLY_TOKEN)"  >> .envrc.qa

cat .envrc.qa >> deploy/.env

cat deploy/.env
echo "==============="
cat .envrc.qa
echo "==============="

IMAGE_CHECK=$(aws ecr list-images --repository-name methodfitness/api | grep "$TAG") || echo ''
echo $IMAGE_CHECK
if [ -z "${IMAGE_CHECK}" ]; then

echo "--------------------------------------"
echo "Removing old images"
echo "--------------------------------------"

     docker rm -vf $(docker ps -a -q) 2>/dev/null || echo "No more containers to remove."
     docker images -q -f "label=methodfitness=child" | while read -r image; do docker rmi -f $image; done;
     docker images -q -f "label=methodfitness=base4" | while read -r image; do docker rmi -f $image; done;
     docker images -q -f "label=methodfitness=base3" | while read -r image; do docker rmi -f $image; done;
     docker images -q -f "label=methodfitness=base2" | while read -r image; do docker rmi -f $image; done;

echo "--------------------------------------"
echo "Rebuilding the images"
echo "--------------------------------------"

    docker-compose -f docker/docker-compose-build.yml build

echo "--------------------------------------"
echo "Pushing images to aws"
echo "--------------------------------------"

    docker-compose -f docker/docker-compose-build.yml push

else
  echo "--------------------------------------"
  echo "$DOCKER_REPO/api:$TAG exists in the ECR skipping build process"
  echo "--------------------------------------"

fi

echo "--------------------------------------"
echo "Build stage complete"
echo "--------------------------------------"
