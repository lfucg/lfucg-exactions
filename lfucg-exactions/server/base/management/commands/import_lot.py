import csv
from builtins import hasattr
from datetime import datetime
from operator import abs

import pandas as pd
from accounts.models import Account, AccountLedger, Agreement, Payment
from decimal import Decimal
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.core.management import BaseCommand
from notes.models import Note
from plats.models import Lot, Plat, PlatZone, Subdivision
from plats.utils import calculate_lot_balance


class Command(BaseCommand):
    help = "Imports exaction data"

    lot_errors = []

    def add_arguments(self, parser):
        parser.add_argument('filename')
    
    user = User.objects.get(username='IMPORT')
    errors = []

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

    df = pd.read_csv('plat_data.csv')

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
        # return self.ConvertDates(date_option) if date_option else self.ConvertDates('1/1/1970')
        return self.ConvertDates('1/1/1970') if not date_option else self.ConvertDates(date_option)

  
    def FilterAccount(self, name):
        return Account.objects.filter(account_name=name)

    def CheckOrCreateAccount(self, name):
        if not Account.objects.filter(account_name=name).exists():
            try:
                account, created = Account.objects.get_or_create(account_name=name,
                    defaults= { 'created_by': self.user, 'modified_by': self.user,
                    'date_created': self.ConvertDates('1/1/1970'),
                    'contact_full_name': 'Unknown', 
                    'contact_first_name': 'Unknown', 'contact_last_name': 'Unknown',
                    'address_number': 0, 'address_street': 'Unknown', 'address_city': 'Unknown', 'address_state': 'KY',
                    'address_zip': 'Unknown', 'address_full': 'Unknown', 
                    'phone': 'Unknown', 
                    'email': 'unknown@unknown.com',
                    'current_account_balance': 0, 'current_non_sewer_balance': 0, 'current_sewer_balance': 0
                })
            except Exception as ex:
                self.lot_errors.append({'Lot Import Account Creation Error': ex})
                print('Lot Import Account Creation Error', ex)

    def AccountFieldCheck(self, name):
        if self.FilterAccount(name).exists():
            pass
        elif name in self.paid_by:
            self.CheckOrCreateAccount(self.paid_by[name])
        else:
            try:
                self.CheckOrCreateAccount(name)
            except:
                self.CheckOrCreateAccount('Unknown')
    
    def GetAccount(self, account_list):
        finished = False
        for i in range(len(account_list)):
            if account_list[i] and self.FilterAccount(account_list[i]).exists() and not finished:
                finished = True
                return self.FilterAccount(account_list[i])
            elif account_list[i] in self.paid_by and self.FilterAccount(self.paid_by[account_list[i]]).exists() and not finished:
                finished = True
                return self.FilterAccount(self.paid_by[account_list[i]])
            else:
                pass

    def PlatPandasCSV(self, cabinet, slide):
        related_plat = self.df[(self.df['Cabinet'] == cabinet) & (self.df['Slide'] == slide)]
        return related_plat
    
    def FilterAgreements(self, agreement_list):
        finished = False
        for i in range(len(agreement_list)):
            if Agreement.objects.filter(resolution_number=agreement_list[i]).exists() and not finished:
                finished = True
                return Agreement.objects.filter(resolution_number=agreement_list[i]).first()
            else:
                pass

    def LedgerAmounts(self, value_list):
        amounts = {
            'sewer_credits': 0, 'non_sewer_credits': 0,
            'roads': 0, 'parks': 0, 'storm': 0, 'open_space': 0,
            'sewer_trans': 0, 'sewer_cap': 0,
        }
        non_sewer_total = value_list['roads'] + value_list['parks'] + value_list['storm'] + value_list['open_space']
        sewer_total = value_list['sewer_trans'] + value_list['sewer_cap']

        if (abs(non_sewer_total - Decimal(value_list['non_sewer_credits'])) <= 0.02):
            amounts['roads'] = Decimal(value_list['roads'])
            amounts['parks'] = Decimal(value_list['parks'])
            amounts['storm'] = Decimal(value_list['storm'])
            amounts['open_space'] = Decimal(value_list['open_space'])
            amounts['non_sewer_credits'] = Decimal(value_list['non_sewer_credits'])
        elif (Decimal(value_list['non_sewer_credits']) == 0):
            pass
        else:
            non_sewer_ledger = value_list['non_sewer_credits']

            while(non_sewer_ledger > 0):
                if ((value_list['roads'] <= non_sewer_ledger) & (amounts['roads'] == 0)):
                    amounts['roads'] = value_list['roads']
                    non_sewer_ledger -= value_list['roads']
                else:
                    amounts['roads'] = non_sewer_ledger
                    non_sewer_ledger -= non_sewer_ledger
                
                if ((value_list['parks'] <= non_sewer_ledger) & (amounts['parks'] == 0)):
                    amounts['parks'] = value_list['parks']
                    non_sewer_ledger -= value_list['parks']
                else:
                    amounts['parks'] = non_sewer_ledger
                    non_sewer_ledger -= non_sewer_ledger
                
                if ((value_list['storm'] <= non_sewer_ledger) & (amounts['storm'] == 0)):
                    amounts['storm'] = value_list['storm']
                    non_sewer_ledger -= value_list['storm']
                else:
                    amounts['storm'] = non_sewer_ledger
                    non_sewer_ledger -= non_sewer_ledger

                if ((value_list['open_space'] <= non_sewer_ledger) & (amounts['open_space'] == 0)):
                    amounts['open_space'] = value_list['open_space']
                    non_sewer_ledger -= value_list['open_space']
                else:
                    amounts['open_space'] = non_sewer_ledger
                    non_sewer_ledger -= non_sewer_ledger

        if (abs(sewer_total - value_list['sewer_credits']) <= 0.02):
            amounts['sewer_trans'] = value_list['sewer_trans']
            amounts['sewer_cap'] = value_list['sewer_cap']
            amounts['sewer_credits'] = value_list['sewer_credits']
        elif (value_list['sewer_credits'] == 0):
            pass
        else:
            sewer_ledger = value_list['sewer_credits']

            while (sewer_ledger > 0):
                if ((value_list['sewer_trans'] <= sewer_ledger) & (amounts['sewer_trans'] == 0)):
                    amounts['sewer_trans'] = value_list['sewer_trans']
                    sewer_ledger -= value_list['sewer_trans']
                else:
                    amounts['sewer_trans'] = sewer_ledger
                    sewer_ledger -= sewer_ledger

                if ((value_list['sewer_cap'] <= sewer_ledger) & (amounts['sewer_cap'] == 0)):
                    amounts['sewer_cap'] = value_list['sewer_cap']
                    sewer_ledger -= value_list['sewer_cap']
                else:
                    amounts['sewer_cap'] = sewer_ledger
                    sewer_ledger -= sewer_ledger
        
        return amounts
    
    def GetLotPlatResolutions(self, agreements):
        resolution_numbers = []

        for agreement in agreements:
            if hasattr(agreement, 'resolution_number'):
                resolution_numbers.append(agreement.resolution_number)
            elif hasattr(agreement, 'agreement_type') and agreement.agreement_type == 'MEMO':
                resolution_numbers.append(str(agreement.date_modified))

        return resolution_numbers
    
    def LedgerSimpleCheck(self, row, pandas_plat, lot_agreements, plat_agreements):
        is_simple = True
        plats_match = True
        no_plat_needed = True

        # Check if all plats are already accounted for with lots.
        lot_resolutions = self.GetLotPlatResolutions(lot_agreements)
        for plat in plat_agreements:
            if (hasattr(plat, 'resolution_number') and plat.resolution_number not in lot_resolutions):
                plats_match = False

        # Check for repeat types
        lot_ledger_types = [row['CreditType-1'], row['CreditType-2'], row['CreditType-3']]
        mixed_sewer_first = len([s for s in lot_ledger_types if s == 'sewer_credits, non_sewer_credits'])
        mixed_non_sewer_first = len([s for s in lot_ledger_types if s == 'non_sewer_credits, sewer_credits'])
        non_sewer = len([s for s in lot_ledger_types if s == 'non_sewer_credits'])
        sewer = len([s for s in lot_ledger_types if s == 'sewer_credits'])

        # Check if all types (sewer_credits, non_sewer_credits or a mixture) are unique, allowing for direct assignment of each
        if (mixed_non_sewer_first + mixed_sewer_first > 1):
            is_simple = False
            no_plat_needed = False
        elif ((mixed_non_sewer_first > 0 or mixed_sewer_first > 0) and non_sewer > 0):
            is_simple = False
            no_plat_needed = False
        elif ((mixed_non_sewer_first > 0 or mixed_sewer_first > 0) and sewer > 0):
            is_simple = False
            no_plat_needed = False
        elif non_sewer >= 2:
            is_simple = False
            no_plat_needed = False
        elif sewer >= 2:
            is_simple = False
            no_plat_needed = False
        
        return [is_simple, no_plat_needed, plats_match]
    
    def GetLedgerPlatTypes(self, pandas_plat, lot_agreements):
        lot_resolutions = self.GetLotPlatResolutions(lot_agreements)
        lot_ledger_types = []

        try:
            for index, lot in enumerate(x for x in lot_resolutions):
                column = 'CreditType-' + str(index + 1)
                col_match = pandas_plat.columns[(pandas_plat == lot).iloc[0]]

                if len(col_match) > 0:
                    lot_ledger_types.append({column: pandas_plat['CreditType-1'].values[0] }) if col_match.values[0] == 'Resolution-1' else None
                    lot_ledger_types.append({column: pandas_plat['CreditType-2'].values[0] }) if col_match.values[0] == 'Resolution-2' else None
                    lot_ledger_types.append({column: pandas_plat['CreditType-3'].values[0] }) if col_match.values[0] == 'Resolution-3' else None
                    lot_ledger_types.append({column: pandas_plat['CreditType-4'].values[0] }) if col_match.values[0] == 'Resolution-4' else None
                    lot_ledger_types.append({column: pandas_plat['CreditType-5'].values[0] }) if col_match.values[0] == 'Resolution-5' else None
        except Exception as ex:
            self.lot_errors.append({'Get Ledger Plat Types Error': ex})
            print('Get Ledger Plat Types Error', ex)

        return lot_ledger_types

    def CreateUseLedger(self, ledger_details):
        ledger_entry_type = ledger_details['entry_type']

        non_sewer_credits = ledger_details['non_sewer_credits'] if ledger_details['credit_type'] == 'non_sewer_credits' else 0
        sewer_credits = ledger_details['sewer_credits'] if ledger_details['credit_type'] == 'sewer_credits' else 0
        sewer_trans = ledger_details['sewer_trans'] if ledger_details['credit_type'] == 'sewer_credits' else 0
        sewer_cap = ledger_details['sewer_cap'] if ledger_details['credit_type'] == 'sewer_credits' else 0
        roads = ledger_details['roads'] if ledger_details['credit_type'] == 'non_sewer_credits' else 0
        parks = ledger_details['parks'] if ledger_details['credit_type'] == 'non_sewer_credits' else 0
        storm = ledger_details['storm'] if ledger_details['credit_type'] == 'non_sewer_credits' else 0
        open_space = ledger_details['open_space'] if ledger_details['credit_type'] == 'non_sewer_credits' else 0

        if ledger_details['account_from'] and self.FilterAccount(ledger_details['account_from']).exists():
            if self.FilterAccount(ledger_details['account_from']).first().account_name == 'Lexington Fayette Urban County Government (LFUCG)':
                ledger_entry_type = 'NEW'

        ledger_to_account = self.GetAccount([ledger_details['account_to'], 'Lexington Fayette Urban County Government (LFUCG)']).first()

        if ledger_details['account_to'] and self.FilterAccount(ledger_details['account_to']).exists():
            if self.FilterAccount(ledger_details['account_to']).first().account_name == 'Lexington Fayette Urban County Government (LFUCG)':
                ledger_entry_type = 'USE'

        try:
            ledger, created = AccountLedger.objects.get_or_create(
                account_to=ledger_to_account,
                account_from=ledger_details['account_from'],
                entry_type=ledger_entry_type,
                lot=ledger_details['lot'],
                agreement=ledger_details['agreement'],
                defaults={
                    'created_by': self.user, 'modified_by': self.user,
                    'entry_date': ledger_details['date'], 'date_created': ledger_details['date'],
                    'non_sewer_credits': non_sewer_credits, 'sewer_credits': sewer_credits,
                    'sewer_trans': sewer_trans, 'sewer_cap': sewer_cap,
                    'roads': roads, 'parks': parks, 'storm': storm, 'open_space': open_space,
                }
            )
        except Exception as ex:
            self.lot_errors.append({'Ledger Exception': ex})
            print('LEDGER EXCEPTION', ex)

            if ledger_details not in self.errors:   
                self.errors.append('Ledger Error ' + str(ledger_details['lot'].address_full))     
        
    def Ledger1(self, row, common_details, credit_type, agreement):
        ledger_1_details = {
            'date': self.SelectDates(row['EntryDate-1']),
            'agreement': agreement if agreement else self.FilterAgreements([row['AccountLedgerAgreement-1'], 'Unknown']),
            'account_from': self.GetAccount([row['AccountLedgerAccountFrom-1'], row['D_PaidBy'], common_details['plat'].account, 'Unknown']).first(), 'account_to': row['AccountLedgerAccountTo-1'],
            'entry_type': row['D_LedgerEntryType'], 'credit_type': credit_type,
        } 

        ledger_1_combined = {**common_details, **ledger_1_details}
        return self.CreateUseLedger(ledger_1_combined)
    
    def Ledger2(self, row, common_details, credit_type, agreement):
        ledger_2_details = {
            'date': self.SelectDates(row['EntryDate-2']),
            'agreement': agreement if agreement else self.FilterAgreements([row['AccountLedgerAgreement-2'], 'Unknown']),
            'account_from': self.GetAccount([row['AccountLedgerAccountFrom-2'], row['D_PaidBy'], common_details['plat'].account, 'Unknown']).first(), 'account_to': row['AccountLedgerAccountTo-2'],
            'entry_type': row['D_LedgerEntryType'], 'credit_type': credit_type,
        }
        ledger_2_combined = {**common_details, **ledger_2_details}
        self.CreateUseLedger(ledger_2_combined)

    def OtherLedger(self, other_details, pandas_plat, ending_number):
        sewer = 0 if pandas_plat[str('Sewer-' + ending_number)].hasnans else str(round(Decimal(pandas_plat[str('Sewer-' + ending_number)].values[0]) / Decimal(pandas_plat['BuildableLots'].values[0]), 2))
        non_sewer = 0 if pandas_plat[str('Non-Sewer-' + ending_number)].hasnans else str(round(Decimal(pandas_plat[str('Non-Sewer-' + ending_number)].values[0]) / Decimal(pandas_plat['BuildableLots'].values[0]), 2))
        plat_date = pandas_plat[str('EntryDate-' + ending_number)].values[0]

        ledger_other_details = {
            'date': self.SelectDates(plat_date),
            'agreement': self.FilterAgreements([pandas_plat[str('Resolution-' + ending_number)].values[0], 'Unknown']),
            'account_from': self.GetAccount([pandas_plat['Contact Company'].values[0], 'Unknown']).first(),
            'account_to': self.GetAccount(['Lexington Fayette Urban County Government (LFUCG)']).first(),
            'entry_type': pandas_plat[str('AgreementType-' + ending_number)].values[0], 'credit_type': pandas_plat[str('CreditType-' + ending_number)].values[0],
            'sewer_credits': sewer,
            'non_sewer_credits': non_sewer,
        }

        ledger_other_combined = {**other_details, **ledger_other_details}
        self.CreateUseLedger(ledger_other_combined)

    def GetCurrentLotTotals(self, lot):
        current_calculated_lot = calculate_lot_balance(lot)

        if current_calculated_lot['current_exactions'] > 0:
            return {
                'current_exactions': current_calculated_lot['current_exactions'],
                'sewer_due': current_calculated_lot['sewer_due'],
                'non_sewer_due': current_calculated_lot['non_sewer_due'],
                'dues_roads': current_calculated_lot['dues_roads_dev'] + current_calculated_lot['dues_roads_own'],
                'dues_roads_percent': (current_calculated_lot['dues_roads_dev'] + current_calculated_lot['dues_roads_own'])/(current_calculated_lot['current_exactions'])*100,
                'dues_sewer_trans': current_calculated_lot['dues_sewer_trans_dev'] + current_calculated_lot['dues_sewer_trans_own'],
                'dues_sewer_trans_percent': (current_calculated_lot['dues_sewer_trans_dev'] + current_calculated_lot['dues_sewer_trans_own'])/(current_calculated_lot['current_exactions'])*100,
                'dues_sewer_cap': current_calculated_lot['dues_sewer_cap_dev'] + current_calculated_lot['dues_sewer_cap_own'],
                'dues_sewer_cap_percent': (current_calculated_lot['dues_sewer_cap_dev'] + current_calculated_lot['dues_sewer_cap_own'])/(current_calculated_lot['current_exactions'])*100,
                'dues_parks': current_calculated_lot['dues_parks_dev'] + current_calculated_lot['dues_parks_own'],
                'dues_parks_percent': (current_calculated_lot['dues_parks_dev'] + current_calculated_lot['dues_parks_own'])/(current_calculated_lot['current_exactions'])*100,
                'dues_storm': current_calculated_lot['dues_storm_dev'] + current_calculated_lot['dues_storm_own'],
                'dues_storm_percent': (current_calculated_lot['dues_storm_dev'] + current_calculated_lot['dues_storm_own'])/(current_calculated_lot['current_exactions'])*100,
                'dues_open_space': current_calculated_lot['dues_open_space_dev'] + current_calculated_lot['dues_open_space_own'],
                'dues_open_space_percent': (current_calculated_lot['dues_open_space_dev'] + current_calculated_lot['dues_open_space_own'])/(current_calculated_lot['current_exactions'])*100,
            }
        else:
            return {
                'current_exactions': 0,
                'sewer_due': 0,
                'non_sewer_due': 0,
                'dues_roads': 0,
                'dues_roads_percent': 0,
                'dues_sewer_trans': 0,
                'dues_sewer_trans_percent': 0,
                'dues_sewer_cap': 0,
                'dues_sewer_cap_percent': 0,
                'dues_parks': 0,
                'dues_parks_percent': 0,
                'dues_storm': 0,
                'dues_storm_percent': 0,
                'dues_open_space': 0,
                'dues_open_space_percent': 0,
            }
    
    def PaymentAmounts(self, value_list, payment):
        amounts = {
            'roads': 0, 'parks': 0, 'storm': 0, 'open_space': 0,
            'sewer_trans': 0, 'sewer_cap': 0,
        }
        sewer_difference = abs(value_list['sewer'] - value_list['sewer_trans'] - value_list['sewer_cap'])
        non_sewer_difference = abs(value_list['non_sewer'] - value_list['roads'] - value_list['parks'] - value_list['storm'] - value_list['open_space'])

        if (abs(sewer_difference - payment) <= 0.03) or (non_sewer_difference <= 0.03):
            amounts['sewer_trans'] = value_list['sewer_trans']
            amounts['sewer_cap'] = value_list['sewer_cap']
        elif (abs(non_sewer_difference - payment )<= 0.03) or (sewer_difference <= 0.03):
            amounts['roads'] = value_list['roads']
            amounts['parks'] = value_list['parks']
            amounts['storm'] = value_list['storm']
            amounts['open_space'] = value_list['open_space']
        elif (abs(payment - sewer_difference - non_sewer_difference) <= 0.03):
            amounts['sewer_trans'] = value_list['sewer_trans']
            amounts['sewer_cap'] = value_list['sewer_cap']
            amounts['roads'] = value_list['roads']
            amounts['parks'] = value_list['parks']
            amounts['storm'] = value_list['storm']
            amounts['open_space'] = value_list['open_space']
        else:
            sewer_total = value_list['sewer_trans'] + value_list['sewer_cap'] - value_list['sewer']
            non_sewer_total = value_list['roads'] + value_list['parks'] + value_list['storm'] + value_list['open_space'] - value_list['non_sewer']
            payment_total = payment

            try:
                while sewer_total > 0 and payment_total > 0:
                    if (payment_total <= value_list['sewer_trans']) and amounts['sewer_trans'] == 0:
                        sewer_total -= payment_total
                        amounts['sewer_trans'] = payment_total
                        payment_total -= payment_total
                    elif amounts['sewer_trans'] == 0:
                        sewer_total -= value_list['sewer_trans']
                        amounts['sewer_trans'] = value_list['sewer_trans']
                        payment_total -= value_list['sewer_trans']
                    
                    if (payment_total <= value_list['sewer_cap']) and amounts['sewer_cap'] == 0:
                        sewer_total -= payment_total
                        amounts['sewer_cap'] = payment_total
                        payment_total -= payment_total
                    elif amounts['sewer_cap'] == 0:
                        sewer_total -= value_list['sewer_cap']
                        amounts['sewer_cap'] = value_list['sewer_cap']
                        payment_total -= value_list['sewer_cap']
                    
                    if (payment_total <= value_list['roads']) and amounts['roads'] == 0:
                        non_sewer_total -= payment_total
                        amounts['roads'] = payment_total
                        payment_total -= payment_total
                    elif amounts['roads'] == 0:
                        non_sewer_total -= value_list['roads']
                        amounts['roads'] = value_list['roads']
                        payment_total -= value_list['roads']
                    
                    if (payment_total <= value_list['parks']) and amounts['parks'] == 0:
                        non_sewer_total -= payment_total
                        amounts['parks'] = payment_total
                        payment_total -= payment_total
                    elif amounts['parks'] == 0:
                        non_sewer_total -= value_list['parks']
                        amounts['parks'] = value_list['parks']
                        payment_total -= value_list['parks']

                    if (payment_total <= value_list['storm']) and amounts['storm'] == 0:
                        non_sewer_total -= payment_total
                        amounts['storm'] = payment_total
                        payment_total -= payment_total
                    elif amounts['storm'] == 0:
                        non_sewer_total -= value_list['storm']
                        amounts['storm'] = value_list['storm']
                        payment_total -= value_list['storm']
                    
                    if (payment_total <= value_list['open_space']) and amounts['open_space'] == 0:
                        non_sewer_total -= payment_total
                        amounts['open_space'] = payment_total
                        payment_total -= payment_total
                    elif amounts['open_space'] == 0:
                        non_sewer_total -= value_list['open_space']
                        amounts['open_space'] = value_list['open_space']
                        payment_total -= value_list['open_space']
            except Exception as ex:
                print('Payment while loop exception: ', ex)
                print('TOTAL DIFFERENCE,', sewer_difference + non_sewer_difference)
                print('VALUE LIST', value_list)
                print('PAYMENT TOTAL LFT', payment_total)
                print('MIXED', payment)

        return amounts
    
    def CheckOrCreatePayment(self, payment_details):
        amount_paid = payment_details['amount_paid']
        categories = 6
        current_lot = self.GetCurrentLotTotals(payment_details['lot_id'])

        try:
            payment, created = Payment.objects.get_or_create(lot_id=payment_details['lot_id'], credit_account=payment_details['credit_account'],
                credit_source=payment_details['credit_source'],
                defaults={ 'is_approved': True, 'created_by': self.user, 'modified_by': self.user,
                'paid_by': payment_details['paid_by'] and payment_details['paid_by'][:100] or 'Unknown',
                'paid_by_type': payment_details['paid_by_type'] or 'DEVELOPER', 'payment_type': payment_details['payment_type'] or 'OTHER', 
                'check_number': payment_details['check_number'] or None, 

                'paid_roads': payment_details['paid_roads'], 'paid_sewer_trans': payment_details['paid_sewer_trans'], 'paid_sewer_cap': payment_details['paid_sewer_cap'],
                'paid_parks': payment_details['paid_parks'], 'paid_open_space': payment_details['paid_open_space'], 'paid_storm': payment_details['paid_storm']
                })
        except Exception as ex:
            self.lot_errors.append({'Create Payment': ex})
            print('PAYMENT EXCEPTION', ex)
            print('PAYMENT EXCEPTION DETAILS', payment_details)
            if payment_details not in self.errors:   
                self.errors.append('Payment Error ' + str(payment_details['lot_id'].address_full)) 

 
    def handle(self, *args, **options):
        filename = options.get('filename', None)

        if filename is None:
            self.stdout.write('Please specify import file name.')
            return

        self.stdout.write('Importing from ' + filename)

        with open(filename) as file:
            reader = csv.DictReader(file)

            lfucg_account = Account.objects.get(account_name='Lexington Fayette Urban County Government (LFUCG)')

            unknown_account = self.FilterAccount('Unknown').first()
            unknown_agreement = Agreement.objects.get_or_create(
                resolution_number='Unknown',
                defaults= { 
                    'date_executed': self.ConvertDates('1/1/1970'),
                    'account_id': unknown_account, 
                    'is_approved': True, 'created_by': self.user, 'modified_by': self.user,
                    'expansion_area': 'EA-', 'agreement_type': 'OTHER',
                })

            cleaned_reader = [row for row in reader if row['StreetName'] != 'deleted address']
            for row in cleaned_reader:
                print('Address Id', row['AddressID'])
                for k, v in row.items():
                    if v == 'NULL':
                        row[k] = None
                    if v == 'N/A':
                        row[k] = 'Unknown'

                # Get Plat
                if len(row['Cabinet'].strip()) == 0 and len(row['Slide'].strip()) == 0:
                    plat = Plat.objects.get(cabinet='Unknown', slide='Unknown')
                elif row['Cabinet'].strip() == 'DP' and len(row['Slide'].strip()) == 0:
                    plat = Plat.objects.get(cabinet='DP', slide=' ')
                else:
                    plat = Plat.objects.get(cabinet=row['Cabinet'], slide=row['Slide'])
                
                if plat is not None:
                    if plat.unit == ' ':
                        plat.unit = row['Unit'] and row['Unit'] or ' '
                        plat.save()
                    if plat.section == ' ':
                        plat.section = row['Section'] and row['Section'] or ' '
                        plat.save()
                    if plat.block == ' ':
                        plat.block = row['Block'] and row['Block'] or ' '
                        plat.save()

                    try:
                        co_cond = datetime.strptime(row['CODate_Conditional'].split(' ')[0], '%m/%d/%y')
                    except:
                        try:
                            co_cond = datetime.strptime(row['CODate_Conditional'].split(' ')[0], '%m/%d/%Y')
                        except:
                            co_cond = None

                    try:
                        co_final = datetime.strptime(row['CODate_Final'].split(' ')[0], '%m/%d/%y')
                    except:
                        try:
                            co_final = datetime.strptime(row['CODate_Final'].split(' ')[0], '%m/%d/%Y')
                        except:
                            co_final = None

                    if '-' in row['StreetNo']:
                        number_parts = row['StreetNo'].split('-')
                        address_number = number_parts[0]
                        unit = number_parts[1]
                    else:
                        address_number = row['StreetNo']
                        unit = None

                    try:
                        # Create Lot
                        lot, created = Lot.objects.get_or_create(address_number=address_number, address_unit=unit, address_street=row['StreetName'], lot_number=row['Lot'],
                            defaults={
                            'plat': plat, 'parcel_id': row['AddressID'] and row['AddressID'] or None,
                            'account': plat.account or unknown_account,
                            'is_approved': True, 'is_active': True, 'created_by': self.user, 'modified_by': self.user,
                            'permit_id': row['PermitNo'] and row['PermitNo'] or '', 
                            'alternative_address_number': row['AltStreetNo'] and row['AltStreetNo'] or None,
                            'alternative_address_street': row['AltStreetName'] and row['AltStreetName'] or None,
                            'address_full': address_number + ' ' + row['StreetName'] + ' ' + (unit or '' ) + ' Lexington, KY' or '',
                            'certificate_of_occupancy_final': co_cond,
                            'certificate_of_occupancy_conditional': co_final,
                            'dues_roads_dev': row['D_Roads'] if row['D_Roads'] else 0,
                            'dues_roads_own': row['P_Roads'] if row['P_Roads'] else 0,
                            'dues_sewer_trans_dev': row['D_SewerTransmission'] if row['D_SewerTransmission'] else 0,
                            'dues_sewer_trans_own': row['P_SewerTransmission'] if row['P_SewerTransmission'] else 0,
                            'dues_sewer_cap_dev': row['D_SewerCapacity'] if row['D_SewerCapacity'] else 0,
                            'dues_sewer_cap_own': 0,
                            'dues_parks_dev': row['D_Parks'] if row['D_Parks'] else 0,
                            'dues_parks_own': row['P_Parks'] if row['P_Parks'] else 0,
                            'dues_storm_dev': row['D_Stormwater'] if row['D_Stormwater'] else 0,
                            'dues_storm_own': row['P_Stormwater'] if row['P_Stormwater'] else 0,
                            'dues_open_space_dev': row['D_OpenSpace'] if row['D_OpenSpace'] else 0,
                            'dues_open_space_own': 0,
                        })
                    except Exception as ex:
                        self.lot_errors.append({'Lot Import Lot Creation Error': ex})
                        print('Lot Import Lot Creation Error', ex)

                    # Create Additional Accounts
                    if row['D_AccountName']:
                        self.AccountFieldCheck(row['D_AccountName'])
                    elif row['D_PaidBy']:
                        self.AccountFieldCheck(row['D_PaidBy'])

                    if row['P_AccountName']:
                        self.AccountFieldCheck(row['P_AccountName'])
                    elif row['P_PaidBy']:
                        self.AccountFieldCheck(row['P_PaidBy'])

                    if row['AccountLedgerAccountTo-1']:
                        self.AccountFieldCheck(row['AccountLedgerAccountTo-1'])
                    if row['AccountLedgerAccountFrom-1']:
                        self.AccountFieldCheck(row['AccountLedgerAccountFrom-1'])

                    if row['AccountLedgerAccountTo-2']:
                        self.AccountFieldCheck(row['AccountLedgerAccountTo-2'])
                    if row['AccountLedgerAccountFrom-2']:
                        self.AccountFieldCheck(row['AccountLedgerAccountFrom-2'])

                    if row['AccountLedgerAccountFrom-3']:
                        self.AccountFieldCheck(row['AccountLedgerAccountFrom-3'])
                    if row['AccountLedgerAccountTo-3']:
                        self.AccountFieldCheck(row['AccountLedgerAccountTo-3'])

                    pandas_plat = self.PlatPandasCSV(plat.cabinet, plat.slide)

                    agreement_1 = None
                    agreement_2 = None
                    agreement_3 = None
                    agreement_4 = None if (pandas_plat['Resolution-1'].hasnans or len(pandas_plat['Resolution-1']) < 1) else self.FilterAgreements([pandas_plat['Resolution-1'].values[0]])
                    agreement_5 = None if (pandas_plat['Resolution-2'].hasnans or len(pandas_plat['Resolution-2']) < 1) else self.FilterAgreements([pandas_plat['Resolution-2'].values[0]])
                    agreement_6 = None if (pandas_plat['Resolution-3'].hasnans or len(pandas_plat['Resolution-3']) < 1) else self.FilterAgreements([pandas_plat['Resolution-3'].values[0]])
                    agreement_7 = None if (pandas_plat['Resolution-4'].hasnans or len(pandas_plat['Resolution-4']) < 1) else self.FilterAgreements([pandas_plat['Resolution-4'].values[0]])
                    agreement_8 = None if (pandas_plat['Resolution-5'].hasnans or len(pandas_plat['Resolution-5']) < 1) else self.FilterAgreements([pandas_plat['Resolution-5'].values[0]])

                    # Determine if account ledger data exists
                    ledger_1 = bool(row['AccountLedgerAgreement-1'] or row['AccountLedgerAccountFrom-1'] or row['AccountLedgerAgreementType-1'])
                    ledger_2 = bool(row['AccountLedgerAgreement-2'] or row['AccountLedgerAccountFrom-2'] or row['AccountLedgerAgreementType-2'])
                    ledger_3 = bool(row['AccountLedgerAgreement-3'] or row['AccountLedgerAccountFrom-3'] or row['AccountLedgerAgreementType-3'])
                    ledger_4 = bool(agreement_4)
                    ledger_5 = bool(agreement_5)
                    ledger_6 = bool(agreement_6)
                    ledger_7 = bool(agreement_7)
                    ledger_8 = bool(agreement_8)

                    # Create Agreements
                    if ledger_1:
                        if self.FilterAgreements([row['AccountLedgerAgreement-1']]):
                            agreement_ledger_1 = self.FilterAgreements([row['AccountLedgerAgreement-1']])
                        else:
                            try:
                                resolution = ''
                                if row['AccountLedgerAgreement-1']:
                                    resolution = row['AccountLedgerAgreement-1']
                                elif row['AccountLedgerAgreementType-1'] == 'MEMO':
                                    resolution = str(row['EntryDate-1'])
                                else:
                                    resolution = 'Unknown'

                                agreement_ledger_1, created = Agreement.objects.get_or_create(
                                    resolution_number=resolution,
                                    defaults = {
                                        'date_executed': self.SelectDates(row['EntryDate-1']),
                                        'account_id': self.GetAccount([row['AccountLedgerAccountFrom-1'], row['D_AccountName'], plat.account and plat.account.account_name, row['P_AccountName'], 'Unknown']).first(),
                                        'created_by': self.user, 'modified_by': self.user,
                                        'expansion_area': 'EA-' + row['ExpansionArea'], 'agreement_type': row['AccountLedgerAgreementType-1'],
                                        'is_approved': True
                                    })
                            except Exception as ex:
                                agreement_ledger_1 = unknown_account
                                print('Lot Import Agreement 1 Creation Error', ex)
                        
                        agreement_1 = agreement_ledger_1
                    
                    if ledger_2:
                        if self.FilterAgreements([row['AccountLedgerAgreement-2']]):
                            agreement_ledger_2 = self.FilterAgreements([row['AccountLedgerAgreement-2']])
                        else:
                            try:
                                resolution = ''
                                if row['AccountLedgerAgreement-2']:
                                    resolution = row['AccountLedgerAgreement-2']
                                elif row['AccountLedgerAgreementType-2'] == 'MEMO':
                                    resolution = str(row['EntryDate-2'])
                                else:
                                    resolution = 'Unknown'
                                plat_account = plat.account.account_name if hasattr(plat.account, 'account_name') else None 

                                agreement_ledger_2, created = Agreement.objects.get_or_create(
                                    resolution_number=resolution,
                                    defaults= {
                                        'date_executed': self.SelectDates(row['EntryDate-2']),
                                        'account_id': self.GetAccount([row['AccountLedgerAccountFrom-2'], row['P_AccountName'], plat_account, row['P_AccountName'], 'Unknown']).first(),
                                        'created_by': self.user, 'modified_by': self.user,
                                        'expansion_area': 'EA-' + row['ExpansionArea'], 'agreement_type': row['AccountLedgerAgreementType-2'],
                                        'is_approved': True
                                    })
                            except Exception as ex:
                                agreement_ledger_2 = unknown_agreement
                                print('Lot Import Agreement 2 Creation Error', ex)
                    
                        agreement_2 = agreement_ledger_2

                    if ledger_3:
                        if self.FilterAgreements([row['AccountLedgerAgreement-3']]):
                            agreement_ledger_3 = self.FilterAgreements([row['AccountLedgerAgreement-3']])
                        else:
                            try:
                                resolution = ''
                                if row['AccountLedgerAgreement-3']:
                                    resolution = row['AccountLedgerAgreement-3']
                                elif row['AccountLedgerAgreementType-3'] == 'MEMO':
                                    resolution = str(row['EntryDate-3'])
                                else:
                                    resolution = 'Unknown'
                                agreement_ledger_3, created = Agreement.objects.get_or_create(
                                    resolution_number=resolution,
                                    defaults= {
                                        'date_executed': self.SelectDates(row['EntryDate-3']),
                                        'account_id': self.GetAccount([row['AccountLedgerAccountFrom-3'], plat.account and plat.account.account_name, row['D_AccountName'], 'Unknown']).first(),
                                        'created_by': self.user, 'modified_by': self.user,
                                        'expansion_area': 'EA-' + row['ExpansionArea'], 'agreement_type': row['AccountLedgerAgreementType-3'],
                                        'is_approved': True
                                    })
                            except Exception as ex:
                                agreement_ledger_3 = unknown_agreement
                                print('Lot Import Agreement 3 Creation Error', ex)

                        agreement_3 = agreement_ledger_3

                    # Combine credit usage and get account ledger values
                    ledger_value_list = self.LedgerAmounts({
                        'non_sewer_credits': Decimal(row['D_OtherCredits'].replace(',', '')) + Decimal(row['P_OtherCredits'].replace(',', '')), 
                        'sewer_credits': Decimal(row['D_SewerCredits'].replace(',', '')) + Decimal(row['P_SewerCredits'].replace(',', '')),
                        'roads': Decimal(row['D_Roads'].replace(',', '')) + Decimal(row['P_Roads'].replace(',', '')), 
                        'parks': Decimal(row['D_Parks'].replace(',', '')) + Decimal(row['P_Parks'].replace(',', '')), 
                        'storm': Decimal(row['D_Stormwater'].replace(',', '')) + Decimal(row['P_Stormwater'].replace(',', '')), 
                        'open_space': Decimal(row['D_OpenSpace'].replace(',', '')),
                        'sewer_trans': Decimal(row['D_SewerTransmission'].replace(',', '')) + Decimal(row['P_SewerTransmission'].replace(',', '')), 
                        'sewer_cap': Decimal(row['D_SewerCapacity'].replace(',', '')),
                    })

                    if (ledger_1 or ledger_2 or ledger_3 or ledger_4 or ledger_5 or ledger_6 or ledger_7 or ledger_8):
                        lot_agreements = [agreement_1, agreement_2, agreement_3]
                        plat_agreements = [agreement_4, agreement_5, agreement_6, agreement_7, agreement_8]
                        lot_resolutions = self.GetLotPlatResolutions(lot_agreements)
                        plat_resolutions = self.GetLotPlatResolutions(plat_agreements)
                        plat_lot_differences = (list(set(plat_resolutions) - set(lot_resolutions)))
                        lot_plat_differences = (list(set(lot_resolutions) - set(plat_resolutions)))
                        col_509_match = pandas_plat.columns[(pandas_plat == '509-2004').iloc[0]]

                        ledger_check = self.LedgerSimpleCheck(row, pandas_plat, lot_agreements, plat_agreements)

                        common_details = {
                            'plat': plat, 'lot': lot, 
                            'non_sewer_credits': ledger_value_list['non_sewer_credits'], 'sewer_credits': ledger_value_list['sewer_credits'],
                            'sewer_trans': ledger_value_list['sewer_trans'], 'sewer_cap': ledger_value_list['sewer_cap'],
                            'roads': ledger_value_list['roads'], 'parks': ledger_value_list['parks'], 'storm': ledger_value_list['storm'], 'open_space': ledger_value_list['open_space'],
                        }

                        # Check if ledgers are a simple case
                        if ledger_check[0] and ledger_check[1] and ledger_check[2]:
                            self.Ledger1(row, common_details, row['CreditType-1'], None) if ledger_1 else None
                            self.Ledger2(row, common_details, row['CreditType-2'], None) if ledger_2 else None

                        # Check if there are more than 2 plat or lot agreements
                        elif len(lot_resolutions) > 2 or len(plat_resolutions) > 2:
                            if pandas_plat['BuildableLots'].hasnans or pandas_plat['BuildableLots'].values[0] == '?' or pandas_plat['BuildableLots'].values[0] == '0':
                                print('Null Buildable Lots', row['AddressID'])
                                pass
                            else:
                                ending = 1
                                other_details = {
                                    'plat': plat, 'lot': lot, 
                                }

                                while len(plat_resolutions) >= ending:
                                    self.OtherLedger(other_details, pandas_plat, str(ending))
                                    ending += 1 

                        # Check if plat data is needed but there are no extra plat entries
                        elif not ledger_check[1] and ledger_check[2]:
                            plat_ledger_types = self.GetLedgerPlatTypes(pandas_plat, lot_agreements)
                            plat_ledger_values = [list(x.values()) for x in plat_ledger_types]

                            if len(plat_ledger_types) > 1 and hasattr(agreement_2, 'resolution_number'):
                                self.Ledger2(row, common_details, plat_ledger_values[1], None) if ledger_2 else None
                            if len(plat_ledger_types) > 0 and hasattr(agreement_1, 'resolution_number'):
                                self.Ledger1(row, common_details, plat_ledger_values[0], None) if ledger_1 else None

                            if len(plat_ledger_types) > 2:
                                print('Has Extra Plat Ledgers', plat_ledger_types)
                        
                        elif len(col_509_match) > 0 and '509-2004' in plat_lot_differences:
                            if len(plat_lot_differences) == len(lot_plat_differences) == 1:
                                lot_index = [index for index, x in enumerate(lot_resolutions) if x == lot_plat_differences[0]]
                                plat_index = [index for index, z in enumerate(plat_resolutions) if z == plat_lot_differences[0]]
                                resolution_type = 'CreditType-' + str(plat_index[0] + 1)
                                resolution_number = 'Resolution-' + str(plat_index[0] + 1)
                                plat_ledger_type = pandas_plat[resolution_type].values[0]
                                plat_ledger_resolution = self.FilterAgreements([pandas_plat[resolution_number].values[0]])

                                if lot_index[0] == 0:
                                    self.Ledger1(row, common_details, plat_ledger_type, plat_ledger_resolution) if ledger_1 else None
                                    self.Ledger2(row, common_details, row['CreditType-2'], None) if ledger_2 else None
                                elif lot_index[0] == 1:
                                    self.Ledger2(row, common_details, plat_ledger_type, plat_ledger_resolution) if ledger_2 else None
                                    self.Ledger1(row, common_details, row['CreditType-1'], None)
                                else:
                                    print('LONGER 509 INDEX', lot_index)
                            elif len(lot_resolutions) > len(plat_resolutions) and len(lot_resolutions) == 2:
                                self.Ledger1(row, common_details, plat_ledger_type, plat_ledger_resolution)
                            else:
                                print('509 LOT RESOS ', lot_resolutions)
                                print('509 PLAT RESOS', plat_resolutions)
                                print('509 but not included', plat_ledger_resolution)

                        # Check if there are extra plat ledgers not in lots
                        # Check if additional data needed from plats
                        elif not ledger_check[1]:
                            plat_ledger_clarification = self.GetLedgerPlatTypes(pandas_plat, lot_agreements)

                            for ledger_dict in plat_ledger_clarification:
                                for key in ledger_dict:
                                    if key == 'CreditType-1':
                                        key1 = self.Ledger1(row, common_details, ledger_dict['CreditType-1'], None) if ledger_1 else None
                                    elif key == 'CreditType-2':
                                        key2 = self.Ledger2(row, common_details, ledger_dict['CreditType-2'], None) if ledger_2 else None
                                    elif key == 'CreditType-3':
                                        print('CREDIT TYPE 3 Check type #1', key)
                                        print('VALUE ELSE 3', ledger_dict[key])
                                    else:
                                        print('Ledger Check #1 Else Key', key)
                                        print('Ledger Check #1 Else Value', ledger_dict[key])

                        elif not ledger_check[2]:
  
                            for lot_resolution in lot_resolutions:
                                if lot_resolution in plat_resolutions and ledger_check[0]:
                                    lot_agree = [x for x in lot_agreements if hasattr(x, 'resolution_number') and x.resolution_number == lot_resolution]
                                    lot_agree_index = [i for i, e in enumerate(lot_agreements) if e == lot_agree[0]]

                                    if lot_agree_index[0] == 0:
                                        self.Ledger1(row, common_details, row['CreditType-1'], lot_agree[0])
                                    elif lot_agree_index[0] == 1:
                                        self.Ledger2(row, common_details, row['CreditType-2'], lot_agree[0])
                                    else:
                                        print('Lot Not Check [2] Agreement', lot_agree)
                                        print('Lot Not Check [2] Agreement Index', lot_agree_index)
                                elif lot_resolution == 'Unknown':
                                    plat_ledger_types = self.GetLedgerPlatTypes(pandas_plat, lot_agreements)

                                    lot_agree = [x for x in lot_agreements if hasattr(x, 'resolution_number') and x.resolution_number == 'Unknown']
                                    lot_agree_index = [i for i, e in enumerate(lot_agreements) if e == lot_agree[0]]

                                    if len(plat_lot_differences) > 0 and len(lot_resolutions) == len(plat_resolutions):
                                        plat_agree_index = [i for i, e in enumerate(plat_agreements) if hasattr(e, 'resolution_number') and e.resolution_number == plat_lot_differences[0]]

                                        if len(plat_lot_differences) <= 2:
                                            plat_type = pandas_plat['CreditType-1'].values[0] if plat_agree_index[0] == 0 else pandas_plat['CreditType-2'].values[0]

                                            if lot_agree_index[0] == 0:
                                                self.Ledger1(row, common_details, plat_type, plat_agreements[plat_agree_index[0]])
                                            elif lot_agree_index[0] == 1:
                                                self.Ledger2(row, common_details, plat_type, plat_agreements[plat_agree_index[0]])
                                            else:
                                                print('Lot Not Check [2] Agreement', lot_agree)
                                                print('Lot Not Check [2] Agreement Index', lot_agree_index)
                                        else:
                                            print('Multiple differences between plats and lots', plat_lot_differences)
                                    elif len(plat_lot_differences) > 0 and len(plat_resolutions) > len(lot_resolutions):
                                        if pandas_plat['BuildableLots'].hasnans or pandas_plat['BuildableLots'].values[0] == '?' or pandas_plat['BuildableLots'].values[0] == '0':
                                            print('Unknown Buildable Lots', row['AddressID'])
                                            pass
                                        else:
                                            ending = 1
                                            other_details = {
                                                'plat': plat, 'lot': lot, 
                                            }

                                            while len(plat_resolutions) >= ending:
                                                self.OtherLedger(other_details, pandas_plat, str(ending))
                                                ending += 1 
                                    else:
                                        print('Different number of lots vs. plats')
                                elif len(plat_lot_differences) == len(lot_plat_differences) == 1:
                                    lot_index = [index for index, x in enumerate(lot_resolutions) if x == lot_plat_differences[0]]
                                    plat_index = [index for index, z in enumerate(plat_resolutions) if z == plat_lot_differences[0]]
                                    resolution_type = 'CreditType-' + str(plat_index[0] + 1)
                                    resolution_number = 'Resolution-' + str(plat_index[0] + 1)
                                    plat_ledger_type = pandas_plat[resolution_type].values[0]
                                    plat_ledger_resolution = self.FilterAgreements([pandas_plat[resolution_number].values[0]])

                                    if lot_index[0] == 0:
                                        self.Ledger1(row, common_details, plat_ledger_type, plat_ledger_resolution) if ledger_1 else None
                                        self.Ledger2(row, common_details, row['CreditType-2'], None) if ledger_2 else None
                                    elif lot_index[0] == 1:
                                        self.Ledger2(row, common_details, plat_ledger_type, plat_ledger_resolution) if ledger_2 else None
                                        self.Ledger1(row, common_details, row['CreditType-1'], None)
                                    else:
                                        print('DIFFERENCE MATCH MISMATCH', lot_index)
                                else:
                                    print('LOT RESOLUTIONS', lot_resolutions)
                                    print('PLAT RESOLUTIONS', plat_resolutions)
                                    print('LOT RESOLUTION aingl', lot_resolution)
                                    print('PLAT RESOLUTIONS Diff ', plat_lot_differences)
                        else:
                            print('FAILED CHECK')  

                     
                    # Create D_ Payment Entries
                    if row['D_AmtPaid'] != '0':
                        payment_amounts = self.PaymentAmounts({
                            'sewer': Decimal(row['D_SewerCredits'].replace(',', '')), 'non_sewer': Decimal(row['D_OtherCredits'].replace(',', '')),
                            'sewer_trans': Decimal(row['D_SewerTransmission'].replace(',', '')), 'sewer_cap': Decimal(row['D_SewerCapacity'].replace(',', '')),
                            'roads': Decimal(row['D_Roads'].replace(',', '')), 'parks': Decimal(row['D_Parks'].replace(',', '')), 'storm': Decimal(row['D_Stormwater'].replace(',', '')), 'open_space': Decimal(row['D_OpenSpace'].replace(',', ''))
                        }, Decimal(row['D_AmtPaid'].replace(',', '')))
                        
                        # print('PAYMENT AMTS DD', payment_amounts)
                        payment_account = self.GetAccount([row['D_AccountName'], row['D_PaidBy'], plat.account and plat.account.account_name, 'Unknown']).first()
                        payment_agreement = self.FilterAgreements([row['AgreementResolution'], row['AccountLedgerAgreement-1'], row['AccountLedgerAgreement-2'], row['AccountLedgerAgreement-3'], 'Unknown'])

                        payment_details = {
                            'lot_id': lot, 'credit_account': payment_account, 'credit_source': payment_agreement,
                            'amount_paid': Decimal(row['D_AmtPaid'].replace(',', '')), 'paid_by': row['D_PaidBy'], 
                            'paid_sewer_trans': payment_amounts['sewer_trans'], 'paid_sewer_cap': payment_amounts['sewer_cap'],
                            'paid_roads': payment_amounts['roads'], 'paid_parks': payment_amounts['parks'],
                            'paid_storm': payment_amounts['storm'], 'paid_open_space': payment_amounts['open_space'],
                            'paid_by_type': row['D_Paid_By_Type'], 'payment_type': row['D_Payment_Type'],
                            'check_number': row['D_CheckNo']
                        }

                        self.CheckOrCreatePayment(payment_details)
                    
                    # Create P_ Payment Entries
                    if row['P_AmtPaid'] != '0':
                        payment_amounts = self.PaymentAmounts({
                            'sewer': Decimal(row['P_SewerCredits'].replace(',', '')), 'non_sewer': Decimal(row['P_OtherCredits'].replace(',', '')),
                            'sewer_trans': Decimal(row['P_SewerTransmission'].replace(',', '')), 'sewer_cap': 0,
                            'roads': Decimal(row['P_Roads'].replace(',', '')), 'parks': Decimal(row['P_Parks'].replace(',', '')), 'storm': Decimal(row['P_Stormwater'].replace(',', '')), 'open_space': 0,
                        }, Decimal(row['P_AmtPaid'].replace(',', '')))
                        
                        # print('PAYMENT P AMTS P', payment_amounts)
                        # print('PAYMENT P AMTS P TYPE', type(payment_amounts['sewer_trans']))
                        payment_account = self.GetAccount([row['P_AccountName'], row['P_PaidBy'], plat.account and plat.account.account_name, 'Unknown']).first()
                        payment_agreement = self.FilterAgreements([row['AgreementResolution'], row['AccountLedgerAgreement-2'], row['AccountLedgerAgreement-3'], 'Unknown'])

                        payment_details = {
                            'lot_id': lot, 'credit_account': payment_account, 'credit_source': payment_agreement,
                            'amount_paid': Decimal(row['P_AmtPaid'].replace(',', '')), 'paid_by': row['P_PaidBy'], 
                            'paid_sewer_trans': payment_amounts['sewer_trans'], 'paid_sewer_cap': payment_amounts['sewer_cap'],
                            'paid_roads': payment_amounts['roads'], 'paid_parks': payment_amounts['parks'],
                            'paid_storm': payment_amounts['storm'], 'paid_open_space': payment_amounts['open_space'],
                            'paid_by_type': row['P_Paid_By_Type'], 'payment_type': row['P_Payment_Type'],
                            'check_number': row['P_CheckNo']
                        }

                        self.CheckOrCreatePayment(payment_details)

                    # Create Lot Notes
                    if row['Notes'] is not None:
                        content = ContentType.objects.get_for_model(Lot)
                        Note.objects.get_or_create(user=self.user, object_id=lot.id,
                            defaults={'content_type': content, 'note': row['Notes'], 'date': self.ConvertDates('1/1/1970')}
                        )
                else:
                    print("Plat not found: " + row)
            print('ERRORS', self.errors)
            print('Lot Errors', self.lot_errors)
