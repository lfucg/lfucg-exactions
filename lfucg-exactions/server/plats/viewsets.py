from rest_framework import viewsets
from django.db.models import Q

from .models import *
from .serializers import *
from .permissions import CanAdminister
from rest_framework.pagination import PageNumberPagination


class SubdivisionViewSet(viewsets.ModelViewSet):
    serializer_class = SubdivisionSerializer
    queryset = Subdivision.objects.all()
    permission_classes = (CanAdminister,)

    def get_queryset(self):
        queryset = Subdivision.objects.all()

        query_text = self.request.query_params.get('query', None)
        if query_text is not None:
            query_text = query_text.lower()

            queryset = queryset.filter(name__icontains=query_text)

        return queryset.order_by('name')

    def perform_create(self, serializer):
        instance = serializer.save(modified_by=self.request.user, created_by=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.save(modified_by=self.request.user)

class PlatViewSet(viewsets.ModelViewSet):
    serializer_class = PlatSerializer
    queryset = Plat.objects.all()
    permission_classes = (CanAdminister,)

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

    def perform_create(self, serializer):
        instance = serializer.save(modified_by=self.request.user, created_by=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.save(modified_by=self.request.user)

class LotViewSet(viewsets.ModelViewSet):
    serializer_class = LotSerializer
    queryset = Lot.objects.all()
    permission_classes = (CanAdminister,)


    def get_queryset(self):
        queryset = Lot.objects.all()
        PageNumberPagination.page_size = None
        paginatePage = self.request.query_params.get('paginatePage', None)
        query_text = self.request.query_params.get('query', None)

        if query_text == '':
            PageNumberPagination.page_size = 1
            pagination_class = PageNumberPagination

        if paginatePage is not None:
            PageNumberPagination.page_size = 1
            pagination_class = PageNumberPagination

        plat_set = self.request.query_params.get('plat', None)
        if plat_set is not None:
            queryset = queryset.filter(plat=plat_set)

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

    def perform_create(self, serializer):
        instance = serializer.save(modified_by=self.request.user, created_by=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.save(modified_by=self.request.user)

class PlatZoneViewSet(viewsets.ModelViewSet):
    serializer_class = PlatZoneSerializer
    queryset = PlatZone.objects.all()
    permission_classes = (CanAdminister,)

    def perform_create(self, serializer):
        instance = serializer.save(modified_by=self.request.user, created_by=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.save(modified_by=self.request.user)

class CalculationWorksheetViewSet(viewsets.ModelViewSet):
    serializer_class = CalculationWorksheetSerializer
    queryset = CalculationWorksheet.objects.all()
    