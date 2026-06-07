#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REGISTRY_URL="${VERDACCIO_REGISTRY_URL:-https://verdaccio.dev-test.careerpath.ofoqh.com/}"
WORKFLOW_PACKAGE_DIR="${ROOT_DIR}/npm/workflow-diagnostics"
ANGULAR_TENANT_DIST_DIR="${ROOT_DIR}/dist/angular-tenant"
UX_DIST_DIR="${ROOT_DIR}/dist/ofoqh-ux"
VERIFY_DIST_SCRIPT="${ROOT_DIR}/scripts/verify-dist-package.sh"

usage() {
  cat <<'EOF'
Usage:
  bash ./scripts/publish-verdaccio.sh [all|workflow-diagnostics|angular-tenant|ux ...]

Examples:
  bash ./scripts/publish-verdaccio.sh
  bash ./scripts/publish-verdaccio.sh ux
  bash ./scripts/publish-verdaccio.sh workflow-diagnostics angular-tenant
EOF
}

declare -a targets=("$@")
if [[ ${#targets[@]} -eq 0 ]]; then
  targets=("all")
fi

publish_workflow=false
publish_angular_tenant=false
publish_ux=false

for target in "${targets[@]}"; do
  case "${target}" in
    all)
      publish_workflow=true
      publish_angular_tenant=true
      publish_ux=true
      ;;
    workflow-diagnostics)
      publish_workflow=true
      ;;
    angular-tenant)
      publish_angular_tenant=true
      ;;
    ux)
      publish_ux=true
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      usage >&2
      echo >&2
      echo "[ERROR] Unknown publish target: ${target}" >&2
      exit 1
      ;;
  esac
done

npm --prefix "${ROOT_DIR}" install
chmod +x "${VERIFY_DIST_SCRIPT}"

if [[ "${publish_workflow}" == true ]]; then
  npm --prefix "${ROOT_DIR}" run build:ts
  (
    cd "${WORKFLOW_PACKAGE_DIR}"
    npm publish --registry "${REGISTRY_URL}"
  )
fi

if [[ "${publish_angular_tenant}" == true ]]; then
  npm --prefix "${ROOT_DIR}" run build:angular-tenant
  "${VERIFY_DIST_SCRIPT}" "${ANGULAR_TENANT_DIST_DIR}"
  (
    cd "${ANGULAR_TENANT_DIST_DIR}"
    npm publish --registry "${REGISTRY_URL}"
  )
fi

if [[ "${publish_ux}" == true ]]; then
  npm --prefix "${ROOT_DIR}" run build:ux
  "${VERIFY_DIST_SCRIPT}" "${UX_DIST_DIR}"
  (
    cd "${UX_DIST_DIR}"
    npm publish --registry "${REGISTRY_URL}"
  )
fi
