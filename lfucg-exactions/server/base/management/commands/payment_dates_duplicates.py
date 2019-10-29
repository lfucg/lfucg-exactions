from django.core.management import BaseCommand
import pandas as pd
from datetime import datetime

from django.contrib.auth.models import User
from accounts.models import Payment

class Command(BaseCommand):
  def ConvertDates(self, date_field):
    try:
      cleaned_date = str(datetime.strptime(date_field, '%m/%d/%y').strftime('%Y-%m-%d'))
    except Exception as ex:
      print('Date conversion exception', ex)  
      cleaned_date = None

    return cleaned_date

  def UpdatePaymentDates(self, existing_payment, df_row):
    try:
      existing_payment.update(entry_date=self.ConvertDates(df_row['entry_date']))
    except Exception as exc:
      print('Exception updating payment', exc)
      print('Exception updating payment existing payment', existing_payment)
      print('Exception updating payment new payment address', df_row['Address'])

  def SplitMultiplePayents(self, existing_payment, df_row):
    user = User.objects.get(username='IMPORT')

    try:
      existing_payment.update(is_active=False)
    except Exception as exc:
      print('Exception updating payment deactivate', exc)
      print('Exception updating payment deactivate existing payment', existing_payment)
      print('Exception updating payment deactivate new payment address', df_row['Address'])
    
    try:
      Payment.objects.create(
        lot_id=existing_payment.first().lot_id,
        is_approved=True,
        credit_account=existing_payment.first().credit_account,
        credit_source=existing_payment.first().credit_source,
        entry_date=self.ConvertDates(df_row['D_date']),
        created_by=user,
        modified_by=user,
        paid_by=df_row['D_paidby'] if df_row['D_paidby'] is not None else 'Unknown',
        paid_by_type='DEVELOPER' if (df_row['D_paidby'] and df_row['D_paidby'] != 'N/A') else 'OWNER',
        payment_type='CHECK' if df_row['D_chk'] else 'OTHER',
        check_number=df_row['D_chk'],
        paid_roads=df_row['D_Roads'],
        paid_sewer_trans=df_row['D_SewerTransmission'],
        paid_sewer_cap=df_row['D_SewerCapacity'],
        paid_parks=df_row['D_Parks'],
        paid_storm=df_row['D_Stormwater'],
        paid_open_space=df_row['D_OpenSpace'],
      )
    except Exception as exc:
      print('Exception updating payment D payment', exc)
      print('Exception updating payment D payment existing payment', existing_payment)
      print('Exception updating payment D payment new payment address', df_row['Address'])
    
    try:
      Payment.objects.create(
        lot_id=existing_payment.first().lot_id,
        is_approved=True,
        credit_account=existing_payment.first().credit_account,
        credit_source=existing_payment.first().credit_source,
        entry_date=self.ConvertDates(df_row['P_date']),
        created_by=user,
        modified_by=user,
        paid_by=df_row['P_paidby'] if df_row['P_paidby'] is not None else 'Unknown',
        paid_by_type='DEVELOPER' if (df_row['P_paidby'] and df_row['P_paidby'] != 'N/A') else 'OWNER',
        payment_type='CHECK' if df_row['P_chk'] else 'OTHER',
        check_number=df_row['P_chk'],
        paid_roads=df_row['P_Roads'],
        paid_sewer_trans=df_row['P_SewerTransmission'],
        paid_parks=df_row['P_Parks'],
        paid_storm=df_row['P_Stormwater'],
      )
    except Exception as exc:
      print('Exception updating payment P payment', exc)
      print('Exception updating payment P payment existing payment', existing_payment)
      print('Exception updating payment P payment new payment address', df_row['Address'])

  def handle(self, *args, **options):
    # df_dates = pd.read_csv('import_files/payment_entry_date.csv')

    # for index, row in df_dates.iterrows():
    #   print('Entry Date Address', row['Address'])
    #   existing_payment = Payment.objects.filter(lot_id__address_full__icontains=row['Address'])

    #   if existing_payment.exists() and existing_payment.count() == 1:
    #     self.UpdatePaymentDates(existing_payment, row)
    #   else:
    #     print('ERROR EXISTS', existing_payment.exists())
    #     print('ERROR NOT 1', existing_payment.count())
    #     print('ERROR ADDRESS', row['Address'])
    
    df_multiple = pd.read_csv('import_files/payments_multiple.csv')

    df_multiple['D_Roads'] = df_multiple['D_Roads'].fillna(0.00)
    df_multiple['D_SewerTransmission'] = df_multiple['D_SewerTransmission'].fillna(0.00)
    df_multiple['D_SewerCapacity'] = df_multiple['D_SewerCapacity'].fillna(0.00)
    df_multiple['D_Parks'] = df_multiple['D_Parks'].fillna(0.00)
    df_multiple['D_OpenSpace'] = df_multiple['D_OpenSpace'].fillna(0.00)
    df_multiple['D_Stormwater'] = df_multiple['D_Stormwater'].fillna(0.00)

    df_multiple['P_Roads'] = df_multiple['P_Roads'].fillna(0.00)
    df_multiple['P_SewerTransmission'] = df_multiple['P_SewerTransmission'].fillna(0.00)
    df_multiple['P_Parks'] = df_multiple['P_Parks'].fillna(0.00)
    df_multiple['P_Stormwater'] = df_multiple['P_Stormwater'].fillna(0.00)

    df_multiple['D_paidby'] = df_multiple['D_paidby'].fillna('Unknown')
    df_multiple['P_paidby'] = df_multiple['P_paidby'].fillna('Unknown')

    for index, row in df_multiple.iterrows():
      print('Multiple Payments Address', row['Address'])
      existing_payment = Payment.objects.filter(lot_id__address_full__icontains=row['Address'])

      if existing_payment.exists() and existing_payment.count() == 1:
        self.SplitMultiplePayents(existing_payment, row)
      else:
        for payment in existing_payment:
          if payment != existing_payment.first():
            print('PAYMENT TO DELETE', payment.lot_id.address_full)
            payment.delete()
          else:
            print('FIRST ', payment.lot_id.address_full)
            self.SplitMultiplePayents(existing_payment, row)
  
# ./manage.py shell_plus
# ./manage.py payment_dates_duplicates