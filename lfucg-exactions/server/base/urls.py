"""urlconf for the base application"""

from django.conf.urls import url, include
from . import views
from django.contrib.auth import views as auth_views

from django.conf import settings

urlpatterns = [
    url(r'^index/$', views.IndexView.as_view(), name='index'),
    url(r'^', include('dashboard.urls', namespace='dashboard')),
    url(r'^logout/$', auth_views.logout, name='logout'),
    url(r'^health$', views.HealthView.as_view(), name='health'),
]

# if settings.DEBUG:
#     import debug_toolbar
#     urlpatterns += [
#         url(r'^__debug__/', include(debug_toolbar.urls)),
#     ]