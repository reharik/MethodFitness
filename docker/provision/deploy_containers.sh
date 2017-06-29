#!/bin/bash

$(aws ecr get-login --region us-east-2)
printenv
sudo docker-compose -p methodfitness down --rmi local
sudo docker-compose -p methodfitness up -d