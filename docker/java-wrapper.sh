#!/bin/bash
# Java Code Execution Wrapper
# Security: Runs in isolated container with no network access

set -e

# Configuration
MAX_OUTPUT_SIZE=65536
TIMEOUT=15

# Find the main Java file
JAVA_FILE=$(find /app -name "*.java" -type f 2>/dev/null | head -1)

if [ -z "$JAVA_FILE" ]; then
    echo "Error: No Java file found"
    exit 1
fi

# Extract class name from file
CLASS_NAME=$(basename "$JAVA_FILE" .java)

# Compile with error output
javac "$JAVA_FILE" 2>&1 || {
    echo "Compilation failed"
    exit 1
}

# Execute with timeout and output limits
timeout $TIMEOUT java -cp /app "$CLASS_NAME" 2>&1 | head -c $MAX_OUTPUT_SIZE

exit ${PIPESTATUS[0]}
