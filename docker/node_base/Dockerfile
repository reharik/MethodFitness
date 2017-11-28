FROM node:latest

MAINTAINER Raif Harik<reharik@gmail.com>

# Global install yarn package manager
RUN apt-get update && apt-get install -y curl apt-transport-https && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install vim -y && \
    apt-get install yarn -y

ENV HOME /home/current
RUN mkdir -p $HOME
WORKDIR $HOME
