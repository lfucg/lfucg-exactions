from django.shortcuts import render
import datetime
import csv
from django.views.generic import View
from django.http import HttpResponse
from django.db.models import Count, Max, Q
from .models import *
from .serializers import *
from accounts.models import *
from accounts.serializers import PaymentSerializer, AccountLedgerSerializer
from .utils import calculate_lot_balance
from .serializers import *

class SubdivisionCSVExportView(View):
    def get_serializer_class(self, serializer_class):
        return serializer_class

    def list(self, queryset, serializer_class, many):
        serializer_class = self.get_serializer_class(serializer_class)
        serializer = serializer_class(queryset, many=many)
        return serializer

    def get(self, request, *args, **kwargs):
        headers = [
            'Name',
            'Acres',
        ]

        all_rows = []

        subdivision_value = request.GET.get('subdivision', None)

        if subdivision_value is not None:
            subdivision_queryset = Subdivision.objects.filter(id=subdivision_value)
            subdivision_serializer = self.list(
                subdivision_queryset,
                SubdivisionSerializer,
                many=False
            )
            filename = subdivision_queryset[0].name + '_subdivision_report.csv'
        else:
            subdivision_queryset = Subdivision.objects.all()

            plat_set = self.request.GET.get('plat__id', None)
            if plat_set is not None:
                subdivision_queryset = subdivision_queryset.filter(plat=plat_set)

            search_set = self.request.GET.get('search', None)
            if search_set is not None:
                subdivision_queryset = subdivision_queryset.filter(
                        Q(name__icontains=search_set)
                    )

            subdivision_serializer = self.list(
                subdivision_queryset,
                SubdivisionSerializer,
                many=True
            )
            filename = 'subdivision_report_' + datetime.datetime.now().strftime("%Y-%m-%d") + '.csv'

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=%s'%filename
        
        for subdivision in subdivision_serializer.data:
            row = {
                'Name': subdivision['name'],
                'Acres': subdivision['gross_acreage'],
            }

            plat_queryset = Plat.objects.filter(subdivision=subdivision['id'])
            if plat_queryset is not None:
                plat_serializer = self.list (
                    plat_queryset,
                    PlatSerializer,
                    many=True
                )

                for i, plat in zip(range(plat_queryset.count()), plat_serializer.data):
                    headers.extend(['Cabinet -%s' %(i+1)])
                    headers.extend(['Slide -%s' %(i+1)])
                    headers.extend(['Total Acreage -%s' %(i+1)])
                    headers.extend(['Buildable Lots -%s' %(i+1)])
                    headers.extend(['Non-Buildable Lots -%s' %(i+1)])
                    headers.extend(['Plat Type -%s' %(i+1)])
                    headers.extend(['Slide -%s' %(i+1)])
                    headers.extend(['Unit -%s' %(i+1)])
                    headers.extend(['Block -%s' %(i+1)])
                    headers.extend(['Section -%s' %(i+1)])
                    headers.extend(['Non-Sewer Exactions -%s' %(i+1)])
                    headers.extend(['Sewer Exactions -%s' %(i+1)])

                    row['Cabinet -%s' %(i+1)] = plat['cabinet']
                    row['Slide -%s' %(i+1)] = plat['slide']
                    row['Total Acreage -%s' %(i+1)] = plat['total_acreage']
                    row['Buildable Lots -%s' %(i+1)] = plat['buildable_lots']
                    row['Non-Buildable Lots -%s' %(i+1)] = plat['non_buildable_lots']
                    row['Plat Type -%s' %(i+1)] = plat['plat_type_display']
                    row['Expansion Area -%s' %(i+1)] = plat['expansion_area']
                    row['Unit -%s' %(i+1)] = plat['unit']
                    row['Blocks -%s' %(i+1)] = plat['block']
                    row['Section -%s' %(i+1)] = plat['section']
                    row['Non-Sewer Exactions -%s' %(i+1)] = plat['non_sewer_due']
                    row['Sewer Exactions -%s' %(i+1)] = plat['sewer_due']

            all_rows.append(row)

        unique_fieldnames = []
        for name in headers:
            if name not in unique_fieldnames:
                unique_fieldnames.append(name)

        writer = csv.DictWriter(response, fieldnames=unique_fieldnames, extrasaction='ignore')
        writer.writeheader()

        for row in all_rows:
            writer.writerow(row)

        return response

