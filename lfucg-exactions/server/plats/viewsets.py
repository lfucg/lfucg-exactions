from rest_framework import viewsets
from django.db.models import Q

from .models import *
from .serializers import *

class SubdivisionViewSet(viewsets.ModelViewSet):
    serializer_class = SubdivisionSerializer
    queryset = Subdivision.objects.all()

    def get_queryset(self):
        queryset = Subdivision.objects.all()

        query_text = self.request.query_params.get('query', None)
        if query_text is not None:
            query_text = query_text.lower()

            queryset = queryset.filter(name__icontains=query_text)

        return queryset.order_by('name')

class PlatViewSet(viewsets.ModelViewSet):
    serializer_class = PlatSerializer
    queryset = Plat.objects.all()

    def get_queryset(self):
        queryset = Plat.objects.all()

        query_text = self.request.query_params.get('query', None)
        if query_text is not None:
            query_text = query_text.lower()

            queryset = queryset.filter(
                Q(name__icontains=query_text) |
                Q(expansion_area__icontains=query_text) |
                Q(slide__icontains=query_text) |
                Q(subdivision__name__icontains=query_text))

        return queryset.order_by('expansion_area')

class LotViewSet(viewsets.ModelViewSet):
    serializer_class = LotSerializer
    queryset = Lot.objects.all()

    def get_queryset(self):
        queryset = Lot.objects.all()

        query_text = self.request.query_params.get('query', None)
        if query_text is not None:
            query_text = query_text.lower()

            queryset = queryset.filter(
                Q(address_full__icontains=query_text) |
                Q(lot_number__icontains=query_text) |
                Q(parcel_id__icontains=query_text) |
                Q(permit_id__icontains=query_text) |
                Q(plat__expansion_area__icontains=query_text) |
                Q(plat__name__icontains=query_text))

        return queryset.order_by('address_street')


class PlatZoneViewSet(viewsets.ModelViewSet):
    serializer_class = PlatZoneSerializer
    queryset = PlatZone.objects.all()

class CalculationWorksheetViewSet(viewsets.ModelViewSet):
    serializer_class = CalculationWorksheetSerializer
    queryset = CalculationWorksheet.objects.all()
    