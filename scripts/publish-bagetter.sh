#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="${ROOT_DIR}/artifacts/nuget"
SOURCE_URL="${BAGETTER_SOURCE_URL:-https://bagetter.dev-test.careerpath.ofoqh.com/v3/index.json}"
API_KEY="${BAGETTER_API_KEY:-}"

mkdir -p "${OUTPUT_DIR}"

dotnet pack "${ROOT_DIR}/dotnet/Ofoqh.Workflow.Diagnostics.sln" -c Release -o "${OUTPUT_DIR}"

find "${OUTPUT_DIR}" -maxdepth 1 -name '*.nupkg' ! -name '*.snupkg' -print0 | while IFS= read -r -d '' package; do
  dotnet nuget push "${package}" \
    --source "${SOURCE_URL}" \
    --api-key "${API_KEY}" \
    --skip-duplicate
done
