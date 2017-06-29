#!/bin/bash


cat ./.env
echo cat ./.env
sudo docker run hello-world
sudo docker-compose -p methodfitness down --rmi local
sudo docker-compose -p methodfitness up -d