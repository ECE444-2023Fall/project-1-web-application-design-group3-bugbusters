# syntax=docker/dockerfile:1

FROM node:lts-slim
EXPOSE 8081 8082 8083
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
RUN apt-get update
RUN apt-get -y install gcc wget
COPY . /app/
CMD npm start
