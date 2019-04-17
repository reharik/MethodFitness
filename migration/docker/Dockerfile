#FROM node:8.1
FROM 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_firstparty:latest

MAINTAINER reharik@gmail.com
LABEL "methodfitness"="child"
LABEL "name"="migration"

ADD ./package.json ./package.json
ADD ./ecosystem.config.js ./ecosystem.config.js
#RUN npm install -q
RUN yarn

ADD ./app /$HOME/app
