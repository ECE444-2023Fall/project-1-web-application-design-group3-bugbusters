# syntax=docker/dockerfile:1

FROM node:lts-slim
ARG PORT
ENV PORT ${PORT}
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
RUN apt-get update
RUN apt-get -y install gcc wget
COPY . /app/

CMD npx expo start --web --port=${PORT} --tunnel
