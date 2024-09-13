#!/bin/sh

SOURCE_FILE="$1"; shift
BIN_FILE="$1"; shift

g++ "$SOURCE_FILE" -o "$BIN_FILE"
