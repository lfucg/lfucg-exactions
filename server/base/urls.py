"""urlconf for the base application"""

from django.conf.urls import url, include
from . import views

urlpatterns = [
    url(r'^$', views.IndexView.as_view(), name='index'),
    url(r'^dashboard/', include('dashboard.urls', namespace='dashboard')),
]
