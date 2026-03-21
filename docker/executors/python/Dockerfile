# ============================================
# Python Code Executor
# ============================================
# Lightweight, secure Python execution environment
FROM python:3.11-slim

# Install only what's needed
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    coreutils \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd -r executor && \
    useradd -r -m -g executor -s /bin/false executor

# Set working directory
WORKDIR /app

# Copy and set permissions for wrapper script
COPY entrypoint.sh /usr/local/bin/
RUN chmod 755 /usr/local/bin/entrypoint.sh

# Drop privileges
USER executor

# Wrapper script handles execution
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
