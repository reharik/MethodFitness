#!/bin/bash

$(aws ecr get-login --region us-east-2)
docker-compose -p methodfitness down --rmi local
docker-compose -p methodfitness up -d