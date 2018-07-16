#FROM node:8.1
FROM 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_firstparty:latest

MAINTAINER reharik@gmail.com
LABEL "methodfitness"="child"
LABEL "name"="frontend"

ADD ./package.json ./package.json
#RUN npm install -q
RUN yarn

ADD ./app /$HOME/app
