#!/usr/bin/env bash

# Dev helper for Resume Scorer by Shridhi Gupta
# Starts backend (Node) and frontend (Next.js) together.

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Using project root: $ROOT_DIR"

echo "Ensuring Python AI service dependencies are installed..."
if [ -d "$ROOT_DIR/ai-service/.venv" ]; then
  "$ROOT_DIR/ai-service/.venv/Scripts/pip" install -r "$ROOT_DIR/ai-service/requirements.txt" >/dev/null 2>&1 || true
else
  echo "Warning: Python virtualenv not found at ai-service/.venv. Create it before running: python -m venv .venv"
fi

echo "Starting backend on http://localhost:4000 ..."
(
  cd "$ROOT_DIR/backend"
  npm install
  npm run dev
) &

echo "Starting frontend on http://localhost:3000 ..."
(
  cd "$ROOT_DIR/frontend"
  npm install
  npm run dev
)

wait

