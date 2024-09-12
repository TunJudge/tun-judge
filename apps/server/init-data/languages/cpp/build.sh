#!/bin/sh

FILE_PATH="$1"
shift
BIN_PATH="$1"

g++ -x c++ -Wall -O2 -static -pipe -std=gnu++14 -o "$BIN_PATH" "$FILE_PATH"

exit $?
