#!/bin/bash


cat ./.envrc
echo cat ./.envrc
sudo docker run hello-world
sudo docker-compose -p methodfitness down --rmi local
sudo docker-compose -p methodfitness up -d