# syntax=docker/dockerfile:1

FROM node:lts-slim
ARG PORT
ENV PORT ${PORT}
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
RUN apt-get update
RUN apt-get -y install gcc wget git
COPY . /app/

CMD /bin/bash
# CMD npx expo start --web --port=${PORT} --tunnel
