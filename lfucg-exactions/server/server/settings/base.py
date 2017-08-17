"""
This is your project's main settings file that can be committed to your
repo. If you need to override a setting locally, use local.py
"""

import os
import logging

# Normally you should not import ANYTHING from Django directly
# into your settings, but ImproperlyConfigured is an exception.
from django.core.exceptions import ImproperlyConfigured
from unipath import Path

def get_env_setting(setting):
    """ Get the environment setting or return exception """
    try:
        return os.environ[setting]
    except KeyError:
        error_msg = "Set the %s env variable" % setting
        raise ImproperlyConfigured(error_msg)


# Your project root
PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__) + "../../../")

SUPPORTED_NONLOCALES = ['media', 'admin', 'static']

BASE_DIR = Path(__file__).ancestor(3)
DIST_DIR = BASE_DIR.ancestor(1).child("dist")
TEMPLATE_DIR = BASE_DIR.child("templates")
STATIC_FILE_DIR = BASE_DIR.child("static")

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

BASE_URL = "http://52.201.224.95/"
# Defines the views served for root URLs.
ROOT_URLCONF = 'server.urls'

# Application definition
INSTALLED_APPS = (
    # Django contrib apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.humanize',
    'django.contrib.syndication',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',

    # Third-party apps, patches, fixes
    'debug_toolbar',
    'compressor',

    # Application base, containing global templates.
    'base',
    'simple_history',

    # Local apps, referenced via appname
    'accounts',
    'api',
    'notes',
    'plats',
)

# Place bcrypt first in the list, so it will be the default password hashing
# mechanism
PASSWORD_HASHERS = (
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
    'django.contrib.auth.hashers.BCryptPasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.SHA1PasswordHasher',
    'django.contrib.auth.hashers.MD5PasswordHasher',
    'django.contrib.auth.hashers.CryptPasswordHasher',
)

# Sessions
#
# By default, be at least somewhat secure with our session cookies.
# SESSION_COOKIE_HTTPONLY = True

# Set this to true if you are using https
# SESSION_COOKIE_SECURE = False

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.example.com/media/"
MEDIA_ROOT = os.path.join(PROJECT_ROOT, 'media')

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.example.com/media/", "http://example.com/media/"
MEDIA_URL = '/media/'
# DEFAULT_FILE_STORAGE = "notes.models.MediaRootS3BotoStorage"
# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.example.com/static/"
STATIC_ROOT = os.path.join(PROJECT_ROOT, 'static')

# URL prefix for static files.
# Example: "http://media.example.com/static/"
STATIC_URL = '/static/'



# Additional locations of static files
STATICFILES_DIRS = (
    DIST_DIR,
)

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'America/Louisville'

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
)

MIDDLEWARE = [
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    'simple_history.middleware.HistoryRequestMiddleware',
]

#TEMPLATE_DIR = os.path.join(PROJECT_ROOT, 'templates')

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [TEMPLATE_DIR],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.media',
            ],
        },
    },
]

TEST_RUNNER = 'django.test.runner.DiscoverRunner'


def custom_show_toolbar(request):
    """ Only show the debug toolbar to users with the superuser flag. """
    return request.user.is_superuser


DEBUG_TOOLBAR_CONFIG = {
    'INTERCEPT_REDIRECTS': False,
    'SHOW_TOOLBAR_CALLBACK': 'server.settings.base.custom_show_toolbar',
    'HIDE_DJANGO_SQL': True,
    'TAG': 'body',
    'SHOW_TEMPLATE_CONTEXT': True,
    'ENABLE_STACKTRACES': True,
}

# Uncomment the following setting if you get an ImportError such as:
#   ImproperlyConfigured: The included urlconf projectname.urls doesn't have any patterns in it
# See:
# http://stackoverflow.com/questions/20963856/improperlyconfigured-the-included-urlconf-project-urls-doesnt-have-any-patte/21005346#21005346
# http://django-debug-toolbar.readthedocs.org/en/1.0/installation.html#explicit-setup
#DEBUG_TOOLBAR_PATCH_SETTINGS = False

# DEBUG_TOOLBAR_PANELS = (
#     #'debug_toolbar_user_panel.panels.UserPanel',
#     'debug_toolbar.panels.version.VersionDebugPanel',
#     'debug_toolbar.panels.timer.TimerDebugPanel',
#     'debug_toolbar.panels.settings_vars.SettingsVarsDebugPanel',
#     'debug_toolbar.panels.headers.HeaderDebugPanel',
#     'debug_toolbar.panels.request_vars.RequestVarsDebugPanel',
#     'debug_toolbar.panels.template.TemplateDebugPanel',
#     'debug_toolbar.panels.sql.SQLDebugPanel',
#     'debug_toolbar.panels.signals.SignalDebugPanel',
#     'debug_toolbar.panels.logger.LoggingPanel',
# )

# Specify a custom user model to use
#AUTH_USER_MODEL = 'accounts.MyUser'

FILE_UPLOAD_PERMISSIONS = 0o0664

# The WSGI Application to use for runserver
WSGI_APPLICATION = 'server.wsgi.application'

# Define your database connections
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'exactions',
        'USER': '',
        'PASSWORD': '',
        'HOST': '',
        'PORT': '',
    },
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'DEFAULT_PARSER_CLASSES': (
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser',
    )
}

# Uncomment this and set to all slave DBs in use on the site.
# SLAVE_DATABASES = ['slave']

# Recipients of traceback emails and other notifications.
ADMINS = (
    # ('Your Name', 'your_email@domain.com'),
)
MANAGERS = ADMINS

# SECURITY WARNING: don't run with debug turned on in production!
# Debugging displays nice error messages, but leaks memory. Set this to False
# on all server instances and True only for development.
DEBUG = TEMPLATE_DEBUG = False

# Is this a development instance? Set this to True on development/master
# instances and False on stage/prod.
DEV = False

# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
ALLOWED_HOSTS = []

# SECURITY WARNING: keep the secret key used in production secret!
# Hardcoded values can leak through source control.
# This is an example method of getting the value from an environment setting.
# Uncomment to use, and then make sure you set the SECRET_KEY environment variable.
# This is good to use in production, and on services that support it such as Heroku.
#SECRET_KEY = get_env_setting('SECRET_KEY')

# Uncomment these to activate and customize Celery:
# CELERY_ALWAYS_EAGER = False  # required to activate celeryd
# BROKER_HOST = 'localhost'
# BROKER_PORT = 5672
# BROKER_USER = 'django'
# BROKER_PASSWORD = 'django'
# BROKER_VHOST = 'django'
# CELERY_RESULT_BACKEND = 'amqp'

INTERNAL_IPS = ('127.0.0.1')

# Enable this option for memcached
#CACHE_BACKEND= "memcached://127.0.0.1:11211/"

# Set this to true if you use a proxy that sets X-Forwarded-Host
#USE_X_FORWARDED_HOST = False

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

SERVER_EMAIL = "webmaster@example.com"
DEFAULT_FROM_EMAIL = "webmaster@example.com"
SYSTEM_EMAIL_PREFIX = "[server]"

## Log settings

LOG_LEVEL = logging.INFO
HAS_SYSLOG = True
SYSLOG_TAG = "http_app_server"  # Make this unique to your project.
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

# Common Event Format logging parameters
#CEF_PRODUCT = 'server'
#CEF_VENDOR = 'Your Company'
#CEF_VERSION = '0'
#CEF_DEVICE_VERSION = '0'
