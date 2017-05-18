FROM methodfit_node:latest

MAINTAINER reharik@gmail.com

ADD ./package.json ./package.json
ADD ./yarn.lock ./yarn.lock
RUN yarn install

ADD ./config ./config
ADD ./app /$HOME/app
