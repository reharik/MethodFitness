#!/bin/bash

# echo "Logging into the ECR"
$(aws ecr get-login --region us-east-2)

echo "Uploading artifacts"
scp -r ./deploy ubuntu@ec2-18-220-36-147.us-east-2.compute.amazonaws.com:~/
ssh ubuntu@ec2-18-220-36-147.us-east-2.compute.amazonaws.com chmod a+x docker-compose.yml
ssh ubuntu@ec2-18-220-36-147.us-east-2.compute.amazonaws.com chmod a+x deploy_containers.sh

echo "Deploying docker images"
ssh ubuntu@ec2-18-220-36-147.us-east-2.compute.amazonaws.com ./deploy_containers.sh
