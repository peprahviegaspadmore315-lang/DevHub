FROM node:20-alpine

RUN adduser -D -s /bin/sh executor

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER executor
WORKDIR /workspace

ENTRYPOINT ["/entrypoint.sh"]
