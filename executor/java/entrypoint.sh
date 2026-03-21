#!/bin/sh
set -euo pipefail

ulimit -c 0
ulimit -v 262144
ulimit -t 15
ulimit -u 50

unset LD_PRELOAD
unset LD_LIBRARY_PATH

MAX_OUTPUT_SIZE=${MAX_OUTPUT_SIZE:-65536}

read -r CODE

if [ -z "$CODE" ]; then
    echo "Error: No code provided" >&2
    exit 1
fi

TEMP_FILE=$(mktemp /tmp/exec_XXXXXX.java)
trap 'rm -f "$TEMP_FILE"' EXIT

CLASS_NAME=$(echo "$CODE" | grep -oP 'public\s+class\s+\K[A-Za-z_][A-Za-z0-9_]*' || echo "Main")

if [ -z "$CLASS_NAME" ]; then
    CLASS_NAME="Main"
fi

echo "$CODE" > "${TEMP_FILE}"

javac "$TEMP_FILE" 2>&1 | head -c "$MAX_OUTPUT_SIZE"

if [ -f "${TEMP_FILE%.java}.class" ]; then
    timeout 15 java -cp "$(dirname "$TEMP_FILE")" "$CLASS_NAME" 2>&1 | head -c "$MAX_OUTPUT_SIZE"
fi
