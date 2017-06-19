from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from plats.models import *

admin.site.register(Subdivision, SimpleHistoryAdmin)
admin.site.register(Plat, SimpleHistoryAdmin)
admin.site.register(Lot, SimpleHistoryAdmin)
admin.site.register(PlatZone, SimpleHistoryAdmin)
admin.site.register(CalculationWorksheet, SimpleHistoryAdmin)
