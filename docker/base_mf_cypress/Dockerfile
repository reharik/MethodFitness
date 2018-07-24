FROM 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_node

MAINTAINER reharik@gmail.com
LABEL "methodfitness"="base5"
LABEL "name"="base_mf_cypress"

ENV npm_config_loglevel=warn

RUN apt-get update && \
    apt-get install -y \
    libgtk2.0-0 \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    xvfb \
    jq \
    zip \
    wget

RUN \
  wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
  echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list && \
  apt-get update && \
  apt-get install -y dbus-x11 google-chrome-stable && \
  rm -rf /var/lib/apt/lists/*

# "fake" dbus address to prevent errors
# https://github.com/SeleniumHQ/docker-selenium/issues/87
ENV DBUS_SESSION_BUS_ADDRESS=/dev/null

# a few environment variables to make NPM installs easier
# good colors for most applications
ENV TERM xterm
# avoid million NPM install messages
ENV npm_config_loglevel warn
# allow installing when the main user is root
ENV npm_config_unsafe_perm true

RUN yarn global add cypress
RUN npx cypress version

CMD ["node", "--version"]

ENV HOME /home/current
RUN mkdir -p $HOME
WORKDIR $HOME
