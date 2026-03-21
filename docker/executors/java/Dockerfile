# ============================================
# Java Code Executor
# ============================================
# Lightweight, secure Java execution environment
FROM eclipse-temurin:17-jre-alpine

# Install build tools for compilation
RUN apk add --no-cache bash coreutils openjdk17-jdk

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

# Wrapper script handles compilation and execution
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
