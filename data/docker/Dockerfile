FROM methodfit_node:latest

MAINTAINER reharik@gmail.com

ADD ./package.json ./package.json
ADD ./yarn.lock ./yarn.lock
RUN yarn --pure-lockfile

ADD ./config ./config
ADD ./app /$HOME/app
