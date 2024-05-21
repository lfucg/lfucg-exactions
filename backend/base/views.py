""" Views for the base application """

from django.shortcuts import render
from django.views.generic import TemplateView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

class IndexView(TemplateView):
    template_name = 'base/index.html'

@method_decorator(csrf_exempt, name='dispatch')
class HealthView(TemplateView):
    template_name = 'base/health.html'
