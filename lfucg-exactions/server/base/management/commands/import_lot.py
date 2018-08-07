from django.core.management import BaseCommand
from django.contrib.contenttypes.models import ContentType
from plats.models import Plat, PlatZone, Lot, Subdivision
from accounts.models import Account, Agreement, AccountLedger, Payment
from notes.models import Note
from django.contrib.auth.models import User
import csv
from datetime import datetime
from decimal import Decimal
from plats.utils import calculate_lot_balance

class Command(BaseCommand):
    help = "Imports exaction data"

    def add_arguments(self, parser):
        parser.add_argument('filename')
    
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

    errors = []

    def FilterAccount(self, name):
        return Account.objects.filter(account_name=name)

    def CheckOrCreateAccount(self, name):
        user = User.objects.get(username='IMPORT')

        if not Account.objects.filter(account_name=name).exists():
            account, created = Account.objects.get_or_create(account_name=name,
                defaults= { 'created_by': user, 'modified_by': user,
            'contact_full_name': 'Unknown', 
            'contact_first_name': 'Unknown', 'contact_last_name': 'Unknown',
            'address_number': 0, 'address_street': 'Unknown', 'address_city': 'Unknown', 'address_state': 'KY',
            'address_zip': 'Unknown', 'address_full': 'Unknown', 
            'phone': 'Unknown', 
            'email': 'unknown@unknown.com' })

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

    def FilterAgreements(self, agreement_list):
        finished = False
        for i in range(len(agreement_list)):
            if Agreement.objects.filter(resolution_number=agreement_list[i]).exists() and not finished:
                finished = True
                return Agreement.objects.filter(resolution_number=agreement_list[i]).first()
            else:
                pass
    
    def CreateUseLedger(self, ledger_details):
        ledger_entry_type = ledger_details['entry_type']
        ledger_from_account = self.GetAccount([ledger_details['account_from'], ledger_details['account_from_alt'], ledger_details['plat'].account, 'Unknown']).first()

        if ledger_details['account_from'] and self.FilterAccount(ledger_details['account_from']).exists():
            if self.FilterAccount(ledger_details['account_from']).first().account_name == 'Lexington Fayette Urban County Government (LFUCG)':
                ledger_entry_type = 'NEW'

        ledger_to_account = self.GetAccount([ledger_details['account_to'], 'Lexington Fayette Urban County Government (LFUCG)']).first()

        if ledger_details['account_to'] and self.FilterAccount(ledger_details['account_to']).exists():
            if self.FilterAccount(ledger_details['account_to']).first().account_name == 'Lexington Fayette Urban County Government (LFUCG)':
                ledger_entry_type = 'USE'

        try:
            ledger_entry_date = datetime.strptime(ledger_details['entry_date'].split(' ')[0], '%m/%d/%y')
        except:
            try:
                ledger_entry_date = datetime.strptime(ledger_details['entry_date'].split(' ')[0], '%m/%d/%Y')
            except:
                ledger_entry_date = datetime.now()

        try:
            ledger, created = AccountLedger.objects.get_or_create(
                account_to=ledger_to_account,
                account_from=ledger_from_account,
                entry_type=ledger_entry_type,
                lot=ledger_details['lot'],
                agreement=ledger_details['agreement'],
                defaults={
                    'created_by': ledger_details['created_by'], 'modified_by': ledger_details['modified_by'],
                    'entry_date': ledger_entry_date,
                    'non_sewer_credits': Decimal(ledger_details['non_sewer_credits'] and ledger_details['non_sewer_credits'] or 0),
                    'sewer_credits': Decimal(ledger_details['sewer_credits'] and ledger_details['sewer_credits'] or 0),
                    'roads': Decimal(ledger_details['roads'] and ledger_details['roads'] or 0),
                    'sewer_trans': Decimal(ledger_details['sewer_trans'] and ledger_details['sewer_trans'] or 0),
                    'sewer_cap': Decimal(ledger_details['sewer_cap'] and ledger_details['sewer_cap'] or 0),
                    'parks': Decimal(ledger_details['parks'] and ledger_details['parks'] or 0),
                    'storm': Decimal(ledger_details['storm'] and ledger_details['storm'] or 0),
                    'open_space': Decimal(ledger_details['open_space'] and ledger_details['open_space'] or 0),
                }
            )
        except Exception as ex:
            print('LEDGER EXCEPTION', ex)
            if ledger_details not in self.errors:   
                self.errors.append('Ledger Error ' + str(ledger_details['lot'].address_full))     

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
    
    def CheckOrCreatePayment(self, payment_details):

        amount_paid = payment_details['amount_paid']
        categories = 6
        current_lot = self.GetCurrentLotTotals(payment_details['lot_id'])
        payments = {
            'paid_roads': 0, 
            'paid_sewer_trans': 0, 
            'paid_sewer_cap': 0,
            'paid_parks': 0, 
            'paid_open_space': 0, 
            'paid_storm': 0,
        }

        category_fields = [
            {'category': 'paid_roads', 'dues': 'dues_roads', 'percent': 'dues_roads_percent'},
            {'category': 'paid_sewer_trans', 'dues': 'dues_sewer_trans', 'percent': 'dues_sewer_trans_percent'},
            {'category': 'paid_sewer_cap', 'dues': 'dues_sewer_cap', 'percent': 'dues_sewer_cap_percent'},
            {'category': 'paid_parks', 'dues': 'dues_parks', 'percent': 'dues_parks_percent'},
            {'category': 'paid_open_space', 'dues': 'dues_open_space', 'percent': 'dues_open_space_percent'},
            {'category': 'paid_storm', 'dues': 'dues_storm', 'percent': 'dues_storm_percent'},
        ]

        if current_lot['current_exactions'] > 0:
            while (amount_paid > 0 and categories > 0):
                for i in range(len(category_fields)):
                    if current_lot[category_fields[i]['dues']] > 0:
                        categories -= 1
                        if (amount_paid * current_lot[category_fields[i]['percent']]) >= current_lot[category_fields[i]['dues']]:
                            payments[category_fields[i]['category']] = current_lot[category_fields[i]['dues']]
                            amount_paid -= current_lot[category_fields[i]['dues']]
                        elif (amount_paid * current_lot[category_fields[i]['percent']]) >= amount_paid:
                            payments[category_fields[i]['category']] = amount_paid
                            amount_paid -= amount_paid
                        elif (amount_paid * current_lot[category_fields[i]['percent']]) > 0:
                            payments[category_fields[i]['category']] = amount_paid * current_lot[category_fields[i]['percent']]
                            amount_paid -= (amount_paid * current_lot[category_fields[i]['percent']])
                        else:
                            payments[category_fields[i]['category']] = 0        

        try:
            payment, created = Payment.objects.get_or_create(lot_id=payment_details['lot_id'], credit_account=payment_details['credit_account'],
                credit_source=payment_details['credit_source'],
                defaults={ 'is_approved': True, 'created_by': payment_details['user'], 'modified_by': payment_details['user'],
                'paid_by': payment_details['paid_by'] and payment_details['paid_by'][:100] or 'Unknown',
                'paid_by_type': payment_details['paid_by_type'] or 'DEVELOPER', 'payment_type': payment_details['payment_type'] or 'OTHER', 
                'check_number': payment_details['check_number'] or None, 

                'paid_roads': payments['paid_roads'], 'paid_sewer_trans': payments['paid_sewer_trans'], 'paid_sewer_cap': payments['paid_sewer_cap'],
                'paid_parks': payments['paid_parks'], 'paid_open_space': payments['paid_open_space'], 'paid_storm': payments['paid_storm']
                })
        except Exception as ex:
            print('PAYMEN EXCEPTION', ex)
            if payment_details not in self.errors:   
                self.errors.append('Payment Error ' + str(payment_details['lot_id'].address_full)) 

    
    def handle(self, *args, **options):

        agreements = []
        filename = options.get('filename', None)

        if filename is None:
            self.stdout.write('Please specify import file name.')
            return

        self.stdout.write('Importing from ' + filename)

        with open(filename) as file:
            reader = csv.DictReader(file)

            user = User.objects.get(username='IMPORT')
            lfucg_account = Account.objects.get(account_name='Lexington Fayette Urban County Government (LFUCG)')

            unknown_account = self.FilterAccount('Unknown').first()
            unknown_agreement = Agreement.objects.get_or_create(date_executed=datetime.now(),
                account_id=unknown_account, 
                resolution_number='Unknown',
                expansion_area='EA-', agreement_type='OTHER',
                defaults= { 'is_approved': True, 'created_by': user, 'modified_by': user })

            for row in reader:
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

                    # Create Lot
                    lot, created = Lot.objects.get_or_create(address_number=address_number, address_unit=unit, address_street=row['StreetName'], lot_number=row['Lot'],
                        defaults={
                        'plat': plat, 'parcel_id': row['AddressID'] and row['AddressID'] or None,
                        'account': plat.account or unknown_account,
                        'is_approved': True, 'is_active': True, 'created_by': user, 'modified_by': user,
                        'permit_id': row['PermitNo'] and row['PermitNo'] or '', 
                        'alternative_address_number': row['AltStreetNo'] and row['AltStreetNo'] or None,
                        'alternative_address_street': row['AltStreetName'] and row['AltStreetName'] or None,
                        'address_full': address_number + ' ' + row['StreetName'] + ' ' + (unit or '' ) + ' Lexington, KY' or '',
                        'certificate_of_occupancy_final': co_cond,
                        'certificate_of_occupancy_conditional': co_final,
                    })

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

                    # Create Agreements
                    if row['AgreementResolution']:
                        agreement, created = Agreement.objects.get_or_create(date_executed=datetime.now(),
                            account_id=self.GetAccount([plat.account and plat.account.account_name, row['D_AccountName'], row['P_AccountName'], 'Unknown']).first(),
                            resolution_number=row['AgreementResolution'] and row['AgreementResolution'] or 'Unknown',
                            expansion_area='EA-' + row['ExpansionArea'], agreement_type=row['AccountLedgerAgreementType-1'],
                            defaults= { 'is_approved': True, 'created_by': user, 'modified_by': user })
                        agreement_resolution = agreement or unknown_agreement
                    
                    if row['AccountLedgerAgreement-1']:
                        agreement, created = Agreement.objects.get_or_create(date_executed=datetime.now(),
                            account_id=self.GetAccount([row['AccountLedgerAccountFrom-1'], row['D_AccountName'], plat.account and plat.account.account_name, row['P_AccountName'], 'Unknown']).first(),
                            resolution_number=row['AccountLedgerAgreement-1'] and row['AccountLedgerAgreement-1'] or 'Unknown',
                            expansion_area='EA-' + row['ExpansionArea'], agreement_type=row['AccountLedgerAgreementType-1'],
                            defaults= { 'is_approved': True, 'created_by': user, 'modified_by': user })
                        agreement_ledger_1 = agreement or unknown_agreement
                    
                    if row['AccountLedgerAgreement-2']:
                        agreement, created = Agreement.objects.get_or_create(date_executed=datetime.now(),
                            account_id=self.GetAccount([row['AccountLedgerAccountFrom-2'], row['P_AccountName'], plat.account and plat.account.account_name, row['P_AccountName'], 'Unknown']).first(),
                            resolution_number=row['AccountLedgerAgreement-2'] and row['AccountLedgerAgreement-2'] or 'Unknown',
                            expansion_area='EA-' + row['ExpansionArea'], agreement_type=row['AccountLedgerAgreementType-2'],
                            defaults= { 'is_approved': True, 'created_by': user, 'modified_by': user })
                        agreement_ledger_2 = agreement or unknown_agreement
                    
                    if row['AccountLedgerAgreement-3']:
                        agreement, created = Agreement.objects.get_or_create(date_executed=datetime.now(),
                            account_id=self.GetAccount([row['AccountLedgerAccountFrom-2'], plat.account and plat.account.account_name, row['D_AccountName'], 'Unknown']).first(),
                            resolution_number=row['AccountLedgerAgreement-3'] and row['AccountLedgerAgreement-3'] or 'Unknown',
                            expansion_area='EA-' + row['ExpansionArea'], agreement_type=row['AccountLedgerAgreementType-3'],
                            defaults= { 'is_approved': True, 'created_by': user, 'modified_by': user })
                        agreement_ledger_3 = agreement or unknown_agreement

                    # Create Ledger 1 Entry
                    if row['AccountLedgerAgreement-1'] or row['AccountLedgerAccountFrom-1']:
                        ledger_details = {
                            'plat': plat, 'lot': lot,
                            'agreement': self.FilterAgreements([row['AccountLedgerAgreement-1'], 'Unknown']),
                            'account_from': row['AccountLedgerAccountFrom-1'], 'account_from_alt': row['D_PaidBy'], 'account_to': row['AccountLedgerAccountTo-1'],
                            'entry_type': row['D_LedgerEntryType'], 
                            'created_by': user, 'modified_by': user, 'entry_date': row['D_DatePaid'],
                            'non_sewer_credits': row['D_OtherCredits'], 'sewer_credits': row['D_SewerCredits'],
                            'roads': row['D_Roads'], 'parks': row['D_Parks'], 'storm': row['D_Stormwater'], 'open_space': row['D_OpenSpace'],
                            'sewer_trans': row['D_SewerTransmission'], 'sewer_cap': row['D_SewerCapacity'],
                        }
                        self.CreateUseLedger(ledger_details)
                    # # Create D_ Ledger Entries
                    elif row['D_LedgerEntryType']:
                        ledger_details = {
                            'plat': plat, 'lot': lot,
                            'agreement': self.FilterAgreements([row['AgreementResolution'], row['AccountLedgerAgreement-1'], row['AccountLedgerAgreement-2'], row['AccountLedgerAgreement-3'], 'Unknown']),
                            'account_from': row['D_AccountName'], 'account_from_alt': row['D_PaidBy'], 'account_to': lfucg_account,
                            'entry_type': row['D_LedgerEntryType'], 
                            'created_by': user, 'modified_by': user, 'entry_date': row['D_DatePaid'],
                            'non_sewer_credits': row['D_OtherCredits'], 'sewer_credits': row['D_SewerCredits'],
                            'roads': row['D_Roads'], 'parks': row['D_Parks'], 'storm': row['D_Stormwater'], 'open_space': row['D_OpenSpace'],
                            'sewer_trans': row['D_SewerTransmission'], 'sewer_cap': row['D_SewerCapacity'],
                        }
                        self.CreateUseLedger(ledger_details)
                    
                    # # Create Ledger 2 Entry
                    if row['AccountLedgerAgreement-2'] or row['AccountLedgerAccountFrom-2']:
                        ledger_details = {
                            'plat': plat, 'lot': lot,
                            'agreement': self.FilterAgreements([row['AccountLedgerAgreement-2'], 'Unknown']),
                            'account_from': row['AccountLedgerAccountFrom-2'], 'account_from_alt': row['P_PaidBy'], 'account_to': row['AccountLedgerAccountTo-2'],
                            'entry_type': row['P_LedgerEntryType'], 
                            'created_by': user, 'modified_by': user, 'entry_date': row['P_DatePaid'],
                            'non_sewer_credits': row['P_OtherCredits'], 'sewer_credits': row['P_SewerCredits'],
                            'roads': row['P_Roads'], 'parks': row['P_Parks'], 'storm': row['P_Stormwater'], 'open_space': 0,
                            'sewer_trans': row['P_SewerTransmission'], 'sewer_cap': 0,
                        }
                        self.CreateUseLedger(ledger_details)
                    # # Create P_ Ledger Entries
                    elif row['P_LedgerEntryType']:
                        ledger_details = {
                            'plat': plat, 'lot': lot,
                            'agreement': self.FilterAgreements([row['AccountLedgerAgreement-2'], row['AccountLedgerAgreement-3'], 'Unknown']),
                            'account_from': row['P_AccountName'], 'account_from_alt': row['P_PaidBy'], 'account_to': lfucg_account,
                            'entry_type': row['P_LedgerEntryType'], 
                            'created_by': user, 'modified_by': user, 'entry_date': row['P_DatePaid'],
                            'non_sewer_credits': row['P_OtherCredits'], 'sewer_credits': row['P_SewerCredits'],
                            'roads': row['P_Roads'], 'parks': row['P_Parks'], 'storm': row['P_Stormwater'], 'open_space': 0,
                            'sewer_trans': row['P_SewerTransmission'], 'sewer_cap': 0,
                        }
                        self.CreateUseLedger(ledger_details)

                    # # Create Ledger 3 Entry
                    if row['AccountLedgerAgreement-3'] or row['AccountLedgerAccountFrom-3']:
                        ledger_details = {
                            'plat': plat, 'lot': lot,
                            'agreement': self.FilterAgreements([row['AccountLedgerAgreement-3'], 'Unknown']),
                            'account_from': row['AccountLedgerAccountFrom-3'], 'account_from_alt': None, 'account_to': row['AccountLedgerAccountTo-3'],
                            'entry_type': row['D_LedgerEntryType'], 
                            'created_by': user, 'modified_by': user, 'entry_date': row['D_DatePaid'],
                            'non_sewer_credits': 0, 'sewer_credits': 0,
                            'roads': 0, 'parks': 0, 'storm': 0, 'open_space': 0,
                            'sewer_trans': 0, 'sewer_cap': 0,
                        }
                        self.CreateUseLedger(ledger_details)


                    # Create D_ Payment Entries
                    if row['D_AmtPaid'] != '0':
                        payment_account = self.GetAccount([row['D_AccountName'], row['D_PaidBy'], plat.account and plat.account.account_name, 'Unknown']).first()
                        payment_agreement = self.FilterAgreements([row['AgreementResolution'], row['AccountLedgerAgreement-1'], row['AccountLedgerAgreement-2'], row['AccountLedgerAgreement-3'], 'Unknown'])

                        payment_details = {
                            'lot_id': lot, 'credit_account': payment_account, 'credit_source': payment_agreement, 'user': user,
                            'amount_paid': Decimal(row['D_AmtPaid']), 'paid_by': row['D_PaidBy'], 
                            'paid_by_type': row['D_Paid_By_Type'], 'payment_type': row['D_Payment_Type'],
                            'check_number': row['D_CheckNo']
                        }

                        self.CheckOrCreatePayment(payment_details)
                    
                    # Create P_ Payment Entries
                    if row['P_AmtPaid'] != '0':
                        payment_account = self.GetAccount([row['P_AccountName'], row['P_PaidBy'], plat.account and plat.account.account_name, 'Unknown']).first()
                        payment_agreement = self.FilterAgreements([row['AgreementResolution'], row['AccountLedgerAgreement-2'], row['AccountLedgerAgreement-3'], 'Unknown'])

                        payment_details = {
                            'lot_id': lot, 'credit_account': payment_account, 'credit_source': payment_agreement, 'user': user,
                            'amount_paid': Decimal(row['P_AmtPaid']), 'paid_by': row['P_PaidBy'], 
                            'paid_by_type': row['P_Paid_By_Type'], 'payment_type': row['P_Payment_Type'],
                            'check_number': row['P_CheckNo']
                        }

                        self.CheckOrCreatePayment(payment_details)

                    # Create Lot Notes
                    if row['Notes'] is not None:
                        content = ContentType.objects.get_for_model(Lot)
                        Note.objects.get_or_create(user=user, object_id=lot.id,
                            defaults={'content_type': content, 'note': row['Notes'], 'date': datetime.now()}
                        )
                        
                    #     total_paid = p_payment.paid_roads + p_payment.paid_parks + p_payment.paid_storm + p_payment.paid_sewer_trans
                    #     if total_paid - (Decimal(row['P_AmtPaid'] or 0) + Decimal(row['P_Deferral'] or 0)) > 0.01:
                    #         print(str(total_paid) + ' vs. ' + row['P_AmtPaid'] + ' ' + row['P_Deferral'] + ' Payment mismatch for : ' + str(lot))


                    # if created:
                    #     print(row['StreetNo'] + ' ' + row['StreetName'] + ' ' + row['Lot'] + ' created')
                else:
                    print("Plat not found: " + row)
            # print(agreements)
            print('ERRORS', self.errors)
