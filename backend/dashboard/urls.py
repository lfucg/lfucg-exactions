from django.urls import path

from . import views

urlpatterns = [
    path(r'^$', views.DashboardView.as_view(), name='dashboard'),
]
