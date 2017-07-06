#!/bin/bash

$(aws ecr get-login --region us-east-2)

cat ./.env
echo "--------------------------------------"
echo "Cleaning images on server"
echo "--------------------------------------"
 sudo docker rm -vf $(docker ps -a -q) 2>/dev/null || echo "No more containers to remove."
 sudo docker images | grep "/methodfitness" | awk '{print $1 ":" $2}' | xargs docker rmi
echo "--------------------------------------"
echo "Building new containers"
echo "--------------------------------------"
echo docker-compose config

sudo docker-compose -p methodfitness up -d