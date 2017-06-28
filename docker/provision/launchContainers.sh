#!/bin/bash
AWS_PROFILE=$1

$(aws ecr get-login --profile $AWS_PROFILE --region us-east-1)
docker-compose -p methodfitness down --rmi local
docker-compose -p methodfitness up -d