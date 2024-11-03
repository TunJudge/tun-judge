FROM node:22-alpine as dependencies-stage

WORKDIR /dependencies
COPY package.json .yarnrc.yml yarn.lock ./
ADD .yarn ./.yarn
RUN yarn workspaces focus --production

FROM node:22-alpine as final-stage

RUN apk add --update curl && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

USER node

COPY --chown=node:node --from=dependencies-stage /dependencies/node_modules ./node_modules
