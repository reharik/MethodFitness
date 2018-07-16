FROM 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_node

MAINTAINER reharik@gmail.com
LABEL "methodfitness"="base4"
LABEL "name"="base_mf_frontend"

ENV HOME /home/current
RUN mkdir -p $HOME
WORKDIR $HOME

ADD ./package.json ./package.json
RUN yarn
