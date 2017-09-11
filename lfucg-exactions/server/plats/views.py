from django.shortcuts import render
import csv
from django.views.generic import View
from django.http import HttpResponse

from .models import *
from .serializers import *

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
            'Total Acreage',
            'Buildable Lots',
            'Non-Buildable Lots',
        ])

        for single_plat in plat_queryset:
            writer.writerow([
                single_plat.subdivision.name,
                single_plat.total_acreage,
                single_plat.buildable_lots,
                single_plat.non_buildable_lots,
            ])

        # LOTS AND LOT DETAILS
        lot_queryset = Lot.objects.filter(plat=plat)

        writer.writerow([
            'Address',
            'Parcel ID', 
            'Non-Sewer Exactions',
            'Sewer Exactions',
        ])

        for single_lot in lot_queryset:
            non_sewer_total = single_lot.dues_roads_own + single_lot.dues_roads_dev + single_lot.dues_sewer_cap_own + single_lot.dues_sewer_trans_dev + single_lot.dues_sewer_trans_own + single_lot.dues_sewer_cap_dev + single_lot.dues_sewer_cap_own + single_lot.dues_parks_dev + single_lot.dues_parks_own + single_lot.dues_storm_dev + single_lot.dues_storm_own + single_lot.dues_open_space_dev + single_lot.dues_open_space_own


            writer.writerow([
                single_lot.address_full,
                single_lot.parcel_id,
                single_lot
            ])


        return response

