from django.shortcuts import render
import csv
from django.views.generic import View
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from .models import *
from .serializers import *
from accounts.models import *
from .utils import calculate_lot_balance
from rest_framework.permissions import AllowAny

class PlatCSVExportView(View):
     def get(self, request, *args, **kwargs):
        headers = ['Subdivision',
            'Developer Account',
            'Total Acreage',
            'Buildable Lots',
            'Non-Buildable Lots',
            'Plat Type',
            'Expansion Area',
            'Unit',
            'Block',
            'Section',
            'Cabinet',
            'Slide Number',
            'Non-Sewer Exactions',
            'Sewer Exactions',
        ]

        plat = request.GET.get('plat')

        plat_queryset = Plat.objects.filter(id=plat)

        if plat_queryset is not None:
            plat_object = plat_queryset[0]
        else:
            return HttpResponse('No Plat found')
        
        plat_filename = plat_object.name + '_plat_report.csv'

        response = HttpResponse(content_type='text')
        response['Content-Disposition'] = 'attachment; filename=%s'%plat_filename

        writer = csv.writer(response)

        if plat_object.subdivision is not None:
            sub_name = plat_object.subdivision.name
        else:
            sub_name = ''

        plat_csv_data = [ sub_name,
            plat_object.account,
            plat_object.total_acreage,
            plat_object.buildable_lots,
            plat_object.non_buildable_lots,
            plat_object.plat_type,
            plat_object.expansion_area,
            plat_object.unit,
            plat_object.block,
            plat_object.section,
            plat_object.cabinet,
            plat_object.slide,
            plat_object.non_sewer_due,
            plat_object.sewer_due,
        ]

        # PLAT ZONE
        plat_zone_queryset = PlatZone.objects.filter(plat=plat)

        if plat_zone_queryset.exists():
            number_of_plat_zones = 0
            current_zone_data = []
            for zone in plat_zone_queryset:
                headers.extend(['Zone', 'Acres'])
                number_of_plat_zones = number_of_plat_zones + 1

                current_zone_data.extend([
                    zone.zone,
                    zone.acres,
                ])

            zone_csv_data = plat_csv_data + current_zone_data
                        
        # LOTS AND LOT DETAILS
        lot_queryset = Lot.objects.filter(plat=plat)

        if lot_queryset.exists():
            headers.extend([
                'Address',
                'Lot Number',
                'Parcel ID',
                'Permit ID', 
                'Latitude',
                'Longitude',
                'Roads',
                'Parks',
                'Storm Water',
                'Open Spaces',
                'Sewer Cap.',
                'Sewer Trans.',
                'Total Exactions',
                'Sewer Exactions',
                'Non-Sewer Exactions',
                'Current  Exactions',
                'Current Sewer Exactions',
                'Current Non-Sewer Exactions',
            ])
        
            payment_length_per_lot = 0
            ledger_length_per_lot = 0

            for single_lot in lot_queryset:
                payment_queryset = Payment.objects.filter(lot_id=single_lot.id)
                while len(payment_queryset) > payment_length_per_lot:
                    headers.extend(['Payment Total',])
                    payment_length_per_lot = payment_length_per_lot + 1

            for single_lot in lot_queryset:
                ledger_from_queryset = AccountLedger.objects.filter(account_from=single_lot.account)
                while len(ledger_from_queryset) > ledger_length_per_lot:
                    headers.extend(['Credits Applied'])
                    ledger_length_per_lot = ledger_length_per_lot + 1

            writer.writerow(headers)

            for single_lot in lot_queryset:
                current_lot_data = []

                current_lot_data.extend([
                    single_lot.address_full,
                    single_lot.lot_number,
                    single_lot.parcel_id,
                    single_lot.permit_id,
                    single_lot.latitude,
                    single_lot.longitude,
                    single_lot.dues_roads_dev,
                    single_lot.dues_parks_dev,
                    single_lot.dues_storm_dev,
                    single_lot.dues_open_space_dev,
                    single_lot.dues_sewer_cap_dev,
                    single_lot.dues_sewer_trans_dev,
                ])

                lot_balance = calculate_lot_balance(single_lot.id)

                current_lot_data.extend([
                    '${:,.2f}'.format(lot_balance['total_exactions']),
                    '${:,.2f}'.format(lot_balance['sewer_exactions']),
                    '${:,.2f}'.format(lot_balance['non_sewer_exactions']),
                    '${:,.2f}'.format(lot_balance['current_exactions']),
                    '${:,.2f}'.format(lot_balance['sewer_due']),
                    '${:,.2f}'.format(lot_balance['non_sewer_due']),
                ])

                # LOT PAYMENTS
                payment_queryset = Payment.objects.filter(lot_id=single_lot.id)
                if payment_queryset is not None:
                    for single_payment in payment_queryset:
                        payment_total = (single_payment.paid_roads +
                            single_payment.paid_sewer_trans +
                            single_payment.paid_sewer_cap +
                            single_payment.paid_parks +
                            single_payment.paid_storm +
                            single_payment.paid_open_space)

                        current_lot_data.extend([
                            payment_total,
                        ])

                ledger_from_queryset = AccountLedger.objects.filter(account_from=single_lot.account)
                if ledger_from_queryset is not None:
                    for account_from in ledger_from_queryset:
                        ledger_from_total = account_from.non_sewer_credits + account_from.sewer_credits

                        current_lot_data.extend([ledger_from_total,])

                if len(zone_csv_data) > 0:
                    lot_csv_data = zone_csv_data + current_lot_data
                else:
                    lot_csv_data = plat_csv_data + current_lot_data
                        
                writer.writerow(lot_csv_data)
        elif len(zone_csv_data) > 0:
            writer.writerow(headers)
            writer.writerow(zone_csv_data)
        else:
            writer.writerow(headers)
            writer.writerow(plat_csv_data)

        return response

from djqscsv import render_to_csv_response
@api_view(['GET',])
@permission_classes((AllowAny,))
def lot_search_csv_export(request):
    lots = Lot.objects.all()
    lots.filter(**request.query_params).values(
        'address_full',
        'date_modified',
        'latitude',
        'longitude',
        'lot_number',
        'parcel_id',
        'permit_id',
        'plat__name',
        'plat__plat_type',
        )

    print('we here')
    print(lots)
    # plat_set = request.query_params.get('plat', None)
    # if plat_set is not None:
    #     lots = lots.filter(plat=plat_set)

    # is_approved_set = request.query_params.get('is_approved', None)
    # if is_approved_set is not None:
    #     is_approved_set = True if is_approved_set == 'true' else False
    #     lots = lots.filter(is_approved=is_approved_set)

    # account_set = request.query_params.get('account', None)
    # if account_set is not None:
    #     lots = lots.filter(account=account_set)

    return render_to_csv_response(lots, use_verbose_names=True)
