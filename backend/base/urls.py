"""urlconf for the base application"""

from django.urls import include, path
from . import views
from django.contrib.auth import views as auth_views
from django.contrib import admin
from django.contrib.auth.views import LogoutView

from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns


urlpatterns = [
    path("logout/", LogoutView.as_view(), name="logout"),
    path("index/", views.IndexView.as_view(), name="index"),
    path("health", views.HealthView.as_view(), name="health"),
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
    path("", include("dashboard.urls")),
]


if settings.DEBUG:
    # Static file serving when using gunicorn + gevent for local web socket development
    urlpatterns += staticfiles_urlpatterns() + static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )

    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns.append(path("__debug__/", include(debug_toolbar.urls)))
