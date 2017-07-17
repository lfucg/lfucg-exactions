from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from notes.models import *

admin.site.register(Note, SimpleHistoryAdmin)
admin.site.register(RateTable, SimpleHistoryAdmin)
admin.site.register(Rate, SimpleHistoryAdmin)
