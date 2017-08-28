FROM 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_thirdparty

MAINTAINER reharik@gmail.com

ENV HOME /home/current
RUN mkdir -p $HOME
WORKDIR $HOME

ADD ./package.json ./package.json
RUN yarn
