"""urlconf for the base application"""

from django.conf.urls import url, include
from . import views

urlpatterns = [
    url(r'^index/$', views.IndexView.as_view(), name='index'),
    url(r'^', include('dashboard.urls', namespace='dashboard')),
]
