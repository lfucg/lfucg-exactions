from django.shortcuts import render
import csv
from django.views.generic import View
from django.http import HttpResponse

from .models import *
from .serializers import *
from accounts.models import *

# def export_plat_csv(request):
#     response = HttpResponse(content_type='text/csv')
#     response['Content-Disposition'] = 'attachment; filename="plat_report.csv"'


#     plat_queryset = Plat.objects.filter(id=)
#     plat_zone_queryset = PlatZone.objects.filter(plat=)

#     writer = csv.writer(response)

class PlatCSVExportView(View):
    def get(self, request, *args, **kwargs):
        plat = request.GET.get('plat')

        response = HttpResponse(content_type='text')
        response['Content-Disposition'] = 'attachment; filename="plat_report.csv"'

        plat_queryset = Plat.objects.filter(id=plat)

        writer = csv.writer(response)

        # PLAT DETAILS
        writer.writerow([
            'Subdivision',
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
        ])

        for single_plat in plat_queryset:
            writer.writerow([
                single_plat.subdivision.name,
                single_plat.account,
                single_plat.total_acreage,
                single_plat.buildable_lots,
                single_plat.non_buildable_lots,
                single_plat.plat_type,
                single_plat.expansion_area,
                single_plat.unit,
                single_plat.block,
                single_plat.section,
                single_plat.cabinet,
                single_plat.slide,
                single_plat.non_sewer_due,
                single_plat.sewer_due,
            ])

        writer.writerow([])

        # LOTS AND LOT DETAILS
        lot_queryset = Lot.objects.filter(plat=plat)

        writer.writerow([
            'Address',
            'Lot Number',
            'Parcel ID',
            'Permit ID', 
            'Latitude',
            'Longitude',
            'Non-Sewer Exactions',
            'Sewer Exactions',
            'Roads',
            # 'Roads - Own',
            'Parks',
            # 'Parks - Own',
            'Storm Water',
            # 'Storm Water - Own',
            'Open Spaces',
            # 'Open Spaces - Own',
            'Sewer Cap.',
            # 'Sewer Cap. - Own',
            'Sewer Trans.',
            # 'Sewer Trans. - Own',
        ])

        for single_lot in lot_queryset:
            non_sewer_total = (single_lot.dues_roads_own +
            single_lot.dues_roads_dev +
            single_lot.dues_sewer_cap_own +
            single_lot.dues_parks_dev +
            single_lot.dues_parks_own +
            single_lot.dues_storm_dev +
            single_lot.dues_storm_own +
            single_lot.dues_open_space_dev +
            single_lot.dues_open_space_own)

            sewer_total = (single_lot.dues_sewer_cap_own +
                single_lot.dues_sewer_trans_dev +
                single_lot.dues_sewer_trans_own +
                single_lot.dues_sewer_cap_dev)

            writer.writerow([
                single_lot.address_full,
                single_lot.lot_number,
                single_lot.parcel_id,
                single_lot.permit_id,
                single_lot.latitude,
                single_lot.longitude,
                non_sewer_total,
                sewer_total,
                single_lot.dues_roads_dev,
                # single_lot.dues_roads_own,
                single_lot.dues_parks_dev,
                # single_lot.dues_parks_own,
                single_lot.dues_storm_dev,
                # single_lot.dues_storm_own,
                single_lot.dues_open_space_dev,
                # single_lot.dues_open_space_own,
                single_lot.dues_sewer_cap_dev,
                # single_lot.dues_sewer_cap_own,
                single_lot.dues_sewer_trans_dev,
                # single_lot.dues_sewer_trans_own,
            ])

            # LOT PAYMENTS
            payment_queryset = Payment.objects.filter(lot_id=single_lot.id)
            if payment_queryset is not None:
                writer.writerow([
                    '',
                    'Payments',
                    'Payment Total',
                ])

                for single_payment in payment_queryset:
                    payment_total = (single_payment.paid_roads +
                        single_payment.paid_sewer_trans +
                        single_payment.paid_sewer_cap +
                        single_payment.paid_parks +
                        single_payment.paid_storm +
                        single_payment.paid_open_space)

                    writer.writerow([
                        '',
                        '',
                        payment_total,
                    ])

            # LOT ACCOUNT LEDGERS
            account_ledger_queryset = AccountLedger.objects.filter(lot=single_lot.id)
            if account_ledger_queryset is not None:
                writer.writerow([
                    '',
                    'Account Ledgers',
                    'Non-Sewer Credits',
                    'Sewer Credits',
                ])

                for single_ledger in account_ledger_queryset:
                    writer.writerow([
                        '',
                        '',
                        single_ledger.non_sewer_credits,
                        single_ledger.sewer_credits,
                    ])

        return response

