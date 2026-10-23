#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN="${SCRIPT_DIR}/build/ltc_server"

if [ ! -f "$BIN" ]; then
    echo "Binary not found, running build.sh first..."
    "${SCRIPT_DIR}/build.sh"
fi

PORT="${1:-18080}"
echo "==> Launching LTC (Learn The Concept) Server on port ${PORT}..."
exec "$BIN" "$PORT"
