from django.core.management import BaseCommand
import datetime

from django.contrib.auth.models import User
from accounts.models import AccountLedger

class Command(BaseCommand):
  help = "Revert to version in audit trail history"

  def handle(self, *args, **options):
    user = User.objects.get(username='kelly')

    jan_nine = AccountLedger.objects.filter(
      date_modified__gte=datetime.date(2020, 1, 9),
      date_modified__lte=datetime.date(2020, 1, 9),
      modified_by__username='IMPORT'
    )

    jan_nine.update(
      modified_by=user,
      is_approved=True
    )
    # for jan_date in jan_nine:
    #   print('JAN DATE', jan_date)
    #   date_hist = jan_date.history.order_by('-date_modified').distinct('date_modified')

    #   if len(date_hist) > 1:
    #     prev_inst = date_hist[1].instance
    #     print('DATE HIST ONE', date_hist[1])
    #     print('DATE HIST ONE INSTANCE MOD', prev_inst.modified_by)
    #     prev_inst.modified_by_id = user.id
    #     prev_inst.is_approved = True
    #     prev_inst.save()
