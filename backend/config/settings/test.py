import logging

from .base import *  # noqa

# https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = False
# https://docs.djangoproject.com/en/dev/ref/settings/#secret-key
SECRET_KEY = "mynotsosecretkey"

# Email
DEBUG_EMAIL = False
EMAIL_BACKEND = "notifications.sendgrid_backend.SendgridEmailBackend"
SENDGRID_API_KEY = None

SITE_DOMAIN = env("SITE_DOMAIN", default="exactions.lndo.site")

# Disable migrations locally for unit tests.  This greatly cuts down on run
# time for unit tests.
class DisableMigrations(object):
    def __contains__(self, item):
        return True

    def __getitem__(self, item):
        return None


MIGRATION_MODULES = DisableMigrations()

# Override password hasher for quicker tests
PASSWORD_HASHERS = ("django.contrib.auth.hashers.MD5PasswordHasher",)

COMPRESS_ENABLED = False

FRONTEND_DOMAIN = "https://example.com"
BACKEND_DOMAIN = "https://api.example.com"

# Disable haystack processing during tests
HAYSTACK_SIGNAL_PROCESSOR_ENABLED = False

# Disable logging while tests run
logging.disable(logging.CRITICAL)

# RSA key for JWT
RSA_PRIVATE_KEY = """
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCQIGdeVZTMYt48
lTQRp6wPpH++HVsg0k9We9n5iM8Ks5FuaT8bIM8jb+AB+oTr5MZWjn1n9rsYBhIY
ZXWQXGUc915rDYX2x8rpR4OmJBpBnIhzjU4T3ddYbYiMHjfO4K3WeufDsswId8aL
Nz/TgSZ/ydzSYcaqSSoLVju25Gk3Z1hO7TZiQ6KoB59Ye+ABy+VgBoVUFsw9a7oZ
bKCg11poo5vXCtIR3hopUSYAUMQpVoYQXyi4evpMFiz4M1W7wHmiWk8jiNHLZD1i
vJHuSyz80v5Iu1wQIZfZVPU08DpodP6Zn2ErhTiq3a97Mp5l4JbwWBECeb/vS2JY
ZSYRdopBAgMBAAECggEAPubNhmfOdbdOq90oaO4nU3plQBl6zKPM+X87PkNdrRt6
xNfNMW9Lx/kLKIHoIjXp9BvjEo0l0ZHQsvIQ8azJem9ht1IjHfXLkq1iARAvn2QM
T3Yj1drToeXIGvMTQ0hexkVEwm3Vy3pO3jKCOjJbFZmJtQ30URx2a5U6oZMlcoaR
4pQEJZf8AGCxTJKaaUYVIIvbLkn2LzrxrBXvRYS6/52ARcI/vYTggSp3l6214qus
Ge3Xrkmc0uRJNIiqIz82FuIs1DdUB9qSjbLybPoHJqmCOpdA5ODlhggw8QAp6ndd
uFG7wG8XoNknlCf9elOsebmkN3T1+oimjK8iXLkj8wKBgQDAz47TxfvVCgiov6AB
u/DxoHuWmJrsvc8Ax90YGnYJjTaP/zGk1CO06dc+CNIk6smK+UT4XK+5iO6ilDLe
1kCcrPHdtMIQqHYCi5uTfIWNC7TlMbwQXVn4DyvX4MB6GFMGkFna9AGz3SFeA+/A
Me8cGOKxp1qxql9kXADWvkJjYwKBgQC/XFaWZnPQtfHz1WUVvkWwfqhr8Nk7x0sy
YS/XwfCORnZS//ssoCl+tOP5Mdokdg9LVTxNRpVrrKFQBMNgmQHilmYGTbC4nTnh
/2DTe9v9h1QWRQUJlOD6CAlOOPIJEGijdqc4ZI2JvFxRfWw/kxHgijnANLWr4QW0
m87QKlY3CwKBgQCzrXirT1f0Wwpgv1qL4ymQ8n3ZhFLzhZpvXtFh0d7n3cnX/Pe1
Y9/2iugDrlKvBoFU2iB01mMHolzH8xVI5h6GIwCuG/Gxdluq2ZDcq3EFVMB5yZQ5
J9Vcvj6cSZz06tAMUN77lOI1TD/5DfARijcKVwKCjbON13hX3QkHFXxmgwKBgGfS
jHP7UBjLrmMxwy9h1WOlxHET8niZbzX9Przbz00R876ifb8/gmPpdsrL/mPL3g5s
R1RR2F3cAoVsoCg3u6sZGG+RFTGEtFPmf70eNUQ/eSK//bSuHsXpOEtFYCQE0BDo
Hl/dRmGVXa0k1GdFvuxJcn3S20JOyw6rfjC415/zAoGAGD8b8HfX3eGOYjLskIwR
L0o+bVAnm9CpfkZQuYo1gKUT1TosEvuYHQtOv/xxM+XEH/kv6lX+5+Con/5NzNwF
IjzKkwDcVTytZrLeyvEXCxrGEQv2HxGCp0Rakwcdnb+93vJnz9PkemwSDZUI3Xb1
44aTVqdDdMbhPUpOJFKBH7k=
-----END PRIVATE KEY-----
"""

MANAGER_EMAILS_ENABLED = True
