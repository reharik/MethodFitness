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
echo "running env_builder"
chmod a+x env_builder.sh
./env_builder.sh bamboo .envrc.example

cat ./.env

echo "Uploading artifacts"
scp docker-compose.yml $USERNAME@$TARGET:~/docker-compose.yml
scp .env $USERNAME@$TARGET:~/.env
scp deploy.sh $USERNAME@$TARGET:~/deploy.sh
ssh $USERNAME@$TARGET chmod a+x docker-compose.yml
ssh $USERNAME@$TARGET chmod a+x deploy.sh

echo "Deploying docker images"
ssh $USERNAME@$TARGET ./deploy.sh $AWS_PROFILE
