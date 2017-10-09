from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from accounts.models import *

class AccountHistoryAdmin(SimpleHistoryAdmin):
    list_display = (
        'account_name',
        'contact_full_name',
        'id',
        'email',
        'phone',
        'address_full',
    )
    readonly_fields = (
        'created_by',
        'modified_by',
        'date_created',
        'date_modified',
    )

class AgreementHistoryAdmin(SimpleHistoryAdmin):
    list_display = (
        'resolution_number',
        'id',
        'account_name',
        'agreement_type',
        'expansion_area',
    )
    readonly_fields = (
        'created_by',
        'modified_by',
        'date_created',
        'date_modified',
    )    

    def account_name(self, obj):
        return obj.account_id.account_name
    account_name.short_description = 'Account'

class PaymentHistoryAdmin(SimpleHistoryAdmin):
    list_display = (
        'account_name',
        # 'agreement_resolution',
        'lot_address',
        'id',
        'payment_type',
        'paid_by_type',
    )
    readonly_fields = (
        'created_by',
        'modified_by',
        'date_created',
        'date_modified',
    )

    def account_name(self, obj):
        return obj.credit_account.account_name
    account_name.short_description = 'Account'

    # def agreement_resolution(self, obj):
    #     return obj.credit_source.resolution_number
    # agreement_resolution.short_description = 'Agreement'

    def lot_address(self, obj):
        return obj.lot_id.address_full
    lot_address.short_description = 'Lot'

admin.site.register(Account, AccountHistoryAdmin)
admin.site.register(Agreement, AgreementHistoryAdmin)
admin.site.register(Payment, PaymentHistoryAdmin)
admin.site.register(Project, SimpleHistoryAdmin)
admin.site.register(ProjectCostEstimate, SimpleHistoryAdmin)
admin.site.register(AccountLedger, SimpleHistoryAdmin)
