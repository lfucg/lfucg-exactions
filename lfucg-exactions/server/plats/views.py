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

        plat_queryset = Plat.objects.filter(id=plat)
        if plat_queryset is not None:
            plat_queryset = plat_queryset[0]

        plat_filename = plat_queryset.name + '_plat_report.csv'

        response = HttpResponse(content_type='text')
        response['Content-Disposition'] = 'attachment; filename=%s'%plat_filename

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
                    headers.extend(['Account Ledger Credits Spent'])
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


                lot_csv_data = plat_csv_data + current_lot_data
                        
                writer.writerow(lot_csv_data)

        return response
