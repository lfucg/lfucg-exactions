from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from notes.models import *

class NoteHistoryAdmin(SimpleHistoryAdmin):
    list_display = (
        'note',
        'content_type',
        'content_type_id',
        'object_id',
        'user',
        'date',
    )

admin.site.register(Note, NoteHistoryAdmin)
admin.site.register(RateTable, SimpleHistoryAdmin)
admin.site.register(Rate, SimpleHistoryAdmin)
