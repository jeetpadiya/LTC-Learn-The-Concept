#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CMAKE_BIN="${SCRIPT_DIR}/../.tools/cmake/bin/cmake"

if [ -f "$CMAKE_BIN" ]; then
    CMAKE_CMD="$CMAKE_BIN"
elif command -v cmake &> /dev/null; then
    CMAKE_CMD="cmake"
else
    echo "Error: cmake not found"
    exit 1
fi

echo "==> Configuring LTC Backend with CMake..."
"$CMAKE_CMD" -B "${SCRIPT_DIR}/build" -S "${SCRIPT_DIR}"

echo "==> Building ltc_server..."
make -C "${SCRIPT_DIR}/build" -j"$(nproc 2>/dev/null || echo 2)"

echo "==> Build complete! Executable is at ${SCRIPT_DIR}/build/ltc_server"
