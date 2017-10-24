from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from plats.models import *

class SubdivisionHistoryAdmin(SimpleHistoryAdmin):
    list_display = (
        'name',
        'gross_acreage',
        'id',
    )
    readonly_fields = (
        'created_by',
        'modified_by',
        'date_created',
        'date_modified',
    )

class PlatHistoryAdmin(SimpleHistoryAdmin):
    list_display = (
        'name',
        'id',
        'slide',
        'subdivision',
        'account',
        'unit',
        'block',
        'section',
        'total_acreage',
    )
    readonly_fields = (
        'created_by',
        'modified_by',
        'date_created',
        'date_modified',
    )

    def subdivision(self, obj):
        return obj.subdivision.name
    subdivision.short_description = 'Subdivision'

    def account(self, obj):
        return obj.account.account_name
    account.short_description = 'Account'

class LotHistoryAdmin(SimpleHistoryAdmin):
    list_display = (
        'address_full',
        'id',
        'plat',
        'lot_number',
        'permit_id',
    )
    readonly_fields = (
        'created_by',
        'modified_by',
        'date_created',
        'date_modified',
    )

    def plat(self, obj):
        return obj.plat.name
    plat.short_description = 'Plat'

class PlatZoneHistoryAdmin(SimpleHistoryAdmin):
    list_display = (
        'zone',
        'acres',
        'id',
        'plat',
    )
    readonly_fields = (
        'created_by',
        'modified_by',
        'date_created',
        'date_modified',
    )

    def plat(self, obj):
        return obj.plat.name
    plat.short_description = 'Plat'


admin.site.register(Subdivision, SubdivisionHistoryAdmin)
admin.site.register(Plat, PlatHistoryAdmin)
admin.site.register(Lot, LotHistoryAdmin)
admin.site.register(PlatZone, PlatZoneHistoryAdmin)
admin.site.register(CalculationWorksheet, SimpleHistoryAdmin)
