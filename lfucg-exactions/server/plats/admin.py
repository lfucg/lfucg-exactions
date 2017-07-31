from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from plats.models import *

class LotHistoryAdmin(SimpleHistoryAdmin):
    list_display = (
        'address_full',
        'id',
        'plat',
    )

admin.site.register(Subdivision, SimpleHistoryAdmin)
admin.site.register(Plat, SimpleHistoryAdmin)
admin.site.register(Lot, LotHistoryAdmin)
admin.site.register(PlatZone, SimpleHistoryAdmin)
admin.site.register(CalculationWorksheet, SimpleHistoryAdmin)
