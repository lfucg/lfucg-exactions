from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin
from django.contrib.auth.admin import UserAdmin

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

    def lot_address(self, obj):
        return obj.lot_id.address_full
    lot_address.short_description = 'Lot'

class ProjectHistoryAdmin(SimpleHistoryAdmin):
    list_display = (
        'name',
        'project_category',
        'project_type',
        'project_status',
        'expansion_area',
        'id',
        'agreement',
    )
    readonly_fields = (
        'created_by',
        'modified_by',
        'date_created',
        'date_modified',
    )

    def agreement(self, obj):
        return obj.agreement_id.resolution_number
    agreement.short_description = 'Agreement'

class ProjectCostEstimateHistoryAdmin(SimpleHistoryAdmin):
    list_display = (
        'project',
        'estimate_type',
        'id',
        'credits_available',
    )
    readonly_fields = (
        'created_by',
        'modified_by',
        'date_created',
        'date_modified',
    )

    def project(self, obj):
        return obj.project_id.name
    project.short_description = 'Project'

class AccountLedgerHistoryAdmin(SimpleHistoryAdmin):
    list_display = (
        'account_to',
        'account_from',
        'agreement',
        'lot',
        'id',
        'entry_type',
        'entry_date',
    )
    readonly_fields = (
        'created_by',
        'modified_by',
        'date_created',
        'date_modified',
    )

    def account_from(self, obj):
        return obj.account_from.account_name
    account_from.short_description = 'Account From'

    def account_to(self, obj):
        return obj.account_to.account_name
    account_to.short_description = 'Account To'

    def agreement(self, obj):
        return obj.agreement.resolution_number
    agreement.short_description = 'Agreement'

    def lot(self, obj):
        return obj.lot.address_full
    lot.short_description = 'Lot'

UserAdmin.list_display += ('last_login',)

admin.site.register(Account, AccountHistoryAdmin)
admin.site.register(Agreement, AgreementHistoryAdmin)
admin.site.register(Payment, PaymentHistoryAdmin)
admin.site.register(Project, ProjectHistoryAdmin)
admin.site.register(ProjectCostEstimate, ProjectCostEstimateHistoryAdmin)
admin.site.register(AccountLedger, AccountLedgerHistoryAdmin)
