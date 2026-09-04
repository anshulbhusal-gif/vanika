#!/bin/sh
set -e

echo "[DockerEntrypoint] Starting Vanika Cognitive Care container..."

# Optionally run database migrations if RUN_MIGRATIONS is set to true
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "[DockerEntrypoint] Running Prisma database migrations (prisma migrate deploy)..."
  npx prisma migrate deploy || echo "[DockerEntrypoint] Warning: Migration deployment step skipped or encountered error."
fi

# Execute production entrypoint
echo "[DockerEntrypoint] Launching Vanika Server (node dist/server.cjs)..."
exec node dist/server.cjs
