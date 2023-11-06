#!/bin/bash
set -ex

# initialize FLASK_PORT var
if [[ -z "${FLASK_PORT}" ]]; then
  export FLASK_PORT=5001
else
  export FLASK_PORT="${FLASK_PORT}"
fi

# initialize REACT_PORT var
if [[ -z "${REACT_PORT}" ]]; then
  export REACT_PORT=5002
else
  export REACT_PORT="${REACT_PORT}"
fi

# initialize HOSTNAME var
if [[ -z "${HOSTNAME}" ]]; then
  export HOSTNAME="localhost"
else
  export HOSTNAME="${HOSTNAME}"
fi

if [[ $2 = "flask-server" ]]; then
    SERVICE="flask-server"
elif [[ $2 = "react-app" ]]; then
    SERVICE="react-app"
else
    SERVICE=""
fi

if [[ $1 = "build" ]]; then
    docker compose build ${SERVICE}
elif [[ $1 = "up" ]]; then
    docker compose up ${SERVICE}
elif [[ $1 = "down" ]]; then
    docker compose down ${SERVICE}
fi
