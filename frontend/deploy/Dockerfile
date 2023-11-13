# syntax=docker/dockerfile:1

FROM --platform=linux/amd64 node:lts-slim
# must use PORT=8080 for gcloud run
ENV PORT 8080
EXPOSE 8080
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
RUN apt-get update
RUN apt-get -y install gcc wget git
COPY . /app/

CMD npx expo start --no-dev --minify --tunnel
