# We are basing our container on Ubuntu Linux 14.04
FROM ubuntu:latest

# Installing node from node imageexir
FROM node:6.11.1

MAINTAINER Rishabh Jain "rj81309050@gmail.com"

# Setting the Right timezone
ENV TZ=Asia/Kolkata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Installing Mongo on Ubuntu

# Importing the public key used by the package management system
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927

# Reload the local package database
RUN apt-get update

# Installing VIM
RUN apt-get install -y vim

# Install the mongodb package
RUN apt-get install -y mongodb

# Creating log and db folders for mongodb
RUN mkdir /data
RUN mkdir /data/db
RUN mkdir /data/db/log

# Installing Forever
RUN npm install forever -g

# Adding server code to source area
COPY ./server /vstore/server/

# Installing server dependencies
RUN cd /vstore/server/; npm install

# Installing angular cli
RUN npm install -g @angular/cli

# Adding client code to source area
COPY ./client /vstore/client/

# Installing client dependencies
RUN cd /vstore/client/; npm install

# PORT 8080 for server
EXPOSE 8080

# PORT 4200 for client
EXPOSE 4200

# Adding Start script
COPY ./startDocker.sh /vstore/

# Making Start script executable
RUN chmod u+x /vstore/startDocker.sh

# Startup Command
CMD ./vstore/startDocker.sh



