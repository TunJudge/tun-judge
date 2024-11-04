#!/bin/sh

yarn prisma generate || exit 1

node judge/main.js
