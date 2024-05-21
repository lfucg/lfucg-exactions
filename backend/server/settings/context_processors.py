from django.conf import settings


def set_static_url(request):
	ctx = {
		'STATIC_URL': settings.STATIC_URL
	}

	return ctx
