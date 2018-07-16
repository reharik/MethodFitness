FROM 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_thirdparty

MAINTAINER reharik@gmail.com
LABEL "methodfitness"="base3"
LABEL "name"="base_mf_firstparty"

ENV HOME /home/current
RUN mkdir -p $HOME
WORKDIR $HOME

ADD ./package.json ./package.json
RUN yarn
