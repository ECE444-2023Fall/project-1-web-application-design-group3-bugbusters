#!/bin/bash
set -ex

if [[ -z "${PORT}" ]]; then
  export PORT=5001
else
  export PORT="${PORT}"
fi

if [[ $1 = "build" ]]; then
    docker compose build
elif [[ $1 = "up" ]]; then
    docker compose up
elif [[ $1 = "down" ]]; then
    docker compose down
fi
