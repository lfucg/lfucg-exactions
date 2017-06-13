from django.contrib import admin

from plats.models import *

# class SubdivisionAdmin(admin.ModelAdmin):

admin.site.register(Subdivision)
admin.site.register(Plat)
admin.site.register(Lot)
admin.site.register(PlatZone)
admin.site.register(Payment)
admin.site.register(CalculationWorksheet)
