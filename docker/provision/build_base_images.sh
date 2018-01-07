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
echo "Removing old images"
echo "--------------------------------------"

     docker rm -vf $(docker ps -a -q) 2>/dev/null || echo "No more containers to remove."
     docker images | grep "/base_mf" | awk '{print $1 ":" $2}' | xargs docker rmi || ''

echo "--------------------------------------"
echo "building and pushing the base images"
echo "--------------------------------------"

     make removeBuildAndPushAll

echo "--------------------------------------"
echo "Build stage complete"
echo "--------------------------------------"
