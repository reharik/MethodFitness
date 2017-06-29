#!/bin/bash

# echo "Logging into the ECR"
$(aws ecr get-login --region us-east-2)

echo "Uploading artifacts"
scp docker-compose-deploy.yml ubuntu@ec2-18-220-36-147.us-east-2.compute.amazonaws.com:~/docker-compose.yml
scp .env ubuntu@ec2-18-220-36-147.us-east-2.compute.amazonaws.com:~/.env
scp deploy.sh ubuntu@ec2-18-220-36-147.us-east-2.compute.amazonaws.com:~/deploy_containers.sh
ssh ubuntu@ec2-18-220-36-147.us-east-2.compute.amazonaws.com chmod a+x docker-compose.yml
ssh ubuntu@ec2-18-220-36-147.us-east-2.compute.amazonaws.com chmod a+x deploy_containers.sh

echo "Deploying docker images"
ssh ubuntu@ec2-18-220-36-147.us-east-2.compute.amazonaws.com ./deploy_containers.sh

