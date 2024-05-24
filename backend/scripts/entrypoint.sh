#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset

# Secret compositions
export DATABASE_URL=postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}

# Run gunicorn command
exec "$@"
