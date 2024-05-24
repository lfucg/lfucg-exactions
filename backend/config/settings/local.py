from .base import *
from .base import env

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
