FROM node:latest

MAINTAINER Raif Harik<reharik@gmail.com>
LABEL "methodfitness"="base1"
LABEL "name"="base_mf_node"

# Global install yarn package manager
RUN apt-get update && apt-get install vim -y

ENV HOME /home/current
RUN mkdir -p $HOME
WORKDIR $HOME
