from django.core.management import BaseCommand
import pandas as pd
from datetime import datetime

from accounts.models import Payment
from plats.models import Lot

class Command(BaseCommand):
  def UpdatePayment(self, existing_payment, df_row):
    try:
      Payment.objects.filter(
        lot_id__address_full__icontains=df_row['COMBINE ST & NAME']
      ).update(
        date_modified=datetime.today(),
        paid_roads=df_row['Roads'],
        paid_sewer_trans=df_row['SewerTransmission'],
        paid_sewer_cap=df_row['SewerCapacity'],
        paid_parks=df_row['Parks'],
        paid_open_space=df_row['OpenSpace'],
        paid_storm=df_row['Stormwater'],
      )
    except Exception as exc:
      print('Exception updating payment', exc)
      print('Exception updating payment existing payment', existing_payment)
      print('Exception updating payment new payment address', df_row['COMBINE ST & NAME'])

  def handle(self, *args, **options):
    df = pd.read_csv('payment_updates.csv')

    df['Roads'] = df['Roads'].fillna(0.00)
    df['SewerTransmission'] = df['SewerTransmission'].fillna(0.00)
    df['SewerCapacity'] = df['SewerCapacity'].fillna(0.00)
    df['Parks'] = df['Parks'].fillna(0.00)
    df['OpenSpace'] = df['OpenSpace'].fillna(0.00)
    df['Stormwater'] = df['Stormwater'].fillna(0.00)

    for index, row in df.iterrows():
      existing_payment = Payment.objects.filter(lot_id__address_full__icontains=row['COMBINE ST & NAME'])

      if existing_payment.exists() and existing_payment.count() == 1:
        payment = existing_payment
        self.UpdatePayment(payment, row)
      else:
        for payment in existing_payment:
          if payment == existing_payment.first():
            self.UpdatePayment(payment, row)
          else:
            payment.delete()

# ./manage.py shell_plus
# ./manage.py payment_import_resolutions
