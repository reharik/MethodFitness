FROM methodfit_node:latest

MAINTAINER reharik@gmail.com

ADD ./package.json ./package.json
#ADD ./config ./config

ADD ./yarn.lock ./yarn.lock
RUN yarn install

ADD ./app /$HOME/app
