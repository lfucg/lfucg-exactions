"""urlconf for the base application"""

from django.conf.urls import url, include
from . import views
from django.contrib.auth import views as auth_views

from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns


urlpatterns = [
    url(r'^index/$', views.IndexView.as_view(), name='index'),
    url(r'^logout/$', auth_views.logout, name='logout'),
    url(r'^health$', views.HealthView.as_view(), name='health'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include('api.urls')),
    url(r'^', include('dashboard.urls', namespace='dashboard')),
]


if settings.DEBUG:
    # Static file serving when using gunicorn + gevent for local web socket development
    urlpatterns += staticfiles_urlpatterns() + static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )

    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar
        urlpatterns.append(url(r'^__debug__/', include(debug_toolbar.urls)))