class PlatCSVExportView(View):
    def get_serializer_class(self, serializer_class):
        return serializer_class

    def list(self, queryset, serializer_class, many):
        serializer_class = self.get_serializer_class(serializer_class)
        serializer = serializer_class(queryset, many=many)
        return serializer

    def get(self, request, *args, **kwargs):
        headers = [
            'Subdivision',
            'Cabinet',
            'Slide',
            'Total Acreage',
            'Buildable Lots',
            'Non-Buildable Lots',
            'Plat Type',
            'Expansion Area',
            'Unit',
            'Block',
            'Section',
            'Non-Sewer Exactions',
            'Sewer Exactions',
            'Account',
        ]

        all_rows = []

        plat_value = request.GET.get('plat', None)

        if plat_value is not None:
            plat_queryset = Plat.objects.filter(id=plat_value)
            plat_serializer = self.list(
                plat_queryset,
                PlatSerializer,
                many=False
            )
            filename = plat_queryset[0].cabinet + '-' + plat_queryset[0].slide + '_plat_report.csv'
        else:
            plat_queryset = Plat.objects.all()

            subdivision_set = self.request.GET.get('subdivision', None)
            if subdivision_set is not None:
                plat_queryset = plat_queryset.filter(subdivision=subdivision_set)

            is_approved_set = self.request.GET.get('is_approved', None)
            if is_approved_set is not None:
                is_approved_set = True if is_approved_set == 'true' else False
                plat_queryset = plat_queryset.filter(is_approved=is_approved_set)

            account_set = self.request.GET.get('account', None)
            if account_set is not None:
                plat_queryset = plat_queryset.filter(account=account_set)

            lot_set = self.request.GET.get('lot__id', None)
            if lot_set is not None:
                plat_queryset = plat_queryset.filter(lot=lot_set)

            expansion_area_set = self.request.GET.get('expansion_area', None)
            if expansion_area_set is not None:
                plat_queryset = plat_queryset.filter(expansion_area=expansion_area_set)

            plat_type_set = self.request.GET.get('plat_type', None)
            if plat_type_set is not None:
                plat_queryset = plat_queryset.filter(plat_type=plat_type_set)

            search_set = self.request.GET.get('search', None)
            if search_set is not None:
                plat_queryset = plat_queryset.filter(
                        Q(name__icontains=search_set) |
                        Q(slide__icontains=search_set) |
                        Q(expansion_area__icontains=search_set) |
                        Q(subdivision__name__icontains=search_set) |
                        Q(cabinet__icontains=search_set) |
                        Q(section__icontains=search_set) |
                        Q(block__icontains=search_set) |
                        Q(unit__icontains=search_set)
                    )

            plat_serializer = self.list(
                plat_queryset,
                PlatSerializer,
                many=True
            )
            filename = 'plat_report_' + datetime.datetime.now().strftime("%Y-%m-%d") + '.csv'

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=%s'%filename
        
        for plat in plat_serializer.data:
            subdivision = ''
            account = ''

            if plat['subdivision']:
                subdivision = plat['subdivision']['name']
            if plat['account']:
                plat_account = Account.objects.filter(id=plat['account']).first()
                account = plat_account.account_name

            row = {
                'Subdivision': subdivision,
                'Cabinet': plat['cabinet'],
                'Slide': plat['slide'],
                'Total Acreage': plat['total_acreage'],
                'Buildable Lots': plat['buildable_lots'],
                'Non-Buildable Lots': plat['non_buildable_lots'],
                'Plat Type': plat['plat_type_display'],
                'Expansion Area': plat['expansion_area'],
                'Unit': plat['unit'],
                'Block': plat['block'],
                'Section': plat['section'],
                'Non-Sewer Exactions': plat['non_sewer_due'],
                'Sewer Exactions': plat['sewer_due'],
                'Account': account,
            }

            # PLAT ZONE
            plat_zone_queryset = PlatZone.objects.filter(plat=plat['id'])
            if plat_zone_queryset is not None:
                plat_zone_serializer = self.list (
                    plat_zone_queryset,
                    PlatZoneSerializer,
                    many=True
                )

                for i, plat_zone in zip(range(plat_zone_queryset.count()), plat_zone_serializer.data):
                    headers.extend(['Zone -%s' %((i+1))])
                    headers.extend(['Acres -%s' %((i+1))])

                    row['Zone -%s' %((i+1))] = plat_zone['zone']
                    row['Acres -%s' %((i+1))] = plat_zone['acres']
                            
            # LOTS AND LOT DETAILS
            lot_queryset = Lot.objects.filter(plat=plat['id'])
            if lot_queryset is not None:
                lot_serializer = self.list (
                    lot_queryset,
                    LotSerializer,
                    many=True
                )

                for i, lot in zip(range(lot_queryset.count()), lot_serializer.data):
                    headers.extend(['Address -%s' %(i+1)])
                    headers.extend(['Permit ID -%s' %(i+1)])
                    headers.extend(['Lot Number -%s' %(i+1)])
                    headers.extend(['Parcel ID -%s' %(i+1)])
                    headers.extend(['Total Exactions -%s' %(i+1)])
                    headers.extend(['Current Exactions -%s' %(i+1)])

                    total_exactions = ''
                    current_exactions = ''

                    if lot['lot_exactions']:
                        total_exactions = lot['lot_exactions']['total_exactions']
                        current_exactions = lot['lot_exactions']['current_exactions']

                    row['Address -%s' %(i+1)] = lot['address_full']
                    row['Permit ID -%s' %(i+1)] = lot['permit_id']
                    row['Lot Number -%s' %(i+1)] = lot['lot_number']
                    row['Parcel ID -%s' %(i+1)] = lot['parcel_id']
                    row['Total Exactions -%s' %(i+1)] = total_exactions
                    row['Current Exactions -%s' %(i+1)] = current_exactions

                    payment_queryset = Payment.objects.filter(lot_id=lot['id'])
                    if payment_queryset is not None:
                        payment_serializer = self.list (
                            payment_queryset,
                            PaymentSerializer,
                            many=True
                        )

                        for j, payment in zip(range(payment_queryset.count()), payment_serializer.data):
                            headers.extend(['Payment Type -%s-%s' %((i+1), (j+1))])
                            headers.extend(['Roads Paid -%s-%s' %((i+1), (j+1))])
                            headers.extend(['Parks Paid -%s-%s' %((i+1), (j+1))])
                            headers.extend(['Storm Paid -%s-%s' %((i+1), (j+1))])
                            headers.extend(['Open Space Paid -%s-%s' %((i+1), (j+1))])
                            headers.extend(['Sewer Trans. Paid -%s-%s' %((i+1), (j+1))])
                            headers.extend(['Sewer Cap. Paid -%s-%s' %((i+1), (j+1))])

                            row['Payment Type -%s-%s' %((i+1), (j+1))] = payment['payment_type_display']
                            row['Roads Paid -%s-%s' %((i+1), (j+1))] = payment['paid_roads']
                            row['Parks Paid -%s-%s' %((i+1), (j+1))] = payment['paid_parks']
                            row['Storm Paid -%s-%s' %((i+1), (j+1))] = payment['paid_storm']
                            row['Open Space Paid -%s-%s' %((i+1), (j+1))] = payment['paid_open_space']
                            row['Sewer Trans. Paid -%s-%s' %((i+1), (j+1))] = payment['paid_sewer_trans']
                            row['Sewer Cap. Paid -%s-%s' %((i+1), (j+1))] = payment['paid_sewer_cap']

                    ledger_queryset = AccountLedger.objects.filter(lot=lot['id'])
                    if ledger_queryset is not None:
                        ledger_serializer = self.list (
                            ledger_queryset,
                            AccountLedgerSerializer,
                            many=True
                        )
                        
                        for j, ledger in zip(range(ledger_queryset.count()), ledger_serializer.data):
                            headers.extend(['Ledger Type -%s-%s' %((i+1), (j+1))])
                            headers.extend(['Roads Credits -%s-%s' %((i+1), (j+1))])
                            headers.extend(['Parks Credits -%s-%s' %((i+1), (j+1))])
                            headers.extend(['Storm Credits -%s-%s' %((i+1), (j+1))])
                            headers.extend(['Open Space Credits -%s-%s' %((i+1), (j+1))])
                            headers.extend(['Non-Sewer Credits -%s-%s' %((i+1), (j+1))])
                            headers.extend(['Sewer Trans. Credits -%s-%s' %((i+1), (j+1))])
                            headers.extend(['Sewer Cap. Credits -%s-%s' %((i+1), (j+1))])
                            headers.extend(['Sewer Credits -%s-%s' %((i+1), (j+1))])

                            row['Ledger Type -%s-%s' %((i+1), (j+1))] = ledger['entry_type_display']
                            row['Roads Credits -%s-%s' %((i+1), (j+1))] = ledger['roads']
                            row['Parks Credits -%s-%s' %((i+1), (j+1))] = ledger['parks']
                            row['Storm Credits -%s-%s' %((i+1), (j+1))] = ledger['storm']
                            row['Open Space Credits -%s-%s' %((i+1), (j+1))] = ledger['open_space']
                            row['Non-Sewer Credits -%s-%s' %((i+1), (j+1))] = ledger['non_sewer_credits']
                            row['Sewer Trans. Credits -%s-%s' %((i+1), (j+1))] = ledger['sewer_trans']
                            row['Sewer Cap. Credits -%s-%s' %((i+1), (j+1))] = ledger['sewer_cap']
                            row['Sewer Credits -%s-%s' %((i+1), (j+1))] = ledger['sewer_credits']

            all_rows.append(row)

        unique_fieldnames = []
        for name in headers:
            if name not in unique_fieldnames:
                unique_fieldnames.append(name)

        writer = csv.DictWriter(response, fieldnames=unique_fieldnames, extrasaction='ignore')
        writer.writeheader()

        for row in all_rows:
            writer.writerow(row)

        return response

class LotSearchCSVExportView(View):
    serializer_class = LotSerializer

    def get_serializer(self, queryset, many=True):
        return self.serializer_class(
            queryset,
            many=many,
        )

    def get(self, request, *args, **kwargs):
        filename = 'lot_report_' + datetime.datetime.now().strftime("%Y-%m-%d") 
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename='+filename+'.csv'

        # QUERY DB // FILTER ON PARAMS

        lots = Lot.objects.all()

        plat_set = self.request.GET.get('plat', None)
        if plat_set is not None:
            lots = lots.filter(plat=plat_set)

        is_approved_set = self.request.GET.get('is_approved', None)
        if is_approved_set is not None:
            is_approved_set = True if is_approved_set == 'true' else False
            lots = lots.filter(is_approved=is_approved_set)

        account_set = self.request.GET.get('account', None)
        if account_set is not None:
            lots = lots.filter(account=account_set)

        search_set = self.request.GET.get('search', None)
        if search_set is not None:
            lots = lots.filter(
                    Q(address_full__icontains=search_set) |
                    Q(lot_number__icontains=search_set) |
                    Q(parcel_id__icontains=search_set) |
                    Q(permit_id__icontains=search_set) |
                    Q(plat__expansion_area__icontains=search_set) |
                    Q(plat__name__icontains=search_set)
                )

        serializer = self.get_serializer(
            lots,
            many=True
        )

        # HEADERS 
        headers = [
            'Address',
            'Date Modified',
            'Latitude',
            'Longitude',
            'Lot Number',
            'Parcel ID',
            'Permit ID',
            'Plat Name',
            'Plat Type',
            'Total Exactions',
            'Sewer Due',
            'Non-Sewer Due',
            'Sewer Trans.',
            'Sewer Cap.',
            'Roads',
            'Parks',
            'Storm',
            'Open Space',
            'Current Total Due',
        ]

        # APPEND PAYMENT HEADERS FROM OUTSET BASED ON MAX PAYMENTS ON LOTS QUERY
        max_payments = Payment.objects.filter(lot_id__in=lots).values("lot_id").annotate(payments_on_lots=Count("lot_id")).aggregate(Max('payments_on_lots'))['payments_on_lots__max']

        payment_number = 1
        if max_payments is not None:
            while max_payments >= payment_number:
                headers.extend(['Pymt. Date %s' % payment_number,])
                headers.extend(['Pymt. Amt. %s' % payment_number,])
                headers.extend(['Pymt. Type %s' % payment_number,])
                payment_number += 1

        # APPEND LEDGER HEADERS FROM OUTSET BASED ON MAX LEDGERS ON LOTS QUERY
        max_ledgers = AccountLedger.objects.filter(lot__in=lots).values("lot").annotate(ledgers_on_lots=Count("lot")).aggregate(Max('ledgers_on_lots'))['ledgers_on_lots__max']

        ledger_number = 1
        if max_ledgers is not None:
            while max_ledgers >= ledger_number:
                headers.extend(['Trf. %s Date' % ledger_number])
                headers.extend(['Trf. %s Sewer' % ledger_number])
                headers.extend(['Trf. %s Non-Sewer' % ledger_number])
                headers.extend(['Trf. %s Type' % ledger_number])
                ledger_number += 1

        # WRITE HEADERS
        writer = csv.DictWriter(response, fieldnames=headers, extrasaction='ignore')
        writer.writeheader()
        # END HEADERS

        # ROWS
        for lot in serializer.data:
            plat_name = ''
            plat_type = ''

            if lot['plat']:
                plat_name = lot['plat']['name']
                plat_type = lot['plat']['plat_type_display']

            total_exactions = ''
            sewer = ''
            non_sewer = ''
            sewer_trans = ''
            sewer_cap = ''
            roads = ''
            parks = ''
            storm = ''
            open_space = ''
            current_exactions = ''

            if lot['lot_exactions']:
                total_exactions = lot['lot_exactions']['total_exactions']
                sewer = lot['lot_exactions']['sewer_due']
                non_sewer = lot['lot_exactions']['non_sewer_due']
                sewer_trans = lot['lot_exactions']['dues_sewer_trans_dev']
                sewer_cap = lot['lot_exactions']['dues_sewer_cap_dev']
                roads = lot['lot_exactions']['dues_roads_dev']
                parks = lot['lot_exactions']['dues_parks_dev']
                storm = lot['lot_exactions']['dues_storm_dev']
                open_space = lot['lot_exactions']['dues_open_space_dev']
                current_exactions = lot['lot_exactions']['current_exactions']

            row = {
                'Address': lot['address_full'],
                'Date Modified': lot['date_modified'],
                'Latitude': lot['latitude'],
                'Longitude': lot['longitude'],
                'Lot Number': lot['lot_number'],
                'Parcel ID': lot['parcel_id'],
                'Permit ID': lot['permit_id'],
                'Plat Name': plat_name,
                'Plat Type': plat_type,
                'Total Exactions': total_exactions,
                'Sewer Due': sewer,
                'Non-Sewer Due': non_sewer,
                'Sewer Trans.': sewer_trans,
                'Sewer Cap.': sewer_cap,
                'Roads': roads,
                'Parks': parks,
                'Storm': storm,
                'Open Space': open_space,
                'Current Total Due': current_exactions,
            }

            payment_queryset = Payment.objects.filter(lot_id=lot['id'])

            if payment_queryset is not None:
                payment_length_per_lot = 0
                for single_payment in payment_queryset:
                    payment_length_per_lot += 1
                    row['Pymt. Date %s' % payment_length_per_lot] = single_payment.date_created
                    row['Pymt. Amt. %s' % payment_length_per_lot] = '${:,.2f}'.format(single_payment.calculate_payment_total())
                    row['Pymt. Type %s' % payment_length_per_lot] = single_payment.payment_type

            ledger_from_queryset = AccountLedger.objects.filter(lot=lot['id'])
            if ledger_from_queryset is not None:
                ledger_length_per_lot = 0
                for ledger in ledger_from_queryset:
                    ledger_length_per_lot += 1
                    row['Trf. %s Date' % ledger_length_per_lot] = ledger.entry_date
                    row['Trf. %s Sewer' % ledger_length_per_lot] = '${:,.2f}'.format(ledger.sewer_credits)
                    row['Trf. %s Non-Sewer' % ledger_length_per_lot] = '${:,.2f}'.format(ledger.non_sewer_credits)
                    row['Trf. %s Type' % ledger_length_per_lot] = ledger.entry_type

            writer.writerow(row)


        return response