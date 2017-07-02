#FROM node:8.1
FROM 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_frontend:latest
MAINTAINER reharik@gmail.com

ADD ./package.json ./package.json


RUN yarn

ADD ./app /$HOME/app
