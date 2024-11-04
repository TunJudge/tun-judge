ARG DEPENDENCIES_TAG

FROM ghcr.io/tunjudge/dependencies:$DEPENDENCIES_TAG

WORKDIR /usr/src/app

COPY --chown=node:node docker/server/start.sh ./start.sh
COPY --chown=node:node apps/server/package.json ./package.json
COPY --chown=node:node dist/apps/server ./server
COPY --chown=node:node dist/apps/client ./client
COPY --chown=node:node zenstack ./zenstack

RUN sed -i -E 's$\.\.\/apps\/client\/$./__ignore__/$g' ./zenstack/schema.zmodel
RUN yarn zenstack generate --schema=./zenstack/schema.zmodel

ENV ENVIRONMENT=production

EXPOSE 3000

USER node

ENTRYPOINT ["/usr/src/app/start.sh"]

HEALTHCHECK --interval=10s --timeout=5s --retries=10 CMD curl -f http://localhost:3000/status || exit 1
