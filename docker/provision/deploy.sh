#!/bin/bash

# echo "Logging into the ECR"
$(aws ecr get-login --region us-east-2)

echo "--------------------------------------"
echo "Pushing compose file to server"
echo "--------------------------------------"

echo "--------------------------------------"
echo "scp"
echo "--------------------------------------"
scp -o "StrictHostKeyChecking=no" -r ./deploy/. ubuntu@ec2-18-220-170-213.us-east-2.compute.amazonaws.com:~/
echo "--------------------------------------"
echo "chmod on docker-compose"
echo "--------------------------------------"
ssh ubuntu@ec2-18-220-36-147.us-east-2.compute.amazonaws.com chmod a+x docker-compose.yml
echo "--------------------------------------"
echo "chmod on deploy_container"
echo "--------------------------------------"
ssh ubuntu@ec2-18-220-36-147.us-east-2.compute.amazonaws.com chmod a+x deploy_containers.sh

echo "--------------------------------------"
echo "Running the compose file on server"
echo "--------------------------------------"
ssh ubuntu@ec2-18-220-36-147.us-east-2.compute.amazonaws.com ./deploy_containers.sh
