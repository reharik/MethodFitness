#!/bin/bash

###########################################
#
# This script is used to dynamically build an .env file
# ./build.sh <type> <key file> <path to place .env file>
#  type = local | bamboo
#  key file = path to key file
#  path to the .env = only required for local
#
###########################################

TYPE="$1"
KEY_FILE="$2"
PATH="$3"

die() { echo "$@" 1>&2 ; exit 1; }

########## Get the Keys
KEY=()
if [ -f "$KEY_FILE" ]; then
  for line in $(<$KEY_FILE)
  do
    if [ ! -z $line ]; then
      IFS='=' read -r -a array <<< "$line"
      KEY+=("${array[0]}")
    fi
  done < "$KEY_FILE"
else
  die "$KEY_FILE not found"
fi

########## DO THE MAGIC

########## For Cloud Deployments
if [ $TYPE == "bamboo" ]; then
  echo "Appending .env file with application environment variables..."
  ENV_FILE=".env"
  for COUNTER in "${!KEY[@]}"; do
    BAMBOO_VAR_NAME="\$bamboo_${KEY[$COUNTER]}"
    echo $BAMBOO_VAR_NAME
    eval BAMBOO_VAR=${BAMBOO_VAR_NAME}
    if [ -n "$BAMBOO_VAR" ]; then
      echo "${KEY[$COUNTER]}=$BAMBOO_VAR" >> $ENV_FILE
    else
      die "$BAMBOO_VAR_NAME does not exist!  Please update Bamboo environment variables"
    fi
  done
fi