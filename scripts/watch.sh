#!/usr/bin/env bash

FILES="content template.jade package.json"

inotifywait -qrm $FILES -e CLOSE_WRITE | while read change; do
  npm start
done
