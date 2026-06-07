#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="${ROOT_DIR}/artifacts/nuget"
SOURCE_URL="${BAGETTER_SOURCE_URL:-https://bagetter.dev-test.careerpath.ofoqh.com/v3/index.json}"
API_KEY="${BAGETTER_API_KEY:-}"

usage() {
  cat <<'EOF'
Usage:
  bash ./scripts/publish-bagetter.sh [all|workflow-diagnostics|workflow-diagnostics-aspnetcore ...]

Examples:
  bash ./scripts/publish-bagetter.sh
  bash ./scripts/publish-bagetter.sh workflow-diagnostics
  bash ./scripts/publish-bagetter.sh workflow-diagnostics-aspnetcore
  bash ./scripts/publish-bagetter.sh workflow-diagnostics workflow-diagnostics-aspnetcore
EOF
}

declare -a targets=("$@")
if [[ ${#targets[@]} -eq 0 ]]; then
  targets=("all")
fi

publish_workflow=false
publish_aspnetcore=false

for target in "${targets[@]}"; do
  case "${target}" in
    all)
      publish_workflow=true
      publish_aspnetcore=true
      ;;
    workflow-diagnostics)
      publish_workflow=true
      ;;
    workflow-diagnostics-aspnetcore)
      publish_aspnetcore=true
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

mkdir -p "${OUTPUT_DIR}"
rm -f "${OUTPUT_DIR}"/*.nupkg "${OUTPUT_DIR}"/*.snupkg 2>/dev/null || true

pack_and_push() {
  local project_path="$1"
  dotnet pack "${project_path}" -c Release -o "${OUTPUT_DIR}"
}

if [[ "${publish_workflow}" == true ]]; then
  pack_and_push "${ROOT_DIR}/dotnet/Ofoqh.Workflow.Diagnostics/Ofoqh.Workflow.Diagnostics.csproj"
fi

if [[ "${publish_aspnetcore}" == true ]]; then
  pack_and_push "${ROOT_DIR}/dotnet/Ofoqh.Workflow.Diagnostics.AspNetCore/Ofoqh.Workflow.Diagnostics.AspNetCore.csproj"
fi

find "${OUTPUT_DIR}" -maxdepth 1 -name '*.nupkg' ! -name '*.snupkg' -print0 | while IFS= read -r -d '' package; do
  dotnet nuget push "${package}" \
    --source "${SOURCE_URL}" \
    --api-key "${API_KEY}" \
    --skip-duplicate
done
