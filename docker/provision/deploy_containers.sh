#!/bin/bash

$(aws ecr get-login --region us-east-2)

cat ./.env

 sudo docker rm -f $(docker ps -a -q) 2>/dev/null || echo "No more containers to remove."
 sudo docker rmi $(docker images -a) 2>/dev/null || echo "No more containers to remove."

sudo docker-compose -p methodfitness up -d