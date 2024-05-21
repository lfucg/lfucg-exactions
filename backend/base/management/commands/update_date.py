from django.core.management import BaseCommand
from accounts.models import AccountLedger, Payment
import csv
from datetime import datetime

class Command(BaseCommand):
  help = "Updates dates to those found in historical data"

  def add_arguments(self, parser):
    parser.add_argument('filename')

  def ConvertDates(self, date_field):
    try:
      cleaned_date = datetime.strptime(date_field.split(' ')[0], '%m/%d/%y')
    except:
      try:
        cleaned_date = datetime.strptime(date_field.split(' ')[0], '%m/%d/%Y')
      except Exception as ex:
        print('Date Creation Error', ex)
        cleaned_date = None
    
    return cleaned_date

  def UpdateLedgerDates(self, ledger, date_options_list):
    if date_options_list[0] and date_options_list[0] != 'NULL':
      converted_date = self.ConvertDates(date_options_list[0])
    elif date_options_list[1] and date_options_list[1] != 'NULL':
      converted_date = self.ConvertDates(date_options_list[1])
    else:
      converted_date = self.ConvertDates('1/1/1970')
    
    ledger.date_created=converted_date
    ledger.entry_date=converted_date

    ledger.save()

  def UpdatePaymentDates(self, payment, date_options_list):
    if date_options_list[0] and date_options_list[0] != 'NULL':
      converted_date = self.ConvertDates(date_options_list[0])
    elif date_options_list[1] and date_options_list[1] != 'NULL':
      converted_date = self.ConvertDates(date_options_list[1])
    else:
      converted_date = self.ConvertDates('1/1/1970')
    
    payment.date_created=converted_date

    payment.save()

  def handle(self, *args, **options):
    filename = options.get('filename', None)

    if filename is None:
      self.stdout.write('Please specify import file name.')
      return

    with open(filename) as file:
      reader = csv.DictReader(file)

      for row in reader:
        if '-' in row['StreetNo']:
          number_parts = row['StreetNo'].split('-')
          address_number = number_parts[0]
        else:
          address_number = row['StreetNo']

        street = row['StreetName']

        ledger_lots = AccountLedger.objects.filter(lot__address_street=street, lot__address_number=address_number)
        payment_lots = Payment.objects.filter(lot_id__address_street=street,lot_id__address_number=address_number)

        if ledger_lots is not None:
          for ledger in ledger_lots:
            print('Ledger ID to update', ledger.id)
            if ledger.agreement.resolution_number == row['AccountLedgerAgreement-3']:
              self.UpdateLedgerDates(ledger, [row['EntryDate-3'], row['D_DatePaid']])
            elif ledger.agreement.resolution_number == row['AccountLedgerAgreement-2']:
              self.UpdateLedgerDates(ledger, [row['EntryDate-2'], row['D_DatePaid']])
            elif ledger.agreement.resolution_number == row['AccountLedgerAgreement-1']:
              self.UpdateLedgerDates(ledger, [row['EntryDate-1'], row['D_DatePaid']])
            elif row['D_DatePaid'] and row['D_DatePaid'] != 'NULL':
              self.UpdateLedgerDates(ledger, [row['D_DatePaid'], row['P_DatePaid']])
            else:
              self.UpdateLedgerDates(ledger, [row['P_DatePaid'], '1/1/1970'])

        if payment_lots is not None:
          for payment in payment_lots:
            print('Payment ID to update', payment.id)
            if row['D_DatePaid'] and row['D_DatePaid'] != 'NULL':
              self.UpdatePaymentDates(payment, [row['D_DatePaid'], row['P_DatePaid']])
            else:
              self.UpdatePaymentDates(payment, [row['P_DatePaid'], row['EntryDate-1']])

# To run in terminal: 
# ./manage.py update_date lot_data.csv