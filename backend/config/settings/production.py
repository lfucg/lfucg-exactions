from config import ecs
import sentry_sdk

from .base import *
from .base import env
from .base import (before_send, before_send_log)

SECRET_KEY = env("DJANGO_SECRET_KEY")

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# Disallow DEBUG to avoid sensitive settings leaking
DEBUG = True

SITE_DOMAIN = env("SITE_DOMAIN")
ALLOWED_HOSTS = ["altexactions.lexingtonky.gov", SITE_DOMAIN] + ecs.get_task_ips()
CSRF_TRUSTED_ORIGINS = [
    "https://altexactions.lexingtonky.gov",
    "https://" + SITE_DOMAIN,
]

# AWS_DEFAULT_REGION = "us-east-1"
# AWS_STORAGE_BUCKET_NAME = env("AWS_STORAGE_BUCKET_NAME")
# AWS_ACCESS_KEY_ID = env("AWS_ACCESS_KEY_ID")
# AWS_SECRET_ACCESS_KEY = env("AWS_SECRET_ACCESS_KEY")
# AWS_S3_CUSTOM_DOMAIN = "s3.amazonaws.com/%s" % AWS_STORAGE_BUCKET_NAME
# AWS_DEFAULT_ACL = None

# AWS_STATIC_LOCATION = "static"
# STATIC_URL = "https://%s/static/" % AWS_S3_CUSTOM_DOMAIN

# MEDIA_URL = "https://%s/media/" % AWS_S3_CUSTOM_DOMAIN

# STATICFILES_STORAGE = "custom_storages.StaticStorage"
# DEFAULT_FILE_STORAGE = "custom_storages.MediaStorage"

EMAIL_BACKEND = "postmarker.django.EmailBackend"
POSTMARK = {
    "TOKEN": env("POSTMARK_API_KEY"),
    "TEST_MODE": False,
    "VERBOSITY": 0,
}

# LOGGING
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#logging
# See https://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "filters": {"require_debug_false": {"()": "django.utils.log.RequireDebugFalse"}},
    "formatters": {
        "verbose": {
            "format": "%(levelname)s %(asctime)s %(module)s "
            "%(process)d %(thread)d %(message)s"
        }
    },
    "handlers": {
        "mail_admins": {
            "level": "ERROR",
            "filters": ["require_debug_false"],
            "class": "django.utils.log.AdminEmailHandler",
        },
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
        "null": {
            "class": "logging.NullHandler",
        },
    },
    "root": {"level": "INFO", "handlers": ["console"]},
    "loggers": {
        "django.request": {
            "handlers": ["mail_admins"],
            "level": "ERROR",
            "propagate": True,
        },
        "django.security.DisallowedHost": {
            "handlers": ["null"],
            "propagate": False,
        },
    },
}

SENTRY_API_DSN = env("SENTRY_API_DSN", default=None)
if(SENTRY_API_DSN):
    sentry_sdk.init(
        dsn=SENTRY_API_DSN,
        environment="production-" + SITE_DOMAIN,
        # Add data like request headers and IP for users,
        # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
        send_default_pii=True,
        # Enable sending logs to Sentry
        enable_logs=True,
        add_full_stack=True,
        before_send=before_send,
        before_send_log=before_send_log,
    )
