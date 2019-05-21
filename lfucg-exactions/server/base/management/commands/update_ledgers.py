from django.core.management import BaseCommand
import pandas as pd
import numpy as np
from datetime import datetime
from decimal import Decimal

from django.contrib.auth.models import User
from accounts.models import Account, AccountLedger, Agreement
from plats.models import Lot, Plat

class Command(BaseCommand):
  user = User.objects.get(username='IMPORT')
  lfucg_account = Account.objects.filter(account_name='Lexington Fayette Urban County Government (LFUCG)').first()

  def ConvertDates(self, date_field):
  
    try:
      cleaned_date = str(datetime.strptime(date_field, '%m-%d-%y').strftime('%-m/%-d/%Y'))
    except Exception as ex:
      print('Date conversion exception', ex)  
      cleaned_date = None

    return cleaned_date

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
    else:
      print('NO Lot', address)

    return return_lot.first() if return_lot else None
  
  def GetLedgerPlat(self, plat):
    return_plat = None
    split_dash = plat.split('-')
    cabinet = split_dash[0]
    # print('cabinet', cabinet)
    slide = split_dash[1] if len(split_dash) > 1 else ' '
    # print('slide', slide)
    if plat == 'DP2013-64':
      cabinet = 'DP'
      slide = '2013-64'
    elif plat == 'DP 13-65':
      cabinet = 'DP'
      slide = '13-65'

    plat_obj = Plat.objects.filter(
      cabinet=cabinet, slide=slide
    )

    return plat_obj.first()

  def GetLedgerAgreement(self, agree_string, plat):
    return_agreement = None
    agreement_type = 'MEMO' if 'MEMO' in agree_string else 'RESOLUTION'
    resolution_number = agree_string.replace(
      'NSWR', '').replace('SWR', ''
    ).replace(
      ' ', '').replace('&', ''
    ).replace('RES', '').replace('MEMO', '')
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

    return return_agreement.first() if return_agreement else None

  def GetCreditValues(self, row, credit_type):
    roads = row['Roads'] if 'non' in credit_type else 0.00
    sewer_trans = row['SewerTransmission'] if 'sewer' in credit_type else 0.00
    sewer_cap = row['SewerCapacity'] if 'sewer' in credit_type else 0.00
    parks = row['Parks'] if 'non' in credit_type else 0.00
    open_space = row['OpenSpace'] if 'non' in credit_type else 0.00
    stormwater = row['Stormwater'] if 'non' in credit_type else 0.00
    
    sewer = round(Decimal(sewer_trans) + Decimal(sewer_cap), 2)
    non_sewer = round(Decimal(roads) + Decimal(parks) + Decimal(open_space) + Decimal(stormwater), 2)

    credit_values = {
      'sewer': sewer,
      'non_sewer': non_sewer,
      'roads': roads,
      'sewer_trans': sewer_trans,
      'sewer_cap': sewer_cap,
      'parks': parks,
      'open_space': open_space,
      'stormwater': stormwater,
    }

    return credit_values

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

      credit_type = ''
      if 'NSWR' in res or 'SWR' in res:
        credit_type = 'non' if 'NSWR' in res else 'sewer'
      else:
        credit_type = 'sewer&non'
      credit_values = self.GetCreditValues(row, credit_type)

      res_results.append({
        'agreement': agreement,
        'credit_values': credit_values,
      })
    elif ';' in res:
      semicolon_split = res.split(';')

      for split in semicolon_split:
        # print('SPLIT BY SEMICOLON', split)
        agreement = self.GetLedgerAgreement(split, plat)

        credit_type = 'non' if 'NSWR' in split else 'sewer'
        credit_values = self.GetCreditValues(row, credit_type)

        res_results.append({
          'agreement': agreement,
          'credit_values': credit_values,
        })
    else:
      print('Other RES format', res)
    
    return res_results
  
  def UpdateLedger(self, ledger_data):
    ledger = AccountLedger.objects.filter(
      lot=ledger_data['lot'],
      agreement=ledger_data['agreement'],
    )

    ledger.update(
      sewer_credits = ledger_data['credits']['sewer'],
      non_sewer_credits = ledger_data['credits']['non_sewer'],
      sewer_trans = ledger_data['credits']['sewer_trans'],
      sewer_cap = Decimal(ledger_data['credits']['sewer_cap']),
      roads = ledger_data['credits']['roads'],
      parks = ledger_data['credits']['parks'],
      open_space = ledger_data['credits']['open_space'],
      storm = ledger_data['credits']['stormwater'],
    )

  def handle(self, *args, **options):
    # df_update = pd.read_csv('ledgers_to_update.csv')
    df_update = pd.read_csv('plat_ledgers_to_update.csv')

    df_update['Roads'] = df_update['Roads'].fillna(0.00)
    df_update['SewerTransmission'] = df_update['SewerTransmission'].fillna(0.00)
    df_update['SewerCapacity'] = df_update['SewerCapacity'].fillna(0.00)
    df_update['Parks'] = df_update['Parks'].fillna(0.00)
    df_update['OpenSpace'] = df_update['OpenSpace'].fillna(0.00)
    df_update['Stormwater'] = df_update['Stormwater'].fillna(0.00)

    for index, row in df_update.iterrows():
      lot = self.GetLedgerLot(row['Address'])
      plat = self.GetLedgerPlat(row['PLAT'])
      if plat:
        account = plat.account
        agreements_and_credits = self.ResEvaluation(row, plat)
        print('Lot to update', lot)

        if agreements_and_credits is not None:
          for agreement_set in agreements_and_credits:
            ledger_data = {
              'lot': lot,
              'account': account,
              'agreement': agreement_set['agreement'],
              'credits': agreement_set['credit_values'],
            }

            self.UpdateLedger(ledger_data)
        else:
          print('No agreements and credits', lot)
      else:
        print('No plat', row['PLAT'])
