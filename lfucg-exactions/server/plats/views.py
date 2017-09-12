from django.shortcuts import render
import csv
from django.views.generic import View
from django.http import HttpResponse

from .models import *
from .serializers import *
from accounts.models import *
from .utils import calculate_lot_balance

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

        response = HttpResponse(content_type='text')
        response['Content-Disposition'] = 'attachment; filename="plat_report.csv"'

        plat_queryset = Plat.objects.filter(id=plat)[0]

        writer = csv.writer(response)

        plat_csv_data = [ plat_queryset.subdivision.name,
            plat_queryset.account,
            plat_queryset.total_acreage,
            plat_queryset.buildable_lots,
            plat_queryset.non_buildable_lots,
            plat_queryset.plat_type,
            plat_queryset.expansion_area,
            plat_queryset.unit,
            plat_queryset.block,
            plat_queryset.section,
            plat_queryset.cabinet,
            plat_queryset.slide,
            plat_queryset.non_sewer_due,
            plat_queryset.sewer_due,
        ]

        # LOTS AND LOT DETAILS
        lot_queryset = Lot.objects.filter(plat=plat)

        if lot_queryset is not None:
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
                'Payment Total - 1',
                'Payment Total - 2',
                'Payment Total - 3',
                'Payment Total - 4',
                'Payment Total - 5',
            ])

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

                lot_csv_data = plat_csv_data + current_lot_data
                print('LOT CSV DATA LOT END', lot_csv_data)
                        
                writer.writerow(lot_csv_data)

        return response
