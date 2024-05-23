from . import base
import os
import django

# import dj_database_url
# DATABASES['default'] = dj_database_url.config()

# SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

ALLOWED_HOSTS = ['*']

AWS_DEFAULT_REGION = 'us-east-1'
AWS_STORAGE_BUCKET_NAME = 'storage_bucket_name'
AWS_ACCESS_KEY_ID = 'aws_key_id'
AWS_SECRET_ACCESS_KEY = 'aws_secret_key'

STATIC_URL = '/static/'
STATIC_ROOT = "%s/static/" % STATIC_URL
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'

MEDIA_URL = '/media/'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'exactions',
        'USER': 'postgres',
        'PASSWORD': 'password',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    },
}

BASE_URL='http://localhost:8000/'
# Recipients of traceback emails and other notifications.
ADMINS = (
    # ('Your Name', 'your_email@domain.com'),
)
MANAGERS = ADMINS

# EMAIL_BACKEND = "sgbackend.SendGridBackend"
# SENDGRID_API_KEY ='sendgrid_api_key'

EMAIL_BACKEND = 'postmark.django_backend.EmailBackend'
POSTMARK_API_KEY ='postmark_api_key'

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

DEBUG = 'True' == 'True'

# Is this a development instance? Set this to True on development/master
# instances and False on stage/prod.
DEV = 'True' == 'True'

SECRET_KEY = 'secret_key'

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
