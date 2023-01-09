#!/bin/bash

search_dir=./src/interfaces
for entry in "$search_dir"/*
do
  { echo '// @ts-ignore'; cat $entry; } > "$entry.new"
  mv $entry{.new,}
done
