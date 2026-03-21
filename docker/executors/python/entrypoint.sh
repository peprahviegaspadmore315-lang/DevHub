#!/bin/bash
# Python Code Execution Entrypoint
# Security features:
# - Runs as non-root user (executor)
# - No network access (handled by Docker --network none)
# - Limited resources (256MB memory, 10s timeout)

set -e

# Configuration
readonly MAX_OUTPUT_SIZE=65536
readonly TIMEOUT=10

# Find Python file
PYTHON_FILE=$(find /app -name "*.py" -type f 2>/dev/null | head -1)

if [ -z "$PYTHON_FILE" ]; then
    echo "Error: No Python file found in /app" >&2
    exit 1
fi

# Execute with timeout and capture output
# Uses timeout command for time limit
timeout --signal=KILL "$TIMEOUT" python3 "$PYTHON_FILE" 2>&1 | \
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
