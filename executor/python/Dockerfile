FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m -s /bin/bash executor && \
    chown -R executor:executor /home/executor

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER executor
WORKDIR /workspace

ENTRYPOINT ["/entrypoint.sh"]
