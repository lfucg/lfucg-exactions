from django.core.management import BaseCommand
import pandas as pd
from datetime import datetime
from decimal import Decimal

from django.contrib.auth.models import User
from accounts.models import AccountLedger, Agreement, Account
from plats.models import Lot, Plat

class Command(BaseCommand):
  def ConvertDates(self, date_field):

    try:
      cleaned_date = str(datetime.strptime(date_field, '%m-%d-%y').strftime('%-m/%-d/%Y'))
    except Exception as ex:
      print('Date conversion exception', ex)  
      cleaned_date = None

    return cleaned_date

  def DeleteExtraLedgers(self, df):
    for index, row in df.iterrows():
      AccountLedger.objects.filter(
        lot__address_full__icontains=row['Address']
      ).delete()

  def GetLedgerLot(self, address):
    return_lot = None
    lot = Lot.objects.filter(
      address_full__icontains=address
    )

    if lot.count() == 1:
      return_lot = lot
    elif lot.count() > 1:
      print('Multiple lots returned for address', address)
    elif lot.count() == 0:
      if '-' in address:
        split_space = address.split(' ')
        split_dash = split_space[0].split('-')
        new_address = address.replace('-' + split_dash[1], '')

        split_lot = Lot.objects.filter(
          address_full__icontains=new_address
        ).filter(
          address_full__icontains=split_dash[1]
        )

        return_lot = split_lot

    return return_lot.first()
  
  def GetLedgerPlat(self, plat):
    return_plat = None
    split_dash = plat.split('-')
    cabinet = split_dash[0]
    slide = split_dash[1] if len(split_dash) > 1 else ' '
    if plat == 'DP2013-64':
      cabinet = 'DP'
      slide = '2013-64'

    plat_obj = Plat.objects.filter(
      cabinet=cabinet, slide=slide
    )

    return plat_obj.first()

  def GetLedgerAgreement(self, agree_string, plat):
    return_agreement = None
    agreement_type = 'MEMO' if 'MEMO' in agree_string else 'RESOLUTION'
    resolution_number = agree_string.replace('NSWR', '').replace('SWR', '').replace(' ', '').replace('&', '').replace('RES', '').replace('MEMO', '')
    if len(resolution_number.split('-')) == 3:
      resolution_number = self.ConvertDates(resolution_number)

    agreement = Agreement.objects.filter(
      agreement_type=agreement_type,
      resolution_number=resolution_number,
    )

    if agreement.count() == 1:
      return_agreement = agreement
    elif agreement.count() > 1:
      expansion_area = plat.expansion_area

      return_agreement = Agreement.objects.filter(
        agreement_type=agreement_type,
        resolution_number=resolution_number,
        expansion_area=expansion_area
      )
    else:
      print('Zero agreements', resolution_number)

    return return_agreement.first()

  def GetCreditValues(self, row, credit_type):
    roads = row['Roads'] if 'non' in credit_type else 0.00
    sewer_trans = row['SewerTransmission'] if 'sewer' in credit_type else 0.00
    sewer_cap = row['SewerCapacity'] if 'sewer' in credit_type else 0.00
    parks = row['Parks'] if 'non' in credit_type else 0.00
    open_space = row['OpenSpace'] if 'non' in credit_type else 0.00
    stormwater = row['Stormwater'] if 'non' in credit_type else 0.00
    
    sewer = Decimal(sewer_trans) + Decimal(sewer_cap)
    non_sewer = Decimal(roads) + Decimal(parks) + Decimal(open_space) + Decimal(stormwater)

    return {
      'sewer': sewer,
      'non_sewer': non_sewer,
      'roads': roads,
      'sewer_trans': sewer_trans,
      'sewer_cap': sewer_cap,
      'parks': parks,
      'open_space': open_space,
      'stormwater': stormwater,
    }

  def ResEvaluation(self, row, plat):
    res = row['RES']
    res_results = []

    if '&' in res:
      agreement = self.GetLedgerAgreement(res, plat)

      credit_type = 'sewer&non'
      credit_values = self.GetCreditValues(row, credit_type)

      res_results.append({
        'agreement': agreement,
        'credit_values': credit_values,
      })
    elif ';' not in res:
      agreement = self.GetLedgerAgreement(res, plat)

      credit_type = 'non' if 'NSWR' in res else 'sewer'
      credit_values = self.GetCreditValues(row, credit_type)

      res_results.append({
        'agreement': agreement,
        'credit_values': credit_values,
      })
    elif ';' in res:
      semicolon_split = res.split(';')

      for split in semicolon_split:
        agreement = self.GetLedgerAgreement(split, plat)

        credit_type = 'non' if 'NSWR' in split else 'sewer'
        credit_values = self.GetCreditValues(row, credit_type)

        res_results.append({
          'agreement': agreement,
          'credit_values': credit_values,
        })
    return res_results
  
  def CreateNewLedger(self, ledger_data):
    user = User.objects.get(username='IMPORT')
    lfucg_account = Account.objects.filter(account_name='Lexington Fayette Urban County Government (LFUCG)').first()

    try:
      AccountLedger.objects.create(
        entry_date=datetime.today(),
        created_by=user,
        modified_by=user,
        account_from=ledger_data['account'],
        account_to=lfucg_account,
        lot=ledger_data['lot'],
        agreement=ledger_data['agreement'],
        entry_type='USE',
        non_sewer_credits=ledger_data['credits']['non_sewer'],
        sewer_credits=ledger_data['credits']['sewer'],

        roads=ledger_data['credits']['roads'],
        sewer_trans=ledger_data['credits']['sewer_trans'],
        sewer_cap=ledger_data['credits']['sewer_cap'],
        parks=ledger_data['credits']['parks'],
        storm=ledger_data['credits']['stormwater'],
        open_space=ledger_data['credits']['open_space'],
      )
    except Exception as ex:
      print('Ledger creation exception', ex)

  def AddNewLedgers(self, df):
    df['Roads'] = df['Roads'].fillna(0.00)
    df['SewerTransmission'] = df['SewerTransmission'].fillna(0.00)
    df['SewerCapacity'] = df['SewerCapacity'].fillna(0.00)
    df['Parks'] = df['Parks'].fillna(0.00)
    df['OpenSpace'] = df['OpenSpace'].fillna(0.00)
    df['Stormwater'] = df['Stormwater'].fillna(0.00)

    for index, row in df.iterrows():
      lot = self.GetLedgerLot(row['Address'])
      plat = self.GetLedgerPlat(row['PLAT'])
      account = plat.account
      agreements_and_credits = self.ResEvaluation(row, plat)

      for agreement_set in agreements_and_credits:
        ledger_data = {
          'lot': lot,
          'account': account,
          'agreement': agreement_set['agreement'],
          'credits': agreement_set['credit_values'],
        }

        self.CreateNewLedger(ledger_data)

  def handle(self, *args, **options):
    df_to_delete = pd.read_csv('import_files/ledgers_to_delete.csv')
    self.DeleteExtraLedgers(df_to_delete)

    df_to_add = pd.read_csv('import_files/ledgers_to_add.csv')
    self.AddNewLedgers(df_to_add)

# ./manage.py shell_plus
# ./manage.py ledger_add_delete_resolution
