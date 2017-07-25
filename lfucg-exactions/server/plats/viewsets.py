from rest_framework import viewsets

from .models import *
from .serializers import *

class SubdivisionViewSet(viewsets.ModelViewSet):
    serializer_class = SubdivisionSerializer
    queryset = Subdivision.objects.all()

class PlatViewSet(viewsets.ModelViewSet):
    serializer_class = PlatSerializer
    queryset = Plat.objects.all()

class LotViewSet(viewsets.ModelViewSet):
    serializer_class = LotSerializer
    queryset = Lot.objects.all()

    def get_queryset(self):
        queryset = Lot.objects.order_by('address_street')

        query_text = self.request.query_params.get('query', None)
        if query_text is not None:
            query_text = query_text.lower()
            tmp_set = queryset.filter(address_full__icontains=query_text)
            tmp_set |= queryset.filter(lot_number__icontains=query_text)
            tmp_set |= queryset.filter(parcel_id__icontains=query_text)
            tmp_set |= queryset.filter(permit_id__icontains=query_text)
            tmp_set |= queryset.filter(plat__expansion_area__icontains=query_text)

            queryset = tmp_set

        return queryset.order_by('address_street')


class PlatZoneViewSet(viewsets.ModelViewSet):
    serializer_class = PlatZoneSerializer
    queryset = PlatZone.objects.all()

class CalculationWorksheetViewSet(viewsets.ModelViewSet):
    serializer_class = CalculationWorksheetSerializer
    queryset = CalculationWorksheet.objects.all()
    