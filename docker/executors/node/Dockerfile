# ============================================
# Node.js Code Executor
# ============================================
# Lightweight, secure JavaScript execution environment
FROM node:20-alpine

# Install timeout utility (Alpine uses busybox)
RUN apk add --no-cache bash coreutils

# Create non-root user for security
RUN addgroup -S executor && \
    adduser -S executor -G executor -s /bin/false

# Set working directory
WORKDIR /app

# Copy and set permissions for wrapper script
COPY entrypoint.sh /usr/local/bin/
RUN chmod 755 /usr/local/bin/entrypoint.sh

# Drop privileges
USER executor

# Wrapper script handles execution
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
