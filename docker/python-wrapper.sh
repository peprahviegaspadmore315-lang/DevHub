#!/bin/bash
# Python Code Execution Wrapper
# Security: Runs in isolated container with no network access

set -e

# Configuration
MAX_OUTPUT_SIZE=65536
TIMEOUT=10

# Find the main Python file
CODE_FILE=$(find /app -name "*.py" -type f 2>/dev/null | head -1)

if [ -z "$CODE_FILE" ]; then
    echo "Error: No Python file found"
    exit 1
fi

# Execute with timeout and output limits
timeout $TIMEOUT python3 "$CODE_FILE" 2>&1 | head -c $MAX_OUTPUT_SIZE

exit ${PIPESTATUS[0]}
