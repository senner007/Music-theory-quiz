#!/bin/bash
#requires ffmpeg
filter=".*$";

for file in ./res/notes/*.mp3
do
    filename=$(basename -- "$file")
    out=$(basename -- "$file")
    echo "$file"
    # out="${file##*.}"
    ffmpeg -ss 0 -t 5 -i $file -acodec copy "./res/ncrop/$(basename -- "$file")"
done