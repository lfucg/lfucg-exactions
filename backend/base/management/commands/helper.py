import datetime
from decimal import Decimal

from django.contrib.auth.models import User
from accounts.models import Account, AccountLedger, Agreement
from plats.models import Lot, Plat

def ConvertDates(date_field):
  
  try:
    cleaned_date = str(datetime.datetime.strptime(date_field, '%m-%d-%y').strftime('%-m/%-d/%Y'))
  except Exception as ex:
    print('Date conversion exception', ex)  
    cleaned_date = None

  return cleaned_date

def GetLedgerLot(address):
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

  