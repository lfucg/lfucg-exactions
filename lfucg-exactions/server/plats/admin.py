from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from plats.models import *

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
        'sewer_due',
        'non_sewer_due',
    )

class LotHistoryAdmin(SimpleHistoryAdmin):
    list_display = (
        'address_full',
        'id',
        'plat',
    )

admin.site.register(Subdivision, SimpleHistoryAdmin)
admin.site.register(Plat, PlatHistoryAdmin)
admin.site.register(Lot, LotHistoryAdmin)
admin.site.register(PlatZone, SimpleHistoryAdmin)
admin.site.register(CalculationWorksheet, SimpleHistoryAdmin)
