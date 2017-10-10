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

class RateTableHistoryAdmin(SimpleHistoryAdmin):
    list_display = (
        'resolution_number',
        'begin_effective_date',
        'end_effective_date',
        'id',
    )
    readonly_fields = (
        'created_by',
        'modified_by',
        'date_created',
        'date_modified',
    )

class RateHistoryAdmin(SimpleHistoryAdmin):
    list_display = (
        'rate_table',
        'expansion_area',
        'zone',
        'category',
        'rate',
        'id',
    )
    readonly_fields = (
        'created_by',
        'modified_by',
        'date_created',
        'date_modified',
    )

    def rate_table(self, obj):
        return obj.rate_table_id.resolution_number
    rate_table.short_description = 'Rate Table'

admin.site.register(Note, NoteHistoryAdmin)
admin.site.register(RateTable, RateTableHistoryAdmin)
admin.site.register(Rate, RateHistoryAdmin)
