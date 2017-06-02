FROM methodfit_node:latest

MAINTAINER reharik@gmail.com

ADD ./package.json ./package.json

RUN yarn install

ADD ./app /$HOME/app
