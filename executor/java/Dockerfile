FROM eclipse-temurin:17-jdk-alpine

RUN addgroup -S executor && adduser -S executor -G executor

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER executor
WORKDIR /workspace

ENTRYPOINT ["/entrypoint.sh"]
