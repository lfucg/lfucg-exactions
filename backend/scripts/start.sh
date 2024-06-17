#!/bin/bash

set -eo pipefail

/usr/local/bin/gunicorn config.wsgi --bind 0.0.0.0:8000 --chdir=/app -k gevent
