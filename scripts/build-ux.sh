#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

usage() {
  cat <<'EOF'
Usage:
  bash ./scripts/build-ux.sh

Builds the @ofoqh/ux Angular package into:
  ./dist/ofoqh-ux
EOF
}

case "${1:-}" in
  -h|--help)
    usage
    exit 0
    ;;
esac

npm --prefix "${ROOT_DIR}" run build:ux
