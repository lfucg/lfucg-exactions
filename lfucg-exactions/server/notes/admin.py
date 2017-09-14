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

class RateHistoryAdmin(SimpleHistoryAdmin):
    list_display = (
        'category',
        'zone',
        'expansion_area',
        'rate',
        'rate_table_id',
        'id',
    )
        

admin.site.register(Note, NoteHistoryAdmin)
admin.site.register(RateTable, SimpleHistoryAdmin)
admin.site.register(Rate, RateHistoryAdmin)
