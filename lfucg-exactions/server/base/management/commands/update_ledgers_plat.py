from django.core.management import BaseCommand
import pandas as pd
import numpy as np
from datetime import datetime
from decimal import Decimal

from django.contrib.auth.models import User
from accounts.models import Account, AccountLedger, Agreement, Payment
from plats.models import Lot, Plat

class Command(BaseCommand):
  paid_by = {
    'Artique Custom Homes': 'Artique Custom Homes, LLC',
    'Artique Custom Homes ': 'Artique Custom Homes, LLC',
    'ARTIQUE CUSTOM HOMES LLC': 'Artique Custom Homes, LLC',
    'Artique Custom Homes, LLC': 'Artique Custom Homes, LLC',
    'Artique Custom Homes, LLC': 'Artique Custom Homes, LLC',
    'Bryant Road LLC': 'Bryant Road, LLC',
    'Bryant Road, LLC': 'Bryant Road, LLC',
    'Bryant Road, LLC - James McKee': 'Bryant Road, LLC',
    'Byer Homes': 'Byer Homes',
    'Crystal Foster   (Main Street Homes)': 'Main Street Homes',
    'Daniel J. Wahl': 'Wahl Builders',
    'James T. Nash Builders': 'James T. Nash Builders, Inc.',
    'Jimmy Nash': 'Jimmy Nash Homes',
    'Jimmy Nash Homes': 'Jimmy Nash Homes',
    'JJK Thomas': 'JJK Thomas',
    'Joe Hacker': 'Joe Hacker',
    'JTN Homes, Inc.': 'JTN Homes, Inc.',
    'Mac Building & Remodeling': 'Mac Building & Remodeling',
    'Main Street Homes': 'Main Street Homes',
    'Mark A. Maddox': 'Mark A. Maddox',
    'McBrayer, McGinnis, Leslie & Kirkland': 'McBrayer, McGinnis, Leslie & Kirkland',
    'McGinnis Homes': 'McGinnis Homes',
    'McKee Builders, Inc.': 'McKee Builders, Inc.',
    'McKee Builders, Inc.  McKee Builders': 'McKee Builders, Inc.',
    'Michael and Susan   Thomas': 'Michael and Susan   Thomas',
    'Nash': 'James T. Nash Builders, Inc.',
    'Nathan Cornett': 'Nathan Cornett',
    'Pickett Development Corporation': 'Pickett Development Corporation',
    'Pickett Homes': 'Pickett Homes',
    'Polo Club Assoc, LLC': 'Polo Club Assoc, LLC',
    'Winters': 'Winters',
    'LFUCG': 'Lexington Fayette Urban County Government (LFUCG)',
    'Ball Homes LLC': 'Ball Homes, LLC',
    'Ball Homes, Inc.': 'Ball Homes, LLC',
    'Deerhaven Property , LLC.': 'Deer Haven Properties, LLC',
    'A & B': 'A & B',
    'A & E': 'A & E Homes',
    'A & E Homes': 'A & E Homes',
    'A J K LLC': 'A-JK LLC',
    'AJK LLC': 'A-JK LLC',
    'A-JK LLC': 'A-JK LLC',
    'A-JK, LLC  1814 Lakehill Drive  Lexington, KY  40502': 'A-JK LLC',
    'Anderson': 'Anderson',
    'Anderson-Raysey, LLC': 'Anderson-Raysey, LLC',
    'ARTIQUE': 'Artique Custom Homes LLC',
    'Artique': 'Artique Custom Homes LLC',
    'Artique Custom': 'Artique Custom Homes LLC',
    'ARTIQUE CUSTOM HOMES': 'Artique Custom Homes LLC',
    'Artique Custom Homes LLC': 'Artique Custom Homes LLC',
    'Artique...': 'Artique Custom Homes LLC',
    'Atkins Homes': 'Atkins Homes LLC',
    'Atkins Homes LLC': 'Atkins Homes LLC',
    'Atkinss Homes': 'Atkins Homes LLC',
    'Ball': 'Ball Homes, LLC',
    'Ball - Bryant': 'Ball-Bryant, LLC',
    'Ball Home': 'Ball Homes, LLC',
    'Ball Homes': 'Ball Homes, LLC',
    'Ball homes': 'Ball Homes, LLC',
    'ball homes': 'Ball Homes, LLC',
    'Ball Homes inc.': 'Ball Homes, LLC',
    'Ball Homes Inc.': 'Ball Homes, LLC',
    'Ball homes LLC': 'Ball Homes, LLC',
    'Ball Homes, INC>': 'Ball Homes, LLC',
    'Ball Homes, LLC': 'Ball Homes, LLC',
    'Ball Homes158877': 'Ball Homes, LLC',
    'Ball Homesbbbbb17': 'Ball Homes, LLC',
    'Ball-Bryant LLC': 'Ball-Bryant, LLC',
    'Ball-Bryant, LLC': 'Ball-Bryant, LLC',
    'Barlow Homes': 'Barlow Homes',
    'Beazer': 'Beazer Homes Corp.',
    'Beazer Homes': 'Beazer Homes Corp.',
    'Beazer Homes Corp': 'Beazer Homes Corp.',
    'Beazer Homes Corp.': 'Beazer Homes Corp.',
    'Botts & Cravens': 'Botts & Cravens',
    'Briggs': 'The Briggs Company',
    'BRIGGS': 'The Briggs Company',
    'Briggs Co.': 'The Briggs Company',
    'Briggs Company': 'The Briggs Company',
    'Brown Homes LLC': 'Brown Homes LLC',
    'Bryant Road, LLC': 'Bryant Road, LLC',
    'By Design Homes': 'By Design Homes',
    'Cabelas`': 'Cabelas`',
    'Cameron S. Hill & Colleen M. Hill (real estate closing)': 'Cameron S. Hill & Colleen M. Hill (real estate closing)',
    'Campbell Atkins': 'Campbell Atkins',
    'Clark   Walnut Hill Properties': 'Walnut Hill Properties, LLC',
    'Clark   Walnut-Hill Properties': 'Walnut Hill Properties, LLC',
    'Clark  Walmut-Hill Properties': 'Walnut Hill Properties, LLC',
    'Clark  Walnut Hill Properties': 'Walnut Hill Properties, LLC',
    'Clark - Walnut Hill Properties': 'Walnut Hill Properties, LLC',
    'Clark - Walnut Hill Properties, LLC': 'Walnut Hill Properties, LLC',
    'Clark  Walnut-Hill Properties': 'Walnut Hill Properties, LLC',
    'Clark  Walnut-hill Properties': 'Walnut Hill Properties, LLC',
    'Clark  Walnut-Hill properties': 'Walnut Hill Properties, LLC',
    'Clark Property': 'Clark Property',
    'Clark Walnut-Hill Properties': 'Walnut Hill Properties, LLC',
    'Clarke Property': 'Clark Property',
    'CMH Parks Inc.': 'CMH Parks, Inc.',
    'CMH Parks, Inc.': 'CMH Parks, Inc.',
    'Commonwealth': 'Commonwealth',
    'Commonwealth Design': 'Commonwealth Designs, Inc.',
    'Commonwealth Designs': 'Commonwealth Designs, Inc.',
    'Commonwealth Designs, Inc': 'Commonwealth Designs, Inc.',
    'commonwealth designs, inc': 'Commonwealth Designs, Inc.',
    'Commonwealth Designs, Inc.': 'Commonwealth Designs, Inc.',
    'Commonwealth Development': 'Commonwealth Development Company',
    'Commonwealth Development Co': 'Commonwealth Development Company',
    'Commonwealth Development Company': 'Commonwealth Development Company',
    'Commwealth': 'Commonwealth',
    'COSTCO': 'COSTCO',
    'Cravens': 'Cravens Homebuilders',
    'Cravens Homebuilders': 'Cravens Homebuilders',
    'Crossroads Christian Church': 'Crossroads Christian Church',
    'D B Homes': 'DB Homes, LLC',
    'D. Briggs': 'The Briggs Company',
    'Dailey Homes, LLC': 'Dailey Homes, LLC',
    'DB Homes': 'DB Homes, LLC',
    'DB Homes LLC': 'DB Homes, LLC',
    'db homes llc': 'DB Homes, LLC',
    'DB Homes, LLC': 'DB Homes, LLC',
    'Delong Estates Development , LLC': 'Delong Estates Development, LLC',
    'Delong Estates Development, LLC': 'Delong Estates Development, LLC',
    'Design Homes': 'Design Homes',
    'Doug Keeling': 'Doug Keeling',
    'EA2C Boulevard': 'EA2C Boulevard',
    'EA2C Stormwarer Management Facilities': 'EA2C Stormwarer Management Facilities',
    'Ed Sarfo': 'Ed Sarfo, LLC',
    'Ed Sarfo LLC': 'Ed Sarfo, LLC',
    'ED Sarfo LLC': 'Ed Sarfo, LLC',
    'Ed Sarfo, LLC': 'Ed Sarfo, LLC',
    'Edin Mulalic  DBA A and E Home Improvement Co.': 'Edin Mulalic  DBA A and E Home Improvement Co.',
    'Eirecon': 'Eirecon Construction, LLC',
    'Eirecon Construction': 'Eirecon Construction, LLC',
    'Eirecon Construction, LLC': 'Eirecon Construction, LLC',
    'Eirecon LLC': 'Eirecon Construction, LLC',
    'Eirecon, LLC': 'Eirecon Construction, LLC',
    'Eireecon Construction': 'Eirecon Construction, LLC',
    'Eireeon Construction': 'Eirecon Construction, LLC',
    'Expansion Area Development': 'Expansion Area Development',
    'Farm Credit Mid America': 'Farm Credit Mid America',
    'First Federal Bank': 'First Federal Bank',
    'GAC INC.': 'GAC INC.',
    'Gale Properties': 'Gale Properties',
    'Gatewood Arnold': 'Gatewood Arnold',
    'Generations': 'Generations',
    'Harmony': 'Harmony',
    'Hays Boulevard': 'Hays Boulevard Res',
    'Hays Boulevard Res': 'Hays Boulevard Res',
    'HBA of Lexington': 'HBA of Lexington',
    'Holbrook And': 'Holbrook And',
    'Homes By': 'Homes by reckelhoff',
    'Homes by reckelhoff': 'Homes by reckelhoff',
    'J & G Builders': 'J & G Builders',
    'J H T': 'J H T',
    'J L T': 'J L T',
    'J Moore': 'J Moore Homes, Inc.',
    'J Moore Homes': 'J Moore Homes, Inc.',
    'J Moore Homes, Inc.': 'J Moore Homes, Inc.',
    'J. Barlow': 'J. Barlow',
    'J. Moore Homes': 'J Moore Homes, Inc.',
    'J. Moore Homes, Inc.': 'J Moore Homes, Inc.',
    'J. Nash Homes': 'Jimmy Nash Homes',
    'Jacobson Park Sewer': 'Jacobson Park Sewer',
    'Jacobson Trunk Sewer': 'Jacobson Trunk Sewer',
    'James Ernst': 'James Ernst',
    'James Monroe': 'James Monroe',
    'James Nash': 'James T. Nash Builders, Inc.',
    'James T. Nash': 'James T. Nash Builders, Inc.',
    'Jeff Taylor': 'Jeff Taylor',
    'jimmy nash': 'James T. Nash Builders, Inc.',
    'JIMMY NASH': 'James T. Nash Builders, Inc.',
    'Jimmy nash': 'James T. Nash Builders, Inc.',
    'Jimmy Nash Bldg.': 'James T. Nash Builders, Inc.',
    'JIMMY NASH HOMES': 'Jimmy Nash Homes',
    'Jimmy Nash homes': 'Jimmy Nash Homes',
    'Jimmy Niash': 'James T. Nash Builders, Inc.',
    'JJK - Thomas': 'JJK - Thomas, LLC',
    'JJK - Thomas LLC': 'JJK - Thomas, LLC',
    'JJK - Thomas, LLC': 'JJK - Thomas, LLC',
    'JJK & G, LLC': 'JJK & G, LLC',
    'JJK -THOMAS LLC': 'JJK - Thomas, LLC',
    'JJK THOMAS LLC> REC"D in BLDG INSP': 'JJK - Thomas, LLC',
    'JJK-Thomas LLC': 'JJK - Thomas, LLC',
    'JLT': 'JLT Construction',
    'JLT Construction': 'JLT Construction',
    'John Barlow': 'John Barlow',
    'John Skip Thomas': 'John Skip Thomas',
    'Jon Byer Builder': 'Jon Byer Builder',
    'Josh Elam': 'Josh Elam',
    'JPM': 'JPM',
    'Justice Builders': 'Justice Builders',
    'Justin Moore': 'Justin Moore',
    'Keeling': 'Keeling Classic',
    'Keeling Classic': 'Keeling Classic',
    'Kerwin': 'Kerwin Custom Homes',
    'Kerwin Construction': 'Kerwin Custom Homes',
    'KERWIN CUSTOM HOMES': 'Kerwin Custom Homes',
    'Kevin P. Smith': 'Kevin P. Smith',
    'KRMD LLC': 'KRMD LLC',
    'L & C': 'L & C',
    'Lansdale': 'Lansdale',
    'Lauren Geiger': 'Lauren Geiger',
    'LDG Development, LLC': 'LDG Development, LLC',
    'Logan Builders': 'Logan Builders',
    'M  & M Property': 'M & M Property',
    'M & L': 'M & L Development',
    'M & L Dev': 'M & L Development',
    'M & L Deve': 'M & L Development',
    'M & L Development': 'M & L Development',
    'M & M': 'M & M Property',
    'M & M Property': 'M & M Property',
    'M L Development': 'M & L Development',
    'Main Street Home': 'Main Street Home',
    'Marian Clark - Walnut Hill Prop.': 'Walnut Hill Properties',
    'Marian Clark - Walnut Hill Properties': 'Walnut Hill Properties',
    'Marion Clark': 'Walnut Hill Properties',
    'Marlinrob, Inc.': 'Marlinrob, Inc.',
    'McCarty': 'McCarty',
    'McKee Builders': 'McKee Builders',
    'Medora Developors': 'Medora Developors',
    'Michael': 'Michael',
    'Mike Kerwin': 'Mike Kerwin Custom Homes',
    'MIKE KERWIN CUSTOM HOMES': 'Mike Kerwin Custom Homes',
    'Mira Ball': 'Mira Ball',
    'MM Prop': 'MM Prop',
    'Mp Homes LLC': 'Mp Homes LLC',
    'Mulberry': 'Mulberry Builders',
    'Mulberry Builders': 'Mulberry Builders',
    'Murphy & Clendenen, PLLC': 'Murphy & Clendenen, PLLC',
    'NASH': 'Nash Builders',
    'Nash Builders': 'Nash Builders',
    'New Market Property': 'New Market Property',
    'North Fork Land Co. LLC': 'North Fork Land Co. LLC',
    'North Forty Properties, LLC': 'North Forty Properties, LLC',
    'North Lexington Church of Christ': 'North Lexington Church of Christ',
    'Oatlands Park': 'Oatlands Park',
    'Paid by Ed Sarfo': 'Ed Sarfo, LLC',
    'Paul & Chandria Karpecki': 'Paul & Chandria Karpecki',
    'Phelps Detention Basins': 'Phelps Detention Basins',
    'Pickett Development Corp., Inc.': 'Pickett Development Corp., Inc.',
    'Polo Club Assoc, LC': 'Polo Club Assoc, LC',
    'Polo Club Blvd': 'Polo Club Blvd',
    'Portrait': 'Portrait Homes',
    'Portrait Homes': 'Portrait Homes',
    'QPH': 'Quality Plus Homes',
    'Quality Plus': 'Quality Plus Homes',
    'Quality Plus Homes': 'Quality Plus Homes',
    'Qunlity Plus Homes': 'Quality Plus Homes',
    'Real KY, Inc.': 'Real KY, Inc.',
    'Reserve at Greenbrier, LLC': 'Reserve at Greenbrier, LLC',
    'Richard V. Murphy, plc': 'Richard V. Murphy, plc',
    'Rob Marlin': 'Rob Marlin',
    'Russell Mounce': 'Russell Mounce',
    'Savannah Lane': 'Savannah Lane',
    'Scottsdale': 'Scottsdale',
    'Shady Hills': 'Shady Hills Development',
    'Shady Hills Development': 'Shady Hills Development',
    'Shady Hills Devp.': 'Shady Hills Development',
    'Sikura - Justice': 'Sikura - Justice',
    'Silverstar': 'Silverstar',
    'Smith Companies': 'Smith Companies',
    'Southern Luxury': 'Southern Luxury Homes',
    'Southern Luxury Homes': 'Southern Luxury Homes',
    'Stephen Mulligan, Finance': 'Stephen Mulligan, Finance',
    'Sunshine': 'Sunshine Properties',
    'Sunshine Properties': 'Sunshine Properties',
    'System Improvement Design and Construction': 'System Improvement Design and Construction',
    'System Improvement Design and Construction Memorandum': 'System Improvement Design and Construction',
    'T Brown': 'T Brown',
    'Ted Hundley': 'Ted Hundley',
    'Ted Kissinger Const. Inc.': 'Ted Kissinger Const. Inc.',
    'Terry Brown': 'Terry Brown',
    'The Briggs': 'The Briggs Company',
    'the Briggs': 'The Briggs Company',
    'The Briggs Company': 'The Briggs Company',
    'Thomas Communication, Inc.': 'Thomas Communication, Inc.',
    'Via Vitae': 'Via Vitae',
    'Village Green': 'Village Green',
    'Wahl Builders': 'Wahl Builders',
    'Webb Beatty': 'Webb-Beatty Homes',
    'Webb- Beatty': 'Webb-Beatty Homes',
    'Webb, Hoskins, Glover & Thompson PSC': 'Webb, Hoskins, Glover & Thompson PSC',
    'Webb-Beatty': 'Webb-Beatty Homes',
    'Webb-Beatty Homes': 'Webb-Beatty Homes',
    'White/Reach LLC': 'White/Reach LLC',
    'Woodson, Hobson & Fulton  (Steve Ruschell)': 'Woodward, Hobson, & Fulton  (Steve Ruschell)',
    'Woodson, Hobson, & Fulton  (Steve Ruschell)': 'Woodward, Hobson, & Fulton  (Steve Ruschell)',
    'Woodward, Hobson & Foley  (Steve Ruschell)': 'Woodward, Hobson, & Fulton  (Steve Ruschell)',
    'Woodward, Hobson & Fulton   (Steve Ruschell)': 'Woodward, Hobson, & Fulton  (Steve Ruschell)',
    'Woodward, Hobson & Fulton  (Steve Ruschell)': 'Woodward, Hobson, & Fulton  (Steve Ruschell)',
    'Woodward, Hobson, & Foley  (Steve Ruschell)': 'Woodward, Hobson, & Fulton  (Steve Ruschell)',
    'Woodward, Hobson, & Fulton   (Steve Ruschell)': 'Woodward, Hobson, & Fulton  (Steve Ruschell)',
    'Woodward, Hobson, & Fulton  ( Steve Ruschell)  S': 'Woodward, Hobson, & Fulton  (Steve Ruschell)',
    'Woodward, Hobson, & Fulton  (Steve Ruschell)': 'Woodward, Hobson, & Fulton  (Steve Ruschell)',
    'Unknown': 'Unknown',
    '?': 'Unknown'
  }

  user = User.objects.get(username='IMPORT')

  def FilterAccount(self, name):
    return Account.objects.filter(account_name=name)

  def AccountFieldCheck(self, name):
    if self.FilterAccount(name).exists():
      return self.FilterAccount(name).first()
    elif name in self.paid_by:
      if self.FilterAccount(self.paid_by[name]).exists():
        return self.FilterAccount(self.paid_by[name]).first()
      else:
        print('NOT THERE')
    else:
      return self.FilterAccount('Unknown').first()

  def GetAgreement(self, resolution):
    if Agreement.objects.filter(resolution_number=resolution).exists():
      return Agreement.objects.filter(resolution_number=resolution).first()

  def ConvertDates(self, date_field):
    try:
      cleaned_date = datetime.strptime(date_field.split(' ')[0], '%m/%d/%y')
    except:
      try:
        cleaned_date_except = datetime.strptime(date_field.split(' ')[0], '%m/%d/%Y')
      except Exception as ex:
        cleaned_date_except = None
      cleaned_date = cleaned_date_except

    return cleaned_date

  def SelectDates(self, date_option):     
    return self.ConvertDates('1/1/1970') if pd.isnull(date_option) else self.ConvertDates(date_option)

  def GetLedgerDetails(self, row, df, numb):
    buildable_lots = int(row['BuildableLots']) if not row['BuildableLots'] == '?' else 0
    
    agreement = self.GetAgreement(row['Resolution-' + str(numb)])
    sewer = 0
    non_sewer = 0

    if pd.notna(row['CreditType-' + str(numb)]) and buildable_lots is not None and buildable_lots != 0:
      if pd.notna(row['Non-Sewer-' + str(numb)]):
        non_sewer = Decimal(row['Non-Sewer-' + str(numb)]) / buildable_lots 
      if pd.notna(row['Sewer-' + str(numb)]):
        sewer = Decimal(row['Sewer-' + str(numb)]) / buildable_lots 

      date = self.SelectDates(row['EntryDate-' + str(numb)])
      print('DATE', date)
    
      ledger_details = {
        'agreement': agreement,
        'sewer': round(sewer, 2), 'non_sewer': round(non_sewer, 2),
        'date': date,
      }

      return ledger_details
    else:
      pass

  def CreateLedger(self, ledger_details):
    try:
      ledger, created = AccountLedger.objects.get_or_create(
        account_to=ledger_details['account_to'],
        account_from=ledger_details['account_from'],
        entry_type='USE',
        lot=ledger_details['lot'],
        agreement=ledger_details['agreement'],
        defaults={
          'created_by': self.user, 'modified_by': self.user,
          'entry_date': ledger_details['date'], 'date_created': ledger_details['date'],
          'non_sewer_credits': ledger_details['non_sewer'], 'sewer_credits': ledger_details['sewer'],
          'sewer_trans': 0, 'sewer_cap': 0,
          'roads': 0, 'parks': 0, 'storm': 0, 'open_space': 0,
        }
      )
    except Exception as ex:
      print('LEDGER EXCEPTION', ex)

  def handle(self, *args, **options):
    df = pd.read_csv('plat_data.csv')

    for index, row in df.iterrows():
        print('INDEX', index)
        print('PLAT', row['Plat_Slide'])

        account_from = self.AccountFieldCheck(row['Contact Company'])
        account_to = self.FilterAccount('Lexington Fayette Urban County Government (LFUCG)').first()

        plat = Plat.objects.filter(cabinet=row['Cabinet'], slide=row['Slide']).first()
        lots = Lot.objects.filter(plat=plat)

        buildable_lots = int(row['BuildableLots']) if not row['BuildableLots'] == '?' else 0
        lot_count = lots.count()
        if buildable_lots < lot_count:
          print('BUILD', buildable_lots)
          print('LOT COUNT', lot_count)
          for lot in lots:
            ending = 1

            while ending <= 5:
              ledger_details = self.GetLedgerDetails(row, df, ending)
              if ledger_details is not None:
                ledger_details['account_to'] = account_to
                ledger_details['account_from'] = account_from
                ledger_details['lot'] = lot
                self.CreateLedger(ledger_details)
              else:
                pass
              ending += 1
        else:
          pass
