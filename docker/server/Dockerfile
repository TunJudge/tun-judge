FROM node:14.21.3-alpine as build-stage

WORKDIR /client
COPY projects/client .
RUN yarn
RUN yarn build

WORKDIR /docs
COPY docs .
RUN yarn
RUN FOR_SERVER=true yarn build

WORKDIR /server
COPY projects/server .
RUN yarn
RUN yarn build
RUN yarn --prod

FROM node:14.21.3-alpine as final-stage

WORKDIR /server
COPY --from=build-stage /server/node_modules ./node_modules
COPY --from=build-stage /server/nest-cli.json ./nest-cli.json
COPY --from=build-stage /server/package.json ./package.json
COPY --from=build-stage /server/init-data ./init-data
COPY --from=build-stage /client/build ./client
COPY --from=build-stage /docs/build ./docs
COPY --from=build-stage /server/dist ./dist

EXPOSE 3000

CMD yarn start:prod
