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
     docker images | grep "/base_mf" | awk '{print $3}' | xargs -r docker rmi

echo "--------------------------------------"
echo "building and pushing the base images"
echo "--------------------------------------"

#         docker rmi $(docker images -q --filter=reference=709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_frontend)
#         docker rmi $(docker images -q --filter=reference=709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_thirdparty)
#         docker rmi $(docker images -q --filter=reference=709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_firstparty)
         cd docker/node_base && docker build --no-cache -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_node:latest
         -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_node:$(git show -s --format=%h) .
         docker push 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_node
         cd ../docker/base_mf_firstparty && docker build --no-cache -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_firstparty:latest -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_firstparty:$(git show -s --format=%h) .
         docker push 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_firstparty
         cd ../docker/base_mf_thirdparty && docker build --no-cache -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_thirdparty:latest -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_thirdparty:$(git show -s --format=%h) .
         docker push 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_thirdparty
         cd ../docker/base_mf_frontend && docker build --no-cache -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_frontend:latest -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_frontend:$(git show -s --format=%h) .
         docker push 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_frontend

echo "--------------------------------------"
echo "Build stage complete"
echo "--------------------------------------"
