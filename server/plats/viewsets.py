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
    serializer_class = LotSerilizer
    queryset = Lot.objects.all()

class PlatZoneViewSet(viewsets.ModelViewSet):
    serializer_class = PlatZoneSerilizer
    queryset = PlatZone.objects.all()

class CalculationWorksheetViewSet(viewsets.ModelViewSet):
    serializer_class CalculationWorksheetSerilizer
    queryset = CalculationWorksheet.objects.all()
    