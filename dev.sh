#!/bin/bash
set -ex

if [[ -z "${PORT}" ]]; then
  PORT=5001
else
  PORT="${PORT}"
fi

if [[ $1 = "build" ]]; then
    docker compose build
fi
