#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

usage() {
  cat <<'EOF'
Usage:
  bash ./scripts/build-verdaccio.sh [all|workflow-diagnostics|angular-tenant|ux ...]

Examples:
  bash ./scripts/build-verdaccio.sh
  bash ./scripts/build-verdaccio.sh ux
  bash ./scripts/build-verdaccio.sh workflow-diagnostics angular-tenant
EOF
}

declare -a targets=("$@")
if [[ ${#targets[@]} -eq 0 ]]; then
  targets=("all")
fi

build_workflow=false
build_angular_tenant=false
build_ux=false

for target in "${targets[@]}"; do
  case "${target}" in
    all)
      build_workflow=true
      build_angular_tenant=true
      build_ux=true
      ;;
    workflow-diagnostics)
      build_workflow=true
      ;;
    angular-tenant)
      build_angular_tenant=true
      ;;
    ux)
      build_ux=true
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      usage >&2
      echo >&2
      echo "[ERROR] Unknown build target: ${target}" >&2
      exit 1
      ;;
  esac
done

if [[ "${build_workflow}" == true ]]; then
  npm --prefix "${ROOT_DIR}" run build:ts
fi

if [[ "${build_angular_tenant}" == true ]]; then
  npm --prefix "${ROOT_DIR}" run build:angular-tenant
fi

if [[ "${build_ux}" == true ]]; then
  npm --prefix "${ROOT_DIR}" run build:ux
fi
