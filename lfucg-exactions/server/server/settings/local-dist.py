from . import base
import os

# import dj_database_url
# DATABASES['default'] = dj_database_url.config()

# SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

ALLOWED_HOSTS = ['*']

AWS_DEFAULT_REGION = 'us-east-1'
AWS_STORAGE_BUCKET_NAME = '<%= @config["AWS_STORAGE_BUCKET_NAME"] %>'
AWS_ACCESS_KEY_ID = '<%= @config["AWS_ACCESS_KEY_ID"] %>'
AWS_SECRET_ACCESS_KEY = '<%= @config["AWS_SECRET_ACCESS_KEY"] %>'
AWS_S3_CUSTOM_DOMAIN = 's3.amazonaws.com/%s' % AWS_STORAGE_BUCKET_NAME

# STATIC_URL = "https://%s/" % AWS_S3_CUSTOM_DOMAIN
# STATIC_ROOT = "https://%s/static/" % AWS_S3_CUSTOM_DOMAIN
# STATICFILES_STORAGE = '<%= @config["STATICFILES_STORAGE"] %>'

DEFAULT_FILE_STORAGE = '<%= @config["DEFAULT_FILE_STORAGE"] %>'

AWS_S3_MEDIA_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME
MEDIA_URL = "https://%s/media/" % AWS_S3_MEDIA_DOMAIN

# EMAIL_BACKEND = "sgbackend.SendGridBackend"
# SENDGRID_API_KEY = '<%= @config["SENDGRID_API_KEY"] %>'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'exactions',
        'USER': '<%= @config["DATABASE_USER"] %>',
        'PASSWORD': '<%= @config["DATABASE_PASSWORD"] %>',
        'HOST': '<%= @config["DATABASE_HOST"] %>',
        'PORT': '5432',
    },
}

BASE_URL="http://localhost:8000"
# Recipients of traceback emails and other notifications.
ADMINS = (
    # ('Your Name', 'your_email@domain.com'),
)
MANAGERS = ADMINS

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

DEBUG = TEMPLATE_DEBUG = True

# Is this a development instance? Set this to True on development/master
# instances and False on stage/prod.
DEV = True

# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
# ALLOWED_HOSTS = ["*"]

# SECURITY WARNING: keep the secret key used in production secret!
# Hardcoded values can leak through source control. Consider loading
# the secret key from an environment variable or a file instead.

# Generate a fresh key with the following command:
# python -c 'import random; print("".join([random.choice("abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)") for i in range(50)]))'
SECRET_KEY = '<%= @config["SECRET_KEY"] %>'

# Remove this configuration variable to use your custom logging configuration
LOGGING_CONFIG = None
LOGGING = {
    'version': 1,
    'loggers': {
        'server': {
            'level': "DEBUG"
        }
    }
}

INTERNAL_IPS = ('127.0.0.1')
