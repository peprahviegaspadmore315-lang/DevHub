#!/bin/bash
# Java Code Execution Entrypoint
# Security features:
# - Runs as non-root user (executor)
# - No network access (handled by Docker --network none)
# - Limited resources (256MB memory, 15s timeout)

set -e

# Configuration
readonly MAX_OUTPUT_SIZE=65536
readonly TIMEOUT=15

# Find Java file
JAVA_FILE=$(find /app -name "*.java" -type f 2>/dev/null | head -1)

if [ -z "$JAVA_FILE" ]; then
    echo "Error: No Java file found in /app" >&2
    exit 1
fi

# Extract class name from filename
CLASS_NAME=$(basename "$JAVA_FILE" .java)

# Compile the code
javac "$JAVA_FILE" 2>&1 || {
    echo "Compilation failed" >&2
    exit 1
}

# Execute with timeout and capture output
timeout --signal=KILL "$TIMEOUT" java -cp /app "$CLASS_NAME" 2>&1 | \
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
