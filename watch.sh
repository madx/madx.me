#!/bin/bash
inotifywait -rm src/ static/ Rakefile templates -e CLOSE_WRITE |
  while read line; do
    bundle exec rake
  done
