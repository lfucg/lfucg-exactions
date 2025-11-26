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
    path(r"^logout/$", LogoutView.as_view(), name="logout"),
    path(r"^index/$", views.IndexView.as_view(), name="index"),
    path(r"^health$", views.HealthView.as_view(), name="health"),
    path(r"^admin/", admin.site.urls),
    path(r"^api/", include("api.urls")),
    path(r"^", include("dashboard.urls")),
]


if settings.DEBUG:
    # Static file serving when using gunicorn + gevent for local web socket development
    urlpatterns += staticfiles_urlpatterns() + static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )

    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns.append(path(r"^__debug__/", include(debug_toolbar.urls)))
