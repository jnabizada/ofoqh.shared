#!/usr/bin/env bash
set -euo pipefail

REGISTRY_URL="${VERDACCIO_REGISTRY_URL:-https://verdaccio.dev-test.careerpath.ofoqh.com/}"

normalize_package_version() {
  local value="$1"
  local package_name="${value%@*}"
  local version="${value##*@}"

  if [[ -z "${package_name}" || -z "${version}" || "${package_name}" == "${value}" ]]; then
    echo >&2 "Expected an exact package version like @scope/name@1.2.3, got: ${value}"
    exit 1
  fi

  case "${package_name}" in
    ux)
      package_name="@ofoqh/ux"
      ;;
    angular-tenant)
      package_name="@ofoqh/angular-tenant"
      ;;
    workflow-diagnostics)
      package_name="@ofoqh/workflow-diagnostics"
      ;;
    @ofoqh/ux|@ofoqh/angular-tenant|@ofoqh/workflow-diagnostics)
      ;;
    *)
      echo >&2 "Unknown package alias/name: ${package_name}"
      exit 1
      ;;
  esac

  printf '%s@%s\n' "${package_name}" "${version}"
}

if [[ "$#" -lt 1 ]]; then
  cat <<'EOF'
Usage:
  bash ./scripts/unpublish-verdaccio.sh <package@version> [package@version...]

Examples:
  bash ./scripts/unpublish-verdaccio.sh @ofoqh/workflow-diagnostics@0.1.1
  bash ./scripts/unpublish-verdaccio.sh @ofoqh/angular-tenant@0.1.0 @ofoqh/ux@0.1.0
  bash ./scripts/unpublish-verdaccio.sh workflow-diagnostics@0.1.1 ux@0.1.0
EOF
  exit 1
fi

for package_version in "$@"; do
  package_version="$(normalize_package_version "${package_version}")"
  echo "Unpublishing ${package_version} from ${REGISTRY_URL}"
  npm unpublish "${package_version}" --registry "${REGISTRY_URL}"
done
