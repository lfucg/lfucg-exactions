from rest_framework import viewsets, status, filters
from django.db.models import Q
from django.conf import settings

from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination

from .models import *
from .serializers import *
from .permissions import CanAdminister
from .utils import update_entry

class SubdivisionViewSet(viewsets.ModelViewSet):
    serializer_class = SubdivisionSerializer
    queryset = Subdivision.objects.all()
    permission_classes = (CanAdminister,)
    filter_backends = (DjangoFilterBackend, filters.SearchFilter,)
    search_fields = ('name',)
    filter_fields = ('plat__id',)

    def get_queryset(self):
        queryset = Subdivision.objects.exclude(is_active=False)
        paginatePage = self.request.query_params.get('paginatePage', None)
        pageSize = self.request.query_params.get('pageSize', settings.PAGINATION_SIZE)
        PageNumberPagination.page_size = 0

        if paginatePage is not None:
            PageNumberPagination.page_size = pageSize
            pagination_class = PageNumberPagination
            

        return queryset.order_by('name')

    def create(self, request):
        data_set = request.data

        data_set['created_by'] = self.request.user.id
        data_set['modified_by'] = self.request.user.id

        serializer = SubdivisionSerializer(data=data_set)
        if serializer.is_valid(raise_exception=True):
            self.perform_create(serializer)
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk):
        return update_entry(self, request, pk)

class PlatViewSet(viewsets.ModelViewSet):
    serializer_class = PlatSerializer
    queryset = Plat.objects.all()
    permission_classes = (CanAdminister,)
    filter_backends = (DjangoFilterBackend, filters.SearchFilter,)
    search_fields = ('name', 'expansion_area', 'slide', 'subdivision__name', 'cabinet', 'unit', 'section', 'block',)
    filterset_fields = ('expansion_area', 'account', 'subdivision', 'plat_type', 'lot__id', 'is_approved',)

    def get_queryset(self):
        queryset = Plat.objects.exclude(is_active=False)
        PageNumberPagination.page_size = 0
        paginatePage = self.request.query_params.get('paginatePage', None)
        pageSize = self.request.query_params.get('pageSize', settings.PAGINATION_SIZE)

        if self.request.user.is_anonymous(): 
            queryset = queryset.exclude(is_approved=False)

        if paginatePage is not None:
            PageNumberPagination.page_size = pageSize
            pagination_class = PageNumberPagination

        return queryset.order_by('expansion_area')

    def create(self, request):
        data_set = request.data

        data_set['created_by'] = self.request.user.id
        data_set['modified_by'] = self.request.user.id

        serializer = PlatSerializer(data=data_set)
        if serializer.is_valid(raise_exception=True):
            self.perform_create(serializer)
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk):
        return update_entry(self, request, pk)

class LotViewSet(viewsets.ModelViewSet):
    serializer_class = LotSerializer
    queryset = Lot.objects.all()
    permission_classes = (CanAdminister,)
    filter_backends = (DjangoFilterBackend, filters.SearchFilter,)
    search_fields = ('address_full', 'lot_number', 'parcel_id', 'permit_id', 'plat__expansion_area', 'plat__name', )
    filterset_fields = ('account', 'plat', 'is_approved', 'plat__subdivision')


    def get_queryset(self):
        queryset = Lot.objects.exclude(is_active=False)
        PageNumberPagination.page_size = 0
        paginatePage = self.request.query_params.get('paginatePage', None)
        pageSize = self.request.query_params.get('pageSize', settings.PAGINATION_SIZE)

        plat_set = self.request.query_params.get('plat', None)
        if plat_set is not None:
            queryset = queryset.filter(plat=plat_set)

        if self.request.user.is_anonymous(): 
            queryset = queryset.exclude(is_approved=False)

        if paginatePage is not None:
            PageNumberPagination.page_size = pageSize
            pagination_class = PageNumberPagination

        return queryset.order_by('address_street')

    def create(self, request):
        data_set = request.data

        data_set['created_by'] = self.request.user.id
        data_set['modified_by'] = self.request.user.id

        serializer = LotSerializer(data=data_set)
        if serializer.is_valid(raise_exception=True):
            self.perform_create(serializer)
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk):
        return update_entry(self, request, pk)

class PlatZoneViewSet(viewsets.ModelViewSet):
    serializer_class = PlatZoneSerializer
    queryset = PlatZone.objects.all()
    permission_classes = (CanAdminister,)

    def get_queryset(self):
        return PlatZone.objects.exclude(is_active=False).order_by('zone')

    def create(self, request):
        data_set = request.data

        data_set['created_by'] = self.request.user.id
        data_set['modified_by'] = self.request.user.id

        serializer = PlatZoneSerializer(data=data_set)
        if serializer.is_valid(raise_exception=True):
            self.perform_create(serializer)
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk):
        return update_entry(self, request, pk)

class CalculationWorksheetViewSet(viewsets.ModelViewSet):
    serializer_class = CalculationWorksheetSerializer
    queryset = CalculationWorksheet.objects.all()
    