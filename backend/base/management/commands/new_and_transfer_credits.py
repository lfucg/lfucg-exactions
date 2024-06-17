from django.core.management import BaseCommand
import pandas as pd
import numpy as np
import datetime
from decimal import Decimal

from django.contrib.auth.models import User
from accounts.models import Account, AccountLedger, Agreement
from plats.models import Lot, Plat

class Command(BaseCommand):
  user = User.objects.get(username='IMPORT')
  lfucg_account = Account.objects.filter(account_name='Lexington Fayette Urban County Government (LFUCG)').first()

  def ConvertDates(self, date_field):
    try:
      cleaned_date = datetime.datetime.strptime(date_field.split(' ')[0], '%m/%d/%y').date()
    except:
      try:
        cleaned_date_except = datetime.datetime.strptime(date_field.split(' ')[0], '%m/%d/%Y').date()
      except Exception as exc:
        cleaned_date_except = None
      cleaned_date = cleaned_date_except

    return cleaned_date.strftime('%Y-%m-%d')

  def GetAccount(self, name):
    try:
      return Account.objects.get(account_name=name)
    except:
      try:
        return Account.objects.filter(account_name=name).first()
      except Exception as exc:
        print('ACCOUNT ERROR', exc)

  def GetAgreement(self, number):
    try:
      return Agreement.objects.get(resolution_number=number)
    except:
      try:
        return Agreement.objects.filter(resolution_number=number).first()
      except Exception as exc:
        print('AGREEMENT ERROR', exc)

  def AddNewCredits(self, df):
    df['Non-Sewer'] = df['Non-Sewer'].fillna(0.00).astype(float)
    df['Sewer'] = df['Sewer'].fillna(0.00).astype(float)

    for index, row in df.iterrows():
      print('NEW ROW', row['Developer'])
      account = self.GetAccount(row['Developer'])
      agreement = self.GetAgreement(row['Number'])
      entry_date = self.ConvertDates(row['Date'])

      try:
        AccountLedger.objects.create(
          entry_date=entry_date,
          created_by=self.user,
          modified_by=self.user,
          account_from=self.lfucg_account,
          account_to=account,
          agreement=agreement,
          entry_type='NEW',
          non_sewer_credits=Decimal(row['Non-Sewer']),
          sewer_credits=Decimal(row['Sewer']),

          roads=0.00,
          sewer_trans=0.00,
          sewer_cap=0.00,
          parks=0.00,
          storm=0.00,
          open_space=0.00,
        )
      except Exception as exc:
        print('LEDGER EXCEPTION', exc)

  def TransferCredits(self, df):
    df['Non-Sewer'] = df['Non-Sewer'].fillna(0.00).astype(float)
    df['Sewer'] = df['Sewer'].fillna(0.00).astype(float)

    for index, row in df.iterrows():
      print('TRANSFER ROW', row['From'])
      account_from = self.GetAccount(row['From'])
      account_to = self.GetAccount(row['To'])
      agreement = self.GetAgreement(row['Number'])
      entry_date = self.ConvertDates(row['Date'])

      try:
        AccountLedger.objects.create(
          entry_date=entry_date,
          created_by=self.user,
          modified_by=self.user,
          account_from=account_from,
          account_to=account_to,
          agreement=agreement,
          entry_type='NEW',
          non_sewer_credits=Decimal(row['Non-Sewer']),
          sewer_credits=Decimal(row['Sewer']),

          roads=0.00,
          sewer_trans=0.00,
          sewer_cap=0.00,
          parks=0.00,
          storm=0.00,
          open_space=0.00,
        )
      except Exception as exc:
        print('LEDGER EXCEPTION', exc)

  def handle(self, *args, **kwargs):
    df_new = pd.read_csv('import_files/new_credits.csv')
    self.AddNewCredits(df_new)

    df_transfer = pd.read_csv('import_files/transfer_credits.csv')
    self.TransferCredits(df_transfer)
