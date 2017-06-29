#!/bin/bash

#$(aws ecr get-login --region us-east-2)

cat ./.envrc
docker run hello-world
docker-compose -p methodfitness down --rmi local
docker-compose -p methodfitness up -d