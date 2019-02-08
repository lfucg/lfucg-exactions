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
        'id',
        'resolution_number',
        'begin_effective_date',
        'end_effective_date',
        'is_active',
    )
    readonly_fields = (
        'created_by',
        'modified_by',
        'date_created',
        'date_modified',
    )

    def save_model(self, request, obj, form, change):
        if getattr(obj, 'created_by', None) is None:
            obj.created_by = request.user
        if getattr(obj, 'modified_by', None) is None:
            obj.modified_by = request.user
        obj.save()

class RateHistoryAdmin(SimpleHistoryAdmin):
    search_fields = ['rate_table_id__resolution_number', 'expansion_area', 'zone', 'category']
    list_display = (
        'id',
        'rate_table_id',
        'expansion_area',
        'zone',
        'category',
        'rate',
        'created_by',
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

    def save_model(self, request, obj, form, change):
        if getattr(obj, 'created_by', None) is None:
            obj.created_by = request.user
        if getattr(obj, 'modified_by', None) is None:
            obj.modified_by = request.user
        obj.save()

class FileUploadAdmin(SimpleHistoryAdmin):
    list_display = (
        'upload',
        'file_content_type',
        'file_object_id',
        'date',
        'id',
    )

admin.site.register(Note, NoteHistoryAdmin)
admin.site.register(RateTable, RateTableHistoryAdmin)
admin.site.register(Rate, RateHistoryAdmin)
admin.site.register(FileUpload, FileUploadAdmin)
