#!/bin/bash

$(aws ecr get-login --region us-east-2)

cat ./.env
echo "--------------------------------------"
echo "Cleaning images on server"
echo "--------------------------------------"
docker rm -vf $(docker ps -a -q) 2>/dev/null || echo "No more containers to remove."
     docker images -q -f "label=methodfitness=child" | while read -r image; do docker rmi -f $image; done;
     docker images -q -f "label=methodfitness=base3" | while read -r image; do docker rmi -f $image; done;
     docker images -q -f "label=methodfitness=base2" | while read -r image; do docker rmi -f $image; done;
     docker images -q -f "label=methodfitness=base1" | while read -r image; do docker rmi -f $image; done;
echo "--------------------------------------"
echo "Building new containers"
echo "--------------------------------------"
echo docker-compose config

sudo docker-compose -p methodfitness up -d