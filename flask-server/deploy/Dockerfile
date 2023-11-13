# syntax=docker/dockerfile:1

FROM --platform=linux/amd64 python:3.9-slim
# must use PORT=8080 for gcloud run
ENV PORT 8080
WORKDIR /app
COPY pyproject.toml /app/pyproject.toml
RUN apt-get update
RUN apt-get -y install gcc wget git
COPY . /app
RUN pip3 install -e '.[dev]'

CMD exec gunicorn --bind :$PORT -w 1 -t 8 "flask_server:create_app()"
