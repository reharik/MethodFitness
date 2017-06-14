#FROM node:8.1
FROM kkarczmarczyk/node-yarn:latest

MAINTAINER reharik@gmail.com

ENV HOME /home/current
RUN mkdir -p $HOME
WORKDIR $HOME

ADD ./package.json ./package.json
#RUN npm install -q
RUN yarn

ADD ./app /$HOME/app
