#!/usr/bin/env bash
# Publish Firestore + Storage rules and apply Storage CORS for the media library.
#
# Requires: gcloud auth login (already done on this machine as travelwithvanes@gmail.com)
#
# Usage:
#   ./scripts/setup-firebase-media.sh [PROJECT_ID] [BUCKET]
#
# Defaults read from .env.local when args are omitted.

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ROOT}/.env.local"
export PATH="/opt/homebrew/bin:/opt/homebrew/share/google-cloud-sdk/bin:/usr/local/bin:$PATH"

PROJECT_ID="${1:-}"
BUCKET="${2:-}"

if [[ -z "$PROJECT_ID" && -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  set -a
  source "$ENV_FILE"
  set +a
  PROJECT_ID="${NEXT_PUBLIC_FIREBASE_PROJECT_ID:-}"
  BUCKET="${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:-}"
fi

PROJECT_ID="${PROJECT_ID:-travelwithvanessa-c6dba}"
BUCKET="${BUCKET:-travelwithvanessa-c6dba.firebasestorage.app}"

if [[ "$PROJECT_ID" == "your_project_id" ]]; then
  echo "Set real Firebase values in .env.local first." >&2
  exit 1
fi

if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null | grep -q .; then
  echo "Run: gcloud auth login" >&2
  exit 1
fi

echo "==> Project: ${PROJECT_ID}"
echo "==> Bucket:  ${BUCKET}"
gcloud config set project "$PROJECT_ID" >/dev/null

echo "==> Applying Storage CORS..."
"${ROOT}/scripts/apply-storage-cors.sh" "$PROJECT_ID" "$BUCKET"

echo "==> Publishing Firestore + Storage rules..."
python3 <<PY
import json, pathlib, subprocess, sys

project = "${PROJECT_ID}"
bucket = "${BUCKET}"
root = pathlib.Path("${ROOT}")
token = subprocess.check_output(["gcloud", "auth", "print-access-token"], text=True).strip()
headers = [
    "-H", f"Authorization: Bearer {token}",
    "-H", f"x-goog-user-project: {project}",
    "-H", "Content-Type: application/json",
]

def publish_rules(file_name: str, release_suffix: str):
    content = (root / file_name).read_text()
    body = json.dumps({"source": {"files": [{"name": file_name, "content": content}]}})
    create = subprocess.check_output([
        "curl", "-sS", "-X", "POST",
        f"https://firebaserules.googleapis.com/v1/projects/{project}/rulesets",
        *headers, "-d", body,
    ], text=True)
    data = json.loads(create)
    if "name" not in data:
        print(f"Failed to create ruleset for {file_name}:", data, file=sys.stderr)
        sys.exit(1)
    ruleset = data["name"]
    release_name = f"projects/{project}/releases/{release_suffix}"
    release_body = json.dumps({"release": {"name": release_name, "rulesetName": ruleset}})
    release = subprocess.check_output([
        "curl", "-sS", "-X", "PATCH",
        f"https://firebaserules.googleapis.com/v1/{release_name}",
        *headers, "-d", release_body,
    ], text=True)
    print(f"  {file_name} -> {json.loads(release).get('updateTime', release)}")

publish_rules("firestore.rules", "cloud.firestore")
storage_release = f"firebase.storage/{bucket}"
publish_rules("storage.rules", storage_release)
print("Rules published.")
PY

echo ""
echo "Done. Firebase is ready for the media library."
