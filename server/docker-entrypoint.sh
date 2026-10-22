#!/bin/sh
set -e

# Run migrations and seeders before the API starts.
# MySQL can take a few extra seconds on the very first start, so retry a bit.
tries=0
until npx sequelize-cli db:migrate; do
  tries=$((tries + 1))
  if [ "$tries" -ge 10 ]; then
    echo "Database still not ready after $tries tries, giving up."
    exit 1
  fi
  echo "Database not ready yet, retrying in 3s..."
  sleep 3
done

# Seeders only run once (they're tracked in the SequelizeData table).
# The admin account is always added; SEED_DEMO_DATA=false skips the demo staff, attendance and payslips.
npx sequelize-cli db:seed:all

exec "$@"
