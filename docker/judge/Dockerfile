ARG DEPENDENCIES_TAG

FROM ghcr.io/tunjudge/dependencies:$DEPENDENCIES_TAG

WORKDIR /usr/src/app

COPY --chown=node:node docker/judge/start.sh ./start.sh
COPY --chown=node:node apps/judge/package.json ./package.json
COPY --chown=node:node dist/apps/judge ./judge
COPY --chown=node:node zenstack ./zenstack

RUN sed -i -E 's$\.\.\/apps\/client\/$./__ignore__/$g' ./zenstack/schema.zmodel
RUN yarn zenstack generate --schema=./zenstack/schema.zmodel

ENV ENVIRONMENT=production

EXPOSE 3000

USER node

ENTRYPOINT ["/usr/src/app/start.sh"]

HEALTHCHECK --interval=10s --timeout=5s --retries=10 CMD curl -f http://localhost:3000/status || exit 1
