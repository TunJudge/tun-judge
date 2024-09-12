#!/bin/sh

FILE_PATH="$1"
shift
BIN_PATH="$1"

gcc -x c -Wall -O2 -static -pipe -std=gnu11 -o "$BIN_PATH" "$FILE_PATH" -lm

exit $?
