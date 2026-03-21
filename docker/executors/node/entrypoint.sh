#!/bin/bash
# Node.js Code Execution Entrypoint
# Security features:
# - Runs as non-root user (executor)
# - No network access (handled by Docker --network none)
# - Limited resources (256MB memory, 10s timeout)

set -e

# Configuration
readonly MAX_OUTPUT_SIZE=65536
readonly TIMEOUT=10

# Find JavaScript file
JS_FILE=$(find /app -name "*.js" -type f 2>/dev/null | head -1)

if [ -z "$JS_FILE" ]; then
    echo "Error: No JavaScript file found in /app" >&2
    exit 1
fi

# Execute with timeout and capture output
timeout --signal=KILL "$TIMEOUT" node "$JS_FILE" 2>&1 | \
    head -c "$MAX_OUTPUT_SIZE"

# Get exit code
EXIT_CODE=${PIPESTATUS[0]}

# Handle timeout (exit code 137 = killed by timeout)
if [ "$EXIT_CODE" -eq 137 ]; then
    echo "" >&2
    echo "Error: Execution timed out after ${TIMEOUT} seconds" >&2
    exit 137
fi

exit $EXIT_CODE
