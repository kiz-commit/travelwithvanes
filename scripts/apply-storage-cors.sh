#!/usr/bin/env bash
# Apply CORS to Firebase’s default GCS bucket so browser uploads work from your live site.
# Usage:
#   1) gcloud auth login
#   2) ./scripts/apply-storage-cors.sh [PROJECT_ID] [BUCKET]
#
# If you omit BUCKET, this lists buckets in the project so you can copy the exact name
# (often PROJECT_ID.firebasestorage.app or PROJECT_ID.appspot.com).

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="/opt/homebrew/bin:/opt/homebrew/share/google-cloud-sdk/bin:/usr/local/bin:$PATH"
CORS_FILE="${ROOT}/storage-cors.json"

if [[ ! -f "$CORS_FILE" ]]; then
  echo "Missing ${CORS_FILE}" >&2
  exit 1
fi

PROJECT_ID="${1:-}"
BUCKET="${2:-}"

if ! command -v gcloud &>/dev/null; then
  echo "Install Google Cloud SDK: brew install --cask gcloud-cli" >&2
  exit 1
fi

if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null | grep -q .; then
  echo "Not logged in. Run this first, then re-run this script:" >&2
  echo "  gcloud auth login" >&2
  exit 1
fi

if [[ -z "$PROJECT_ID" ]]; then
  echo "Usage: $0 <PROJECT_ID> [BUCKET]" >&2
  echo "Example: $0 travelwithvanessa-c6dba" >&2
  exit 1
fi

gcloud config set project "$PROJECT_ID" >/dev/null

if [[ -z "$BUCKET" ]]; then
  echo "Buckets in project ${PROJECT_ID}:"
  gcloud storage buckets list --format="table(name,location,storageClass)" 2>/dev/null || gsutil ls -L -b gs://
  echo ""
  echo "Run again with the bucket name, e.g.:" >&2
  echo "  $0 ${PROJECT_ID} your-bucket-id.firebasestorage.app" >&2
  echo "  (new projects use .firebasestorage.app; older may use .appspot.com)" >&2
  exit 0
fi

# Strip gs:// if pasted
BUCKET="${BUCKET#gs://}"
echo "Setting CORS on gs://${BUCKET} ..."
gsutil cors set "$CORS_FILE" "gs://${BUCKET}"
echo "Verifying:"
gsutil cors get "gs://${BUCKET}"
echo "Done."
