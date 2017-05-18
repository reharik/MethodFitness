#!/bin/bash
AWS_PROFILE=$1
USERNAME=$2
TARGET=$3

die() { echo "$@" 1>&2 ; exit 1; }

echo "Uncompressing the artifacts file"
if [ -f "artifacts.tgz" ]; then
  tar xfvz artifacts.tgz
else
  die "artifacts file not found"
fi

cd artifacts/
echo "Uploading artifacts"
scp docker-compose.yml $USERNAME@$TARGET:~/docker-compose.yml
scp .envrc.example $USERNAME@$TARGET:~/.envrc.example
ssh $USERNAME@$TARGET chmod a+x docker-compose.yml

echo "Deploying docker images"
ssh $USERNAME@$TARGET $(aws ecr get-login --profile $AWS_PROFILE --region us-east-1) && docker-compose up -d
