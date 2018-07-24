FROM 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_cypress:latest

MAINTAINER reharik@gmail.com
LABEL "methodfitness"="child"
LABEL "name"="cypress"

ADD ./package.json ./package.json
ADD ./cypress-docker.json ./cypress.json
ADD ./app /$HOME/app
