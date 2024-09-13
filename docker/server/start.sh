#!/bin/sh

yarn prisma migrate deploy --schema ./zenstack/prisma/schema.prisma || exit 1

node server/main.js
