# syntax=docker/dockerfile:1

FROM python:3.9-slim
WORKDIR /app
COPY pyproject.toml /app/pyproject.toml
RUN apt-get update
RUN apt-get -y install gcc wget
COPY . /app
RUN pip3 install -e '.[dev]'
CMD ["flask", "--app", "flask_server", "run", "--debug", "-p", "5001", "--host", "0.0.0.0"]
