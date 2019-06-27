from django.core.management import BaseCommand
import pandas as pd
import numpy as np
import datetime
from decimal import Decimal

from django.contrib.auth.models import User
from accounts.models import Account, AccountLedger, Agreement
from plats.models import Lot, Plat
from base.management.commands.helper import ConvertDates, GetLedgerLot

class Command(BaseCommand):
  user = User.objects.get(username='IMPORT')
  lfucg_account = Account.objects.filter(account_name='Lexington Fayette Urban County Government (LFUCG)').first()

  def DeleteEmptyLedger(self, lot):
    ledgers = AccountLedger.objects.filter(
      lot=lot,
      entry_date__year='1970',
    )

    ledger_values = [
      'non_sewer_credits', 'sewer_credits',
      'roads', 'parks', 'storm', 'open_space',
      'sewer_cap', 'sewer_trans',
    ]

    if ledgers.count() != 0:
      for ledger in ledgers:
        if all(getattr(ledger, val) == 0.00 for val in ledger_values):
          ledger.delete() 

  def DeleteDuplicateLedgers(self, lot, agreement):
    agreement_ledgers = AccountLedger.objects.filter(
      lot=lot,
      agreement=agreement,
    )

    distinct_ledgers = AccountLedger.objects.filter(
      lot=lot,
      agreement=agreement,
    ).distinct(
      'account_from', 'account_to', 'entry_type',
      'non_sewer_credits', 'sewer_credits',
      'roads', 'parks', 'storm', 'open_space',
      'sewer_cap', 'sewer_trans',
    )

    if distinct_ledgers.exists():
      filtered_ledgers = AccountLedger.objects.filter(
        lot=lot,
        agreement=agreement,
        account_from=distinct_ledgers[0].account_from,
        account_to=distinct_ledgers[0].account_to,
        entry_type=distinct_ledgers[0].entry_type,
        non_sewer_credits=distinct_ledgers[0].non_sewer_credits,
        sewer_credits=distinct_ledgers[0].sewer_credits,
        roads=distinct_ledgers[0].roads,
        parks=distinct_ledgers[0].parks,
        storm=distinct_ledgers[0].storm,
        open_space=distinct_ledgers[0].open_space,
        sewer_cap=distinct_ledgers[0].sewer_cap,
        sewer_trans=distinct_ledgers[0].sewer_trans,
      )

      for ledger in agreement_ledgers:
        if ledger.id != filtered_ledgers.first().id:
          print('Not first distinct ledger id', ledger.id)
          print('ID of distinct', filtered_ledgers.first().id)
          ledger.delete()

  def handle(self, *args, **options):
    # Remove entries made without ledger values
    df_empty = pd.read_csv('import_files/empty_ledgers.csv')

    for index, row in df_empty.iterrows():
      address = row['Lot'].strip(' Lexington, KY')
      lot = GetLedgerLot(address)

      self.DeleteEmptyLedger(lot)

    # Remove duplicate entries
    df_duplicate = pd.read_csv('import_files/ledger_duplicates.csv')

    for index, row in df_duplicate.iterrows():
      address = row['Lot'].strip(' Lexington, KY')
      lot = GetLedgerLot(address)
      simple_agreement = Agreement.objects.filter(resolution_number=str(row['Agreement']))

      self.DeleteDuplicateLedgers(lot, simple_agreement)