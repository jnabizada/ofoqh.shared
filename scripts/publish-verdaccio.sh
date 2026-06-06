#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REGISTRY_URL="${VERDACCIO_REGISTRY_URL:-https://verdaccio.dev-test.careerpath.ofoqh.com/}"
WORKFLOW_PACKAGE_DIR="${ROOT_DIR}/npm/workflow-diagnostics"
ANGULAR_TENANT_DIST_DIR="${ROOT_DIR}/dist/angular-tenant"
UX_DIST_DIR="${ROOT_DIR}/dist/ofoqh-ux"

npm --prefix "${ROOT_DIR}" install
npm --prefix "${ROOT_DIR}" run build:ts
npm --prefix "${ROOT_DIR}" run build:angular-tenant
npm --prefix "${ROOT_DIR}" run build:ux
(
  cd "${WORKFLOW_PACKAGE_DIR}"
  npm publish --registry "${REGISTRY_URL}"
)
(
  cd "${ANGULAR_TENANT_DIST_DIR}"
  npm publish --registry "${REGISTRY_URL}"
)
(
  cd "${UX_DIST_DIR}"
  npm publish --registry "${REGISTRY_URL}"
)
