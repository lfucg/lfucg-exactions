from django.contrib import admin

from notes.models import *

admin.site.register(Note)
admin.site.register(RateTable)
admin.site.register(Rate)
