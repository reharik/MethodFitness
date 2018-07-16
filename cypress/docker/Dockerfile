#FROM node:8.1
FROM Cypress.base
MAINTAINER reharik@gmail.com
LABEL "methodfitness"="child"

ADD ./package.json ./package.json

RUN yarn

ADD ./app /$HOME/app
