from .base import *
from .base import env
from .base import (before_send, before_send_log)
import sentry_sdk

DEBUG = True

# https://docs.djangoproject.com/en/dev/ref/settings/#secret-key
SECRET_KEY = env(
    "DJANGO_SECRET_KEY",
    default="django-insecure-h0iio-vs8wp(yh1y)hrezqki)7f9(j&f03xwv+z+f5vus+a_lh",
)

SITE_DOMAIN = env("SITE_DOMAIN", default="exactions.lndo.site")

# https://docs.djangoproject.com/en/dev/ref/settings/#allowed-hosts
ALLOWED_HOSTS = [
    "localhost",
    "django",
    "0.0.0.0",
    "127.0.0.1",
    SITE_DOMAIN,
    "django.exactions.internal",
]

CSRF_TRUSTED_ORIGINS = [
    "https://" + SITE_DOMAIN,
]

DEFAULT_FILE_STORAGE = "django.core.files.storage.FileSystemStorage"

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
    }
}

EMAIL_BACKEND = env(
    "EMAIL_BACKEND", default="django.core.mail.backends.console.EmailBackend"
)

POSTMARK_API_KEY = env("POSTMARK_API_KEY", default="fake_key")


SENTRY_API_DSN = env("SENTRY_API_DSN", default=None)
if(SENTRY_API_DSN):
    sentry_sdk.init(
        dsn=SENTRY_API_DSN,
        environment="local-" + SITE_DOMAIN,
        # Add data like request headers and IP for users,
        # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
        send_default_pii=True,
        # Enable sending logs to Sentry
        enable_logs=True,
        add_full_stack=True,
        # filter events:
        # https://docs.sentry.io/platforms/python/configuration/filtering/#using-before-send
        before_send=before_send,
        before_send_log=before_send_log,
    )
