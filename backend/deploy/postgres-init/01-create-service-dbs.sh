#!/bin/bash
set -euo pipefail

: "${POSTGRES_USER:?POSTGRES_USER required}"
: "${POSTGRES_PASSWORD:?POSTGRES_PASSWORD required}"

for db in auth catalog content activity; do
  echo "CREATE DATABASE :$db"
  psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" <<-EOSQL
    SELECT 'CREATE DATABASE $db'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$db')\gexec
EOSQL
done
