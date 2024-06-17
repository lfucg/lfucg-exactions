#!/bin/bash

set -eo pipefail

python /app/manage.py collectstatic --noinput

python /app/manage.py migrate
