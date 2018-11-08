from django.core.management import BaseCommand
from plats.models import Plat, PlatZone, Lot, Subdivision
from accounts.models import Account
from notes.models import Rate, RateTable
from django.contrib.auth.models import User
import csv
from decimal import Decimal
from datetime import datetime

class Command(BaseCommand):
    help = "Imports plat data from plat_data"

    def add_arguments(self, parser):
        parser.add_argument('filename')

    def CheckOrCreateRate(self, zone, expansion_area):
        if zone:
            current_rate_table = RateTable.objects.filter(is_active=True).first()
            user = User.objects.get(username='IMPORT')
            
            try:
                road_rate, created = Rate.objects.get_or_create(expansion_area=expansion_area, zone=zone, category='ROADS', rate_table_id=current_rate_table, defaults={'rate':0, 'created_by':user, 'modified_by':user })
                if created:
                    print('ROADS Rate created for ' + expansion_area + ' ' + zone)
                open_space_rate, created = Rate.objects.get_or_create(expansion_area=expansion_area, zone=zone, category='OPEN_SPACE', rate_table_id=current_rate_table, defaults={'rate':0, 'created_by':user, 'modified_by':user })
                if created:
                    print('OPEN_SPACE Rate created for ' + expansion_area + ' ' + zone)
                sewer_cap_rate, created = Rate.objects.get_or_create(expansion_area=expansion_area, zone=zone, category='SEWER_CAP', rate_table_id=current_rate_table, defaults={'rate':0, 'created_by':user, 'modified_by':user })
                if created:
                    print('SEWER_CAP Rate created for ' + expansion_area + ' ' + zone)
                sewer_trans_rate, created = Rate.objects.get_or_create(expansion_area=expansion_area, zone=zone, category='SEWER_TRANS', rate_table_id=current_rate_table, defaults={'rate':0, 'created_by':user, 'modified_by':user })
                if created:
                    print('SEWER_TRANS Rate created for ' + expansion_area + ' ' + zone)
                parks_rate, created = Rate.objects.get_or_create(expansion_area=expansion_area, zone=zone, category='PARK', rate_table_id=current_rate_table, defaults={'rate':0, 'created_by':user, 'modified_by':user })
                if created:
                    print('PARK Rate created for ' + expansion_area + ' ' + zone)
                storm_water_rate, created = Rate.objects.get_or_create(expansion_area=expansion_area, zone=zone, category='STORM_WATER', rate_table_id=current_rate_table, defaults={'rate':0, 'created_by':user, 'modified_by':user })
                if created:
                    print('STORM_WATER Rate created for ' + expansion_area + ' ' + zone)
            except Exception as ex:
                print('Plat Import Rate Creation Error', ex)

    def handle(self, *args, **options):
        filename = options.get('filename', None)

        if filename is None:
            self.stdout.write('Please specify import file name.')
            return

        self.stdout.write('Importing from ' + filename)

        with open(filename) as file:
            reader = csv.DictReader(file)

            user = User.objects.get(username='IMPORT')
            # Create Unknown Plat if doesn't exist
            Plat.objects.get_or_create(name='Unknown', expansion_area='EA-1', cabinet='Unknown', slide='Unknown', 
                defaults= { 'date_recorded': datetime.now, 'signed_date': datetime.now, 
                'account': None, 'subdivision': None,
                'is_approved': False, 'created_by': user, 'modified_by': user, 'total_acreage': 0,
                'amended': False, 'case_number': '', 'acreage_type': 'gross',
                'right_of_way_acreage': 0,
                'plat_type': 'DEVELOPMENT_PLAN', 'buildable_lots': 0, 
                'non_buildable_lots': 0, 'calculation_note': None,
                'unit': ' ', 'section': ' ', 'block': ' '})
            
            Account.objects.get_or_create(account_name='Unknown', contact_full_name='Unknown',
                defaults= { 'created_by': user, 'modified_by': user, 
                'contact_first_name': 'Unknown', 'contact_last_name': 'Unknown',
                'address_number': 0, 'address_street': 'Unknown',
                'address_city': 'Unknown', 'address_state': 'Unknown', 'address_zip': 'Unknown',
                'address_full': 'Unknown',
                'phone': 'Unknown',
                'email': 'unknown@unknown.com',
                'current_account_balance': 0, 'current_non_sewer_balance': 0, 'current_sewer_balance': 0
                })

            for row in reader:
                for (k, v in row.items()):
                    if v == 'NULL':
                        row[k] = None
                    if v == '?':
                        row[k] = '-1'
                    if v == 'Unk':
                        row[k] = '-1'
                    if v == 'N/A':
                        row[k] = '-1'
                    if v == 'development plan':
                        row[k] = 'development_plan'

                # Create Accounts
                contact_full_name = len(row['Contact Name']) > 0 and row['Contact Name'].strip() or 'Unknown'
                contact_full_address = len(row['Contact Address']) > 0 and row['Contact Address'].strip() or 'Unknown'
                contact_street_number = '0'
                contact_street = 'Unknown'
                contact_city = 'Unknown'
                contact_state = 'KY'
                contact_zip = 'Unknown'

                if contact_full_address != 'Unknown':
                    first_space = contact_full_address.find(' ')
                    last_comma = contact_full_address.rfind(',')
                    pre_city_divider = contact_full_address.rfind(',', 0, last_comma - 1) or contact_full_address.rfind(' ', 0, last_comma - 1)
                    
                    contact_city = contact_full_address[pre_city_divider + 1 : last_comma].strip()
                    contact_state = contact_full_address[last_comma + 1 : -5].strip()
                    contact_zip = contact_full_address[-5:len(contact_full_address)]

                    if contact_full_address[0 : first_space].isnumeric():
                        contact_street_number = contact_full_address[0 : first_space]
                        contact_street = contact_full_address[first_space : pre_city_divider]
                    else:
                        contact_street = contact_full_address[0 : pre_city_divider]

                try:
                    account, created = Account.objects.get_or_create(account_name=len(row['Contact Company']) > 0 and row['Contact Company'].strip() or contact_full_name, contact_full_name=contact_full_name,
                        defaults= { 'created_by': user, 'modified_by': user, 
                        'contact_first_name': 'Unknown', 'contact_last_name': 'Unknown',
                        'address_number': contact_street_number, 'address_street': contact_street,
                        'address_city': contact_city, 'address_state': contact_state, 'address_zip': contact_zip,
                        'address_full': contact_full_address,
                        'phone': len(row['Contact Phone']) > 0 and row['Contact Phone'] or 'Unknown',
                        'email': len(row['Contact Email']) > 0 and row['Contact Email'] or 'unknown@unknown.com',
                        'current_account_balance': 0, 'current_non_sewer_balance': 0, 'current_sewer_balance': 0
                        })
                except Exception as ex:
                    print('Plat Import Account Creation Error', ex)

                try:
                    # Create Subdivision
                    subdivision, created = Subdivision.objects.get_or_create(name=row['SubdivisionName'].strip(), 
                        defaults= {'gross_acreage': 0, 'is_approved': True, 'created_by': user, 'modified_by': user})
                except Exception as ex:
                    print('Plat Import Subdivision Creation Error', ex)

                # Create Plat
                try:
                    signed_date = datetime.strptime(row['SignedDate'], '%m/%d/%y')
                except:
                    try:
                        signed_date = datetime.strptime(row['SignedDate'], '%m/%d/%Y')
                    except:
                        signed_date = datetime.strptime("01/01/1900", '%m/%d/%Y')

                self.CheckOrCreateRate(row['PlatZone-1'], 'EA-' + row['ExpanArea'])
                self.CheckOrCreateRate(row['PlatZone-2'], 'EA-' + row['ExpanArea'])
                self.CheckOrCreateRate(row['PlatZone-3'], 'EA-' + row['ExpanArea'])

                try:
                    plat, created = Plat.objects.get_or_create(name=row['PlatName'], expansion_area='EA-' + row['ExpanArea'], 
                        cabinet=row['Cabinet'], slide=len(row['Slide']) > 0 and row['Slide'] or row['Plat_Slide'], 
                        defaults= { 'date_recorded': datetime.now, 'signed_date': signed_date, 
                        'account': account, 'subdivision': subdivision,
                        'is_approved': True, 'created_by': user, 'modified_by': user, 'total_acreage': len(row['PlatAcres']) > 0 and Decimal(row['PlatAcres']) or 0,
                        'amended': row['Amended'] and row['Amended'] == 'amd' or False, 'case_number': row['CaseNum'], 'acreage_type': row['GrossVsNet'].upper(),
                        'right_of_way_acreage': len(row['ROWAcres']) > 0 and Decimal(row['ROWAcres']) or 0,
                        'plat_type': row['PlatVsDevPlan'] and row['PlatVsDevPlan'].upper(), 'buildable_lots': row['BuildableLots'] and int(row['BuildableLots']) or 0, 
                        'non_buildable_lots': row['NonBuildLots'] and int(row['NonBuildLots']) or 0, 'calculation_note': row['Notes'],
                        'unit': ' ', 'section': ' ', 'block': ' '})
                    # if created:
                    #     print(str(plat) + ' plat created')
                except Exception as ex:
                    print('Plat Import Plat Creation Error', ex)

                # Create PlatZones
                if row['PlatZone-1']:
                    try:
                        plat_zone, created = PlatZone.objects.get_or_create(plat=plat, zone=row['PlatZone-1'],
                            defaults= { 'created_by': user, 'modified_by': user, 'acres': len(row['PlatZoneAcres-1']) > 0 and Decimal(row['PlatZoneAcres-1']) or 0 })
                        # if created:
                        #     print (str(plat_zone) + ' plat_zone created')
                    except Exception as ex:
                        print('Plat Import Plat Zone 1 Creation Error', ex)

                if row['PlatZone-2']:
                    try:
                        plat_zone, created = PlatZone.objects.get_or_create(plat=plat, zone=row['PlatZone-2'],
                            defaults= { 'created_by': user, 'modified_by': user, 'acres': len(row['PlatZoneAcres-2']) > 0 and Decimal(row['PlatZoneAcres-2']) or 0 })
                        # if created:
                        #     print (str(plat_zone) + ' plat_zone created')
                    except Exception as ex:
                        print('Plat Import Plat Zone 2 Creation Error', ex)

                if row['PlatZone-3']:
                    try:
                        plat_zone, created = PlatZone.objects.get_or_create(plat=plat, zone=row['PlatZone-3'],
                            defaults= { 'created_by': user, 'modified_by': user, 'acres': len(row['PlatZoneAcres-3']) > 0 and Decimal(row['PlatZoneAcres-3']) or 0 })
                        # if created:
                        #     print (str(plat_zone) + ' plat_zone created')
                    except Exception as ex:
                        print('Plat Import Plat Zone 3 Creation Error', ex)

                if row['PlatZone-4']:
                    try:
                        plat_zone, created = PlatZone.objects.get_or_create(plat=plat, zone=row['PlatZone-4'],
                            defaults= { 'created_by': user, 'modified_by': user, 'acres': len(row['PlatZoneAcres-4']) > 0 and Decimal(row['PlatZoneAcres-4']) or 0 })
                        # if created:
                        #     print (str(plat_zone) + ' plat_zone created')
                    except Exception as ex:
                        print('Plat Import Plat Zone 4 Creation Error', ex)
