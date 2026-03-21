#!/bin/sh
set -euo pipefail

ulimit -c 0
ulimit -v 262144
ulimit -t 10
ulimit -u 50

unset LD_PRELOAD
unset LD_LIBRARY_PATH

MAX_OUTPUT_SIZE=${MAX_OUTPUT_SIZE:-65536}

read -r CODE

if [ -z "$CODE" ]; then
    echo "Error: No code provided" >&2
    exit 1
fi

TEMP_FILE=$(mktemp /tmp/exec_XXXXXX.js)
trap 'rm -f "$TEMP_FILE"' EXIT

echo "$CODE" > "$TEMP_FILE"

timeout 10 node "$TEMP_FILE" 2>&1 | head -c "$MAX_OUTPUT_SIZE"
