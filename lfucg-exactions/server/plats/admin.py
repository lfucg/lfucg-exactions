from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin
from django.forms.models import BaseInlineFormSet

from plats.models import *

class SubdivisionHistoryAdmin(SimpleHistoryAdmin):
    list_display = (
        'id',
        'name',
        'gross_acreage',
        'is_active',
        'is_approved'
    )
    list_editable = (
        'name',
        'gross_acreage',
        'is_active',
        'is_approved'
    )
    readonly_fields = (
        'created_by',
        'modified_by',
        'date_created',
        'date_modified',
    )
    ordering = (
        'name',
    )

class PlatZoneInlineAdmin(admin.TabularInline):
    model = PlatZone
    extra = 1

class PlatHistoryAdmin(SimpleHistoryAdmin):
    list_display = (
        'id',
        'name',
        'cabinet',
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
    search_fields = (
        'name',
        'account__account_name',
        'account__contact_full_name',
        'subdivision__name'
    )
    inlines = [PlatZoneInlineAdmin,]

    def subdivision(self, obj):
        return obj.subdivision.name
    subdivision.short_description = 'Subdivision'

    def account(self, obj):
        return obj.account.account_name
    account.short_description = 'Account'

class LotHistoryAdmin(SimpleHistoryAdmin):
    list_display = (
        'id',
        'address_full',
        'plat',
        'lot_number',
        'account',
        'permit_id',
        'address_number',
        'address_street',
    )
    readonly_fields = (
        'created_by',
        'modified_by',
        'date_created',
        'date_modified',
    )
    search_fields = (
        'address_number',
        'address_street',
        'address_full',
        'plat__name',
        'account__account_name'
    )
    list_filter = (
        'plat',
        'account',
    )
    def plat(self, obj):
        return obj.plat.name
    plat.short_description = 'Plat'

class PlatZoneHistoryAdmin(SimpleHistoryAdmin):
    list_display = (
        'id',
        'zone',
        'acres',
        'plat',
        'is_active'
    )
    list_editable = (
        'acres',
        'is_active'
    )
    readonly_fields = (
        'created_by',
        'modified_by',
        'date_created',
        'date_modified',
    )
    search_fields = (
        'plat__name',
        'zone'
    )
    ordering = (
        'plat__name',
    )

    def plat(self, obj):
        return obj.plat.name
    plat.short_description = 'Plat'


admin.site.register(Subdivision, SubdivisionHistoryAdmin)
admin.site.register(Plat, PlatHistoryAdmin)
admin.site.register(Lot, LotHistoryAdmin)
admin.site.register(PlatZone, PlatZoneHistoryAdmin)
admin.site.register(CalculationWorksheet, SimpleHistoryAdmin)
