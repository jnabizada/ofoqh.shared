#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "usage: $0 <dist-package-dir>" >&2
  exit 1
fi

PACKAGE_DIR="$1"
PACKAGE_JSON="${PACKAGE_DIR}/package.json"

fail() {
  echo "[ERROR] $*" >&2
  exit 1
}

[[ -d "${PACKAGE_DIR}" ]] || fail "Package directory not found: ${PACKAGE_DIR}"
[[ -f "${PACKAGE_JSON}" ]] || fail "package.json not found: ${PACKAGE_JSON}"

package_name="$(node -p "require(process.argv[1]).name" "${PACKAGE_JSON}")"
package_version="$(node -p "require(process.argv[1]).version" "${PACKAGE_JSON}")"
package_module="$(node -p "require(process.argv[1]).module || ''" "${PACKAGE_JSON}")"
package_typings="$(node -p "require(process.argv[1]).typings || ''" "${PACKAGE_JSON}")"
package_type="$(node -p "require(process.argv[1]).type || ''" "${PACKAGE_JSON}")"
exports_dot_types="$(node -p "const pkg=require(process.argv[1]); const dot=pkg.exports && pkg.exports['.']; console.log((dot && dot.types) || '')" "${PACKAGE_JSON}")"
exports_dot_default="$(node -p "const pkg=require(process.argv[1]); const dot=pkg.exports && pkg.exports['.']; console.log((dot && dot.default) || '')" "${PACKAGE_JSON}")"

[[ -n "${package_module}" ]] || fail "${package_name}@${package_version} is missing package.json#module"
[[ -n "${package_typings}" ]] || fail "${package_name}@${package_version} is missing package.json#typings"
[[ "${package_type}" == "module" ]] || fail "${package_name}@${package_version} must declare type=module"
[[ -n "${exports_dot_types}" ]] || fail "${package_name}@${package_version} is missing exports['.'].types"
[[ -n "${exports_dot_default}" ]] || fail "${package_name}@${package_version} is missing exports['.'].default"

[[ -d "${PACKAGE_DIR}/fesm2022" ]] || fail "${package_name}@${package_version} is missing fesm2022/"
[[ -d "${PACKAGE_DIR}/types" ]] || fail "${package_name}@${package_version} is missing types/"
[[ -f "${PACKAGE_DIR}/${package_module}" ]] || fail "${package_name}@${package_version} is missing ${package_module}"
[[ -f "${PACKAGE_DIR}/${package_typings}" ]] || fail "${package_name}@${package_version} is missing ${package_typings}"

echo "[OK] Verified ${package_name}@${package_version} in ${PACKAGE_DIR}"
