FROM ubuntu:14.04

RUN apt-get update
RUN sudo apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
RUN apt-get install -y nodejs

COPY . /app/analytics-cli

WORKDIR /app/analytics-cli
RUN npm install -g db-migrate
RUN npm install -g nodemon
RUN npm install cross-env
RUN npm install

CMD ["node", "server"]
