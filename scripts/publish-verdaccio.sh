#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REGISTRY_URL="${VERDACCIO_REGISTRY_URL:-https://verdaccio.dev-test.careerpath.ofoqh.com/}"
PACKAGE_DIR="${ROOT_DIR}/npm/workflow-diagnostics"

npm --prefix "${ROOT_DIR}" install
npm --prefix "${ROOT_DIR}" run build:ts
(
  cd "${PACKAGE_DIR}"
  npm publish --registry "${REGISTRY_URL}"
)
