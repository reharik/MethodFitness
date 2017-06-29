#!/bin/bash


cat ./.envrc
echo cat ./.envrc
docker run hello-world
docker-compose -p methodfitness down --rmi local
docker-compose -p methodfitness up -d