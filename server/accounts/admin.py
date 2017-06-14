from django.contrib import admin

from accounts.models import *

admin.site.register(Account)
admin.site.register(Agreement)
admin.site.register(Payment)
admin.site.register(Project)
admin.site.register(ProjectCostEstimate)
admin.site.register(AccountLedger)
