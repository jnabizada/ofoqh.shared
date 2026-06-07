#!/usr/bin/env bash
set -euo pipefail

REGISTRY_URL="${VERDACCIO_REGISTRY_URL:-https://verdaccio.dev-test.careerpath.ofoqh.com/}"

if [[ "$#" -lt 1 ]]; then
  cat <<'EOF'
Usage:
  bash ./scripts/unpublish-verdaccio.sh <package@version> [package@version...]

Examples:
  bash ./scripts/unpublish-verdaccio.sh @ofoqh/workflow-diagnostics@0.1.1
  bash ./scripts/unpublish-verdaccio.sh @ofoqh/angular-tenant@0.1.0 @ofoqh/ux@0.1.0
EOF
  exit 1
fi

for package_version in "$@"; do
  package_name="${package_version%@*}"
  version="${package_version##*@}"

  if [[ -z "${package_name}" || -z "${version}" || "${package_name}" == "${package_version}" ]]; then
    echo "Expected an exact package version like @scope/name@1.2.3, got: ${package_version}" >&2
    exit 1
  fi

  echo "Unpublishing ${package_version} from ${REGISTRY_URL}"
  npm unpublish "${package_version}" --registry "${REGISTRY_URL}"
done
