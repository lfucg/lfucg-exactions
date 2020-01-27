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
      modified_by__username='kelly'
      # modified_by__username='IMPORT'
    )

    # jan_nine.update(
    #   modified_by=user,
    #   is_approved=True
    # )
    for ledger in jan_nine:
      print('JAN DATE', ledger)
      date_hist = ledger.history.order_by('-date_modified').distinct('date_modified')
      print('DATE HIST ', date_hist)

      nine_index = [l.date_modified for l in date_hist].index(datetime.date(2020, 1, 9))
      print('NINE INDEX', nine_index)

      if len(date_hist) > 1:
        older_hist = date_hist[nine_index + 1]
        print('VARS ONE PLUS', older_hist)

        newer_hist = date_hist[nine_index - 1] if nine_index != 0 else False

        if older_hist and not newer_hist:
          prev_inst = older_hist.instance
          print('DATE HIST ONE', older_hist)
          print('DATE HIST ONE INSTANCE MOD', prev_inst.modified_by)
          prev_inst.modified_by_id = user.id
          prev_inst.is_approved = True
          prev_inst.save()
