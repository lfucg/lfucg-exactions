from . import base
import os
import django

# import dj_database_url
# DATABASES['default'] = dj_database_url.config()

# SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

ALLOWED_HOSTS = ['*']

AWS_DEFAULT_REGION = 'us-east-1'
AWS_STORAGE_BUCKET_NAME = '<%= @config["AWS_STORAGE_BUCKET_NAME"] %>'
AWS_ACCESS_KEY_ID = '<%= @config["AWS_ACCESS_KEY_ID"] %>'
AWS_SECRET_ACCESS_KEY = '<%= @config["AWS_SECRET_ACCESS_KEY"] %>'

STATIC_URL = '<%= @config["STATIC_URL"] %>'
STATIC_ROOT = "%s/static/" % STATIC_URL
STATICFILES_STORAGE = '<%= @config["STATICFILES_STORAGE"] %>'

DEFAULT_FILE_STORAGE = '<%= @config["DEFAULT_FILE_STORAGE"] %>'

MEDIA_URL = '<%= @config["MEDIA_URL"] %>'

# EMAIL_BACKEND = "sgbackend.SendGridBackend"
# SENDGRID_API_KEY = '<%= @config["SENDGRID_API_KEY"] %>'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        # 'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'exactions',
        'USER': '<%= @config["DATABASE_USER"] %>',
        'PASSWORD': '<%= @config["DATABASE_PASSWORD"] %>',
        'HOST': '<%= @config["DATABASE_HOST"] %>',
        'PORT': '5432',
    },
}

BASE_URL='<%= @config["BASE_URL"] %>'
# Recipients of traceback emails and other notifications.
ADMINS = (
    # ('Your Name', 'your_email@domain.com'),
)
MANAGERS = ADMINS

EMAIL_BACKEND = 'postmarker.django.EmailBackend'
POSTMARK = {
    'TOKEN': '<%= @config["POSTMARK_API_KEY"] %>',
}

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

DEBUG = '<%= @config["DEBUG"] %>'

# Is this a development instance? Set this to True on development/master
# instances and False on stage/prod.
DEV = '<%= @config["DEV"] %>'

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
