#!/bin/bash
inotifywait -rm src/ media/ Rakefile templates meta.yml -e CLOSE_WRITE |
  while read line; do
    bundle exec rake
  done
