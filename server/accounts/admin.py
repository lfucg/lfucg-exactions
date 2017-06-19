from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from accounts.models import *

admin.site.register(Account, SimpleHistoryAdmin)
admin.site.register(Agreement, SimpleHistoryAdmin)
admin.site.register(Payment, SimpleHistoryAdmin)
admin.site.register(Project, SimpleHistoryAdmin)
admin.site.register(ProjectCostEstimate, SimpleHistoryAdmin)
admin.site.register(AccountLedger, SimpleHistoryAdmin)
