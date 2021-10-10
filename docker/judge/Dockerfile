FROM node:14.18.0-alpine as build-stage

RUN apk add python3 gcc g++ make cmake

WORKDIR /judge
COPY projects/judge .
RUN yarn
RUN yarn build
RUN yarn --prod

FROM node:14.18.0-alpine as final-stage

WORKDIR /judge
COPY --from=build-stage /judge/node_modules ./node_modules
COPY --from=build-stage /judge/nest-cli.json ./nest-cli.json
COPY --from=build-stage /judge/package.json ./package.json
COPY --from=build-stage /judge/assets ./assets
COPY --from=build-stage /judge/dist ./dist

CMD yarn start:prod
