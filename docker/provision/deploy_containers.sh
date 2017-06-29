#!/bin/bash

$(aws ecr get-login --region us-east-2)

cat ./envrc.qa >> ./.env

cat ./.env

sudo docker-compose -p methodfitness down --rmi local
sudo docker-compose -p methodfitness up -d