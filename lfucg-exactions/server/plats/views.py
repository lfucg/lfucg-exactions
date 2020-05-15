import datetime
import csv
import operator
import numpy as np
import pandas as pd
from django.views.generic import View
from django.http import HttpResponse
from django.db.models import Count, Max, Q, Prefetch
from .models import *
from .serializers import *
from accounts.models import *
from django.contrib.contenttypes.models import ContentType
from notes.models import Note
from accounts.serializers import PaymentSerializer, AccountLedgerSerializer
from .serializers import *
from io import BytesIO

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
            subdivision_queryset = Subdivision.objects.filter(id=subdivision_value).exclude(is_active=False)
            subdivision_serializer = self.list(
                subdivision_queryset,
                SubdivisionSerializer,
                many=True
            )
            filename = subdivision_queryset[0].name + '_subdivision_report.csv'
        else:
            subdivision_queryset = Subdivision.objects.all().exclude(is_active=False)

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

            plat_queryset = Plat.objects.filter(subdivision=subdivision['id']).exclude(is_active=False)
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
            plat_queryset = Plat.objects.filter(id=plat_value).exclude(is_active=False)
            plat_serializer = self.get_serializer_class(
                PlatSerializer
            ).setup_eager_loading(plat_queryset)
            filename = plat_queryset[0].cabinet + '-' + plat_queryset[0].slide + '_plat_report.csv'
        else:
            plat_queryset = Plat.objects.exclude(is_active=False)

            subdivision_set = self.request.GET.get('subdivision', None)
            if subdivision_set is not None:
                plat_queryset = plat_queryset.filter(Q(subdivision=subdivision_set))

            is_approved_set = self.request.GET.get('is_approved', None)
            if is_approved_set is not None:
                is_approved_set = True if is_approved_set == 'true' else False
                plat_queryset = plat_queryset.filter(Q(is_approved=is_approved_set))

            account_set = self.request.GET.get('account', None)
            if account_set is not None:
                plat_queryset = plat_queryset.filter(Q(account=account_set))

            lot_set = self.request.GET.get('lot__id', None)
            if lot_set is not None:
                plat_queryset = plat_queryset.filter(Q(lot=lot_set))

            expansion_area_set = self.request.GET.get('expansion_area', None)
            if expansion_area_set is not None:
                plat_queryset = plat_queryset.filter(Q(expansion_area=expansion_area_set))

            plat_type_set = self.request.GET.get('plat_type', None)
            if plat_type_set is not None:
                plat_queryset = plat_queryset.filter(Q(plat_type=plat_type_set))

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

            plat_serializer = self.get_serializer_class(
                PlatSerializer
            ).setup_eager_loading(plat_queryset)
            filename = 'plat_report_' + datetime.datetime.now().strftime("%Y-%m-%d") + '.csv'

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=%s'%filename

        for plat in plat_serializer:
            row = {
                'Subdivision': plat.subdivision.name if plat.subdivision else '',
                'Cabinet': plat.cabinet,
                'Slide': plat.slide,
                'Total Acreage': plat.total_acreage,
                'Buildable Lots': plat.buildable_lots,
                'Non-Buildable Lots': plat.non_buildable_lots,
                'Plat Type': plat.get_plat_type_display(),
                'Expansion Area': plat.expansion_area,
                'Unit': plat.unit,
                'Block': plat.block,
                'Section': plat.section,
                'Non-Sewer Exactions': plat.non_sewer_due,
                'Sewer Exactions': plat.sewer_due,
                'Account': plat.account.account_name if plat.account else '',
            }

            if plat.plat_zone.count() > 0:
                for i, zone in zip(range(plat.plat_zone.count()), plat.plat_zone.values()):
                    headers.extend(['Zone -%s' %((i+1))])
                    headers.extend(['Acres -%s' %((i+1))])

                    row['Zone -%s' %((i+1))] = zone['zone']
                    row['Acres -%s' %((i+1))] = zone['acres']

            if plat.lot.count() > 0:

                for i, lot in zip(range(plat.lot.count()), plat.lot.values()):
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
                    #     current_exactions = lot['lot_exactions']['current_exactions']

                    row['Address -%s' %(i+1)] = lot['address_full']
                    row['Permit ID -%s' %(i+1)] = lot['permit_id']
                    row['Lot Number -%s' %(i+1)] = lot['lot_number']
                    row['Parcel ID -%s' %(i+1)] = lot['parcel_id']
                    row['Total Exactions -%s' %(i+1)] = total_exactions
                    row['Current Exactions -%s' %(i+1)] = current_exactions

                    payment_queryset = Payment.objects.filter(lot_id=lot['id']).exclude(is_active=False)
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

                    ledger_queryset = AccountLedger.objects.filter(lot=lot['id']).exclude(is_active=False)
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

        lots = Lot.objects.all().exclude(is_active=False)

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
        max_payments = Payment.objects.filter(
            lot_id__in=lots
        ).exclude(
            is_active=False
        ).values("lot_id").annotate(
            payments_on_lots=Count("lot_id")
        ).aggregate(
            Max('payments_on_lots')
        )['payments_on_lots__max']

        payment_number = 1
        if max_payments is not None:
            while max_payments >= payment_number:
                headers.extend(['Payment. Date %s' % payment_number,])
                headers.extend(['Payment. Amt. %s' % payment_number,])
                headers.extend(['Payment. Type %s' % payment_number,])
                payment_number += 1

        # APPEND LEDGER HEADERS FROM OUTSET BASED ON MAX LEDGERS ON LOTS QUERY
        max_ledgers = AccountLedger.objects.filter(
            lot__in=lots
        ).exclude(
            is_active=False
        ).values(
            "lot"
        ).annotate(
            ledgers_on_lots=Count("lot")
        ).aggregate(
            Max('ledgers_on_lots')
        )['ledgers_on_lots__max']

        ledger_number = 1
        if max_ledgers is not None:
            while max_ledgers >= ledger_number:
                headers.extend(['Credit Change. %s Date' % ledger_number])
                headers.extend(['Credit Change. %s Sewer' % ledger_number])
                headers.extend(['Credit Change. %s Non-Sewer' % ledger_number])
                headers.extend(['Credit Change. %s Type' % ledger_number])
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
                sewer = lot['lot_exactions']['sewer_exactions']
                non_sewer = lot['lot_exactions']['non_sewer_exactions']
                sewer_trans = lot['current_dues_sewer_trans_dev']
                sewer_cap = lot['current_dues_sewer_cap_dev']
                roads = lot['current_dues_roads_dev']
                parks = lot['current_dues_parks_dev']
                storm = lot['current_dues_storm_dev']
                open_space = lot['current_dues_open_space_dev']
            #     current_exactions = lot['lot_exactions']['current_exactions']

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

            payment_queryset = Payment.objects.filter(lot_id=lot['id']).exclude(is_active=False)

            if payment_queryset is not None:
                payment_length_per_lot = 0
                for single_payment in payment_queryset:
                    payment_length_per_lot += 1
                    row['Payment. Date %s' % payment_length_per_lot] = single_payment.date_created
                    row['Payment. Amt. %s' % payment_length_per_lot] = '${:,.2f}'.format(single_payment.calculate_payment_total())
                    row['Payment. Type %s' % payment_length_per_lot] = single_payment.payment_type

            ledger_from_queryset = AccountLedger.objects.filter(lot=lot['id']).exclude(is_active=False)
            if ledger_from_queryset is not None:
                ledger_length_per_lot = 0
                for ledger in ledger_from_queryset:
                    ledger_length_per_lot += 1
                    row['Credit Change. %s Date' % ledger_length_per_lot] = ledger.entry_date
                    row['Credit Change. %s Sewer' % ledger_length_per_lot] = '${:,.2f}'.format(ledger.sewer_credits)
                    row['Credit Change. %s Non-Sewer' % ledger_length_per_lot] = '${:,.2f}'.format(ledger.non_sewer_credits)
                    row['Credit Change. %s Type' % ledger_length_per_lot] = ledger.entry_type

            writer.writerow(row)

        return response

class AdminLotSearchCSVExportView(View):
    def get(self, request, *args, **kwargs):
        try:
            lots = Lot.objects.all().filter(is_active=True).prefetch_related(
                Prefetch(
                    'plat',
                    queryset=Plat.objects.all().prefetch_related(
                        'subdivision',
                        'plat_zone',
                    ),
                ),
                Prefetch(
                    'payment',
                    queryset=Payment.objects.all().prefetch_related(
                        'credit_account',
                        'credit_source',
                    )
                ),
                Prefetch(
                    'ledger_lot',
                    queryset=AccountLedger.objects.all().prefetch_related(
                        'account_from',
                        'account_to',
                        'agreement',
                    )
                ),
            )

            plat_filter = self.request.GET.get('plat', None)
            if plat_filter is not None:
                lots = lots.filter(Q(plat=plat_filter))

            is_approved_filter = self.request.GET.get('is_approved', None)
            if is_approved_filter is not None:
                is_approved_filter = True if is_approved_filter == 'true' else False
                lots = lots.filter(Q(is_approved=is_approved_filter))

            account_filter = self.request.GET.get('account', None)
            if account_filter is not None:
                lots = lots.filter(Q(account=account_filter))

            search_filter = self.request.GET.get('search', None)
            if search_filter is not None:
                lots = lots.filter(Q(
                    Q(address_full__icontains=search_filter) |
                    Q(lot_number__icontains=search_filter) |
                    Q(parcel_id__icontains=search_filter) |
                    Q(permit_id__icontains=search_filter) |
                    Q(plat__expansion_area__icontains=search_filter) |
                    Q(plat__name__icontains=search_filter)
                ))

            lot_fields = [
                'id', 'lot_number', 'permit_id',
                'address_number', 'address_street', 'address_full',
                'alternative_address_number', 'alternative_address_street',
                'dues_roads_dev', 'dues_roads_own',
                'dues_sewer_trans_dev', 'dues_sewer_trans_own',
                'dues_sewer_cap_dev', 'dues_sewer_cap_own',
                'dues_parks_dev', 'dues_parks_own',
                'dues_storm_dev', 'dues_storm_own',
                'dues_open_space_dev', 'dues_open_space_own',
                'current_dues_sewer_trans_dev', 'current_dues_sewer_trans_own',
                'current_dues_sewer_cap_dev', 'current_dues_sewer_cap_own',
                'current_dues_parks_dev', 'current_dues_parks_own',
                'current_dues_storm_dev', 'current_dues_storm_own',
                'current_dues_open_space_dev', 'current_dues_open_space_own',
                'certificate_of_occupancy_final', 'certificate_of_occupancy_conditional',
                'plat_id',
            ]

            df = pd.DataFrame.from_records(lots.values(), columns=lot_fields) 
            lot_ids = list(set([lot.id for lot in lots.all()]))
            plat_ids = list(set([
                lot.plat.id for lot in lots.all()
                if operator.attrgetter('plat')(lot)
            ]))
            subdivision_ids = list(set([
                operator.attrgetter('plat.subdivision.id')(lot) 
                for lot in lots.all() 
                if (operator.attrgetter('plat.subdivision')(lot) and operator.attrgetter('plat')(lot))
            ]))

            # Plats
            plat_fields = [
                'id', 'name', 'cabinet', 'slide', 'expansion_area', 'unit',
                'section', 'block', 'calculation_note',
                'subdivision__name', 'subdivision_id',
            ]
            df_plat = pd.DataFrame.from_records(Plat.objects.filter(pk__in=plat_ids).values(), columns=plat_fields)
            df_plat = df_plat.rename(columns={'id': 'pk'})

            df_subdivision = pd.DataFrame.from_records(Subdivision.objects.filter(pk__in=subdivision_ids).values(), columns=['id', 'name'])
            df_subdivision = df_subdivision.rename(columns={'id': 'pk'})

            # Merge subdivisions into plats
            if not df_subdivision.empty:
                df_plat = pd.merge(
                    df_plat,
                    df_subdivision,
                    left_on='subdivision_id',
                    right_on='pk',
                    how='left',
                    suffixes=['', '_subdivision']
                )

            # Plat Zones
            plat_zone_fields = ['plat_id', 'zone',]
            df_plat_zone = pd.DataFrame.from_records(PlatZone.objects.filter(plat__id__in=plat_ids).values(), columns=plat_zone_fields)

            # Payments
            payment_fields = [
                'lot_id_id', 'credit_source__resolution_number', 'credit_account__account_name',
                'entry_date', 'paid_roads', 'paid_sewer_trans',
                'paid_sewer_cap', 'paid_parks', 'paid_storm', 'paid_open_space',
            ]
            df_payments_frame = pd.DataFrame.from_records(Payment.objects.filter(lot_id__id__in=lot_ids).values(
                'lot_id_id', 'credit_source__resolution_number', 'credit_account__account_name',
                'entry_date', 'paid_roads', 'paid_sewer_trans',
                'paid_sewer_cap', 'paid_parks', 'paid_storm', 'paid_open_space',
            ), columns=payment_fields)
            df_payments_frame = df_payments_frame.rename(columns={
                'credit_source__resolution_number': 'Agreement',
                'credit_account__account_name': 'Account',
                'entry_date': 'Entry Date',
                'paid_roads': 'Payment Roads',
                'paid_sewer_trans': 'Payment Sewer Trans.',
                'paid_sewer_cap': 'Payment Sewer Cap.',
                'paid_parks': 'Payment Parks',
                'paid_storm': 'Payment Storm',
                'paid_open_space': 'Payment Open Space',
            })

            df_payments = df_payments_frame.set_index(['lot_id_id', df_payments_frame.groupby(['lot_id_id']).cumcount()+1]).unstack().sort_index(level=1, axis=1)
            df_payments.columns = df_payments.columns.map('{0[0]}_{0[1]}'.format)
            df_payments.reset_index()

            # Account Ledgers
            ledger_fields = [
                'entry_date', 'account_from__account_name', 'account_to__account_name',
                'lot_id', 'agreement__resolution_number', 'entry_type',
                'non_sewer_credits', 'sewer_credits',
                'roads', 'parks', 'storm', 'open_space',
                'sewer_trans', 'sewer_cap',
            ]
            df_ledgers_frame = pd.DataFrame.from_records(AccountLedger.objects.filter(lot__id__in=lot_ids).values(
                'entry_date', 'account_from__account_name', 'account_to__account_name',
                'lot_id', 'agreement__resolution_number', 'entry_type',
                'non_sewer_credits', 'sewer_credits',
                'roads', 'parks', 'storm', 'open_space',
                'sewer_trans', 'sewer_cap',
            ), columns=ledger_fields)
            df_ledgers_frame = df_ledgers_frame.rename(columns={
                'entry_date': 'Credit Entry Date',
                'account_from__account_name': 'Credit Account From',
                'account_to__account_name': 'Credit Account To',
                'agreement__resolution_number': 'Credit Agreement',
                'entry_type': 'Credit Entry Type',
                'non_sewer_credits': 'Credit Non-Sewer',
                'sewer_credits': 'Credit Sewer',
                'roads': 'Credit Roads',
                'parks': 'Credit Parks',
                'storm': 'Credit Storm',
                'open_space': 'Credit Open Space',
                'sewer_trans': 'Credit Sewer Trans.',
                'sewer_cap': 'Credit Sewer Cap.',
            })

            df_ledgers = df_ledgers_frame.set_index(['lot_id', df_ledgers_frame.groupby(['lot_id']).cumcount()+1]).unstack().sort_index(level=1, axis=1)
            df_ledgers.columns = df_ledgers.columns.map('{0[0]}_{0[1]}'.format)
            df_ledgers.reset_index()

            # Notes
            note_fields = ['object_id', 'note']

            lot_content = ContentType.objects.get_for_model(Lot)
            lot_notes = pd.DataFrame.from_records(Note.objects.filter(
                content_type=lot_content,
                object_id__in=lot_ids,
            ).values(), columns=note_fields)

            plat_content = ContentType.objects.get_for_model(Plat)
            plat_notes = pd.DataFrame.from_records(Note.objects.filter(
                content_type=plat_content,
                object_id__in=plat_ids,
            ).values(), columns=note_fields)


            subdivision_content = ContentType.objects.get_for_model(Subdivision)
            subdivision_notes = pd.DataFrame.from_records(Note.objects.filter(
                content_type=subdivision_content,
                object_id__in=subdivision_ids,
            ).values(), columns=note_fields)

            # Merge data frames
            final_df = df

            # Merge lots and plats
            if not df_plat.empty:
                final_df = pd.merge(
                    df,
                    df_plat,
                    left_on='plat_id',
                    right_on='pk',
                    how='left',
                    suffixes=['', '_plat']
                )

            # Merge plat zones
            if not df_plat_zone.empty:
                final_df = pd.merge(
                    final_df,
                    df_plat_zone,
                    left_on='plat_id',
                    right_on='plat_id',
                    how='left',
                    suffixes=['', '_zone']
                )
            # Merge payments
            if not df_payments.empty:
                final_df = pd.merge(
                    final_df,
                    df_payments,
                    left_on='id',
                    right_on='lot_id_id',
                    how='left',
                    suffixes=['', '_payment']
                )
            # Merge account ledgers
            if not df_ledgers.empty:
                final_df = pd.merge(
                    final_df,
                    df_ledgers,
                    left_on='id',
                    right_on='lot_id',
                    how='left',
                    suffixes=['', '_ledger']
                )
            # Merge notes made on lots
            if not lot_notes.empty:
                final_df = pd.merge(
                    final_df,
                    lot_notes,
                    left_on='id',
                    right_on='object_id',
                    how='left',
                    suffixes=['', '_lot_note']
                )
            # Merge notes made on plats
            if not plat_notes.empty:
                final_df = pd.merge(
                    final_df,
                    plat_notes,
                    left_on='plat_id',
                    right_on='object_id',
                    how='left',
                    suffixes=['', '_plat_note']
                )
            # Merge notes made on subdivisions
            if not subdivision_notes.empty:
                final_df = pd.merge(
                    final_df,
                    subdivision_notes,
                    left_on='subdivision_id_plat',
                    right_on='object_id',
                    how='left',
                    suffixes=['', '_subdivision_note']
                )

            # final_df = final_df.set_index(['address_full'])
            final_df = final_df.drop(
                [
                    'id', 'plat_id', 'pk',
                    'pk_subdivision',
                    'object_id', 
                ], axis=1
            ).rename(columns={
                'lot_number': 'Lot No.',
                'permit_id': 'Permit No.',
                'address_number': 'Street No.',
                'address_street': 'Street', 
                'address_full': 'Address',
                'alternative_address_number': 'Alt. Street No.',
                'alternative_address_street': 'Alt. Street',
                'dues_roads_dev': 'Dev. Roads Exactions',
                'dues_roads_own': 'Own Roads Exactions',
                'dues_sewer_trans_dev': 'Dev. Sewer Trans. Exactions',
                'dues_sewer_trans_own': 'Own Sewer Trans. Exactions',
                'dues_sewer_cap_dev': 'Dev. Sewer Cap. Exactions',
                'dues_sewer_cap_own': 'Own Sewer Cap. Exactions',
                'dues_parks_dev': 'Dev. Parks Exactions',
                'dues_parks_own': 'Own Parks Exactions',
                'dues_storm_dev': 'Dev. Storm Exactions',
                'dues_storm_own': 'Own Storm Exactions',
                'dues_open_space_dev': 'Dev. Open Space Exactions',
                'dues_open_space_own': 'Own Open Space Exactions',
                'current_dues_sewer_trans_dev': 'Current Sewer Trans. Dev. Balance',
                'current_dues_sewer_trans_own': 'Current Sewer Trans. Own Balance',
                'current_dues_sewer_cap_dev': 'Current Sewer Cap. Dev. Balance',
                'current_dues_sewer_cap_own': 'Current Sewer Cap. Own Balance',
                'current_dues_parks_dev': 'Current Parks Dev. Balance',
                'current_dues_parks_own': 'Current Parks Own Balance',
                'current_dues_storm_dev': 'Current Storm Dev. Balance',
                'current_dues_storm_own': 'Current Storm Own Balance',
                'current_dues_open_space_dev': 'Current Open Space Dev. Balance',
                'current_dues_open_space_own': 'Current Open Space Own Balance',
                'certificate_of_occupancy_final': 'CO Date Final',
                'certificate_of_occupancy_conditional': 'CO Date Conditional',
                'name': 'Plat Name',
                'cabinet': 'Cabinet',
                'slide': 'Slide',
                'expansion_area': 'Expansion Area',
                'unit': 'Unit',
                'section': 'Section',
                'block': 'Block',
                'calculation_note': 'Plat Calc. Notes',
                'name_subdivision': 'Subdivision',
            }).set_index(['Address']).sort_values(by=['Street', 'Street No.'])

            with BytesIO() as b:
                # Use the StringIO object as the filehandle.
                writer = pd.ExcelWriter(b)
                final_df.to_excel(writer, sheet_name='Lots')
                writer.save()
                return HttpResponse(b.getvalue(), content_type='application/vnd.ms-excel')
        except Exception as ex:
            print('EXCEPTION ADMIN LOT EXPORT', ex)
            return HttpResponse(ex, status=403)
