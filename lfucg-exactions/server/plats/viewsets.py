from django.db.models import Prefetch
from rest_framework import viewsets, status, filters
from django.db.models import Q
from django.conf import settings

from rest_framework.response import Response
# from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination

from .models import *
from .serializers import *
from .permissions import CanAdminister
from .utils import update_entry

class SubdivisionViewSet(viewsets.ModelViewSet):
    serializer_class = SubdivisionSerializer
    queryset = Subdivision.objects.all()
    permission_classes = (CanAdminister,)
    filter_backends = (filters.DjangoFilterBackend, filters.SearchFilter,)
    search_fields = ('name', 'plat__name',)
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

class SubdivisionQuickViewSet(viewsets.ModelViewSet):
    serializer_class = SubdivisionQuickSerializer
    queryset = Subdivision.objects.filter(is_active=True).order_by('name')
    pagination_class = None

class PlatViewSet(viewsets.ModelViewSet):
    serializer_class = PlatSerializer
    queryset = Plat.objects.none()
    permission_classes = (CanAdminister,)
    filter_backends = (filters.DjangoFilterBackend, filters.SearchFilter,)
    search_fields = ('name', 'expansion_area', 'slide', 'subdivision__name', 'account__account_name', 'cabinet', 'unit', 'section', 'block', 'cabinet_slide',)
    filter_fields = ('expansion_area', 'account', 'subdivision', 'plat_type', 'lot__id', 'is_approved',)

    def get_queryset(self):
        queryset = Plat.objects.all()
        queryset = self.get_serializer_class().setup_eager_loading(queryset)

        PageNumberPagination.page_size = 0
        paginatePage = self.request.query_params.get('paginatePage', None)
        pageSize = self.request.query_params.get('pageSize', settings.PAGINATION_SIZE)

        show_inactive = self.request.query_params.get('showDeleted', False)
        if show_inactive:
            print('Show deleted entries')
        else:
            queryset = queryset.exclude(is_active=False)

        if self.request.user.is_anonymous(): 
            queryset = queryset.exclude(is_approved=False)

        if paginatePage is not None:
            PageNumberPagination.page_size = pageSize
            pagination_class = PageNumberPagination

        return queryset.order_by('cabinet', 'slide')

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

class PlatQuickViewSet(viewsets.ModelViewSet):
    serializer_class = PlatQuickSerializer
    queryset = Plat.objects.none()

    def get_queryset(self):
        queryset = Plat.objects.filter(is_active=True)

        PageNumberPagination.page_size = 0
        paginatePage = self.request.query_params.get('paginatePage', None)
        pageSize = self.request.query_params.get('pageSize', settings.PAGINATION_SIZE)

        if paginatePage is not None:
            PageNumberPagination.page_size = 10
            pagination_class = PageNumberPagination
        
        return queryset.order_by('cabinet', 'slide')

class LotViewSet(viewsets.ModelViewSet):
    serializer_class = LotSerializer
    queryset = Lot.objects.all()
    permission_classes = (CanAdminister,)
    filter_backends = (filters.DjangoFilterBackend, filters.SearchFilter,)
    search_fields = ('address_full', 'lot_number', 'parcel_id', 'permit_id', 'plat__expansion_area', 'plat__name', )
    filter_fields = ('account', 'plat', 'is_approved', 'plat__subdivision__id', 'ledger_lot',)

    def get_queryset(self):
        queryset = Lot.objects.all()
        PageNumberPagination.page_size = 0
        paginatePage = self.request.query_params.get('paginatePage', None)
        pageSize = self.request.query_params.get('pageSize', settings.PAGINATION_SIZE)

        show_inactive = self.request.query_params.get('showDeleted', False)
        if show_inactive:
            print('Show deleted entries')
        else:
            queryset = queryset.exclude(is_active=False)
        plat_set = self.request.query_params.get('plat', None)
        if plat_set is not None:
            queryset = queryset.filter(plat=plat_set)

        if self.request.user.is_anonymous(): 
            queryset = queryset.exclude(is_approved=False)

        if paginatePage is not None:
            PageNumberPagination.page_size = pageSize
            pagination_class = PageNumberPagination

        return queryset.order_by('address_street', 'address_number', 'address_unit')

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

class LotQuickViewSet(viewsets.ModelViewSet):
    serializer_class = LotQuickSerializer
    queryset = Lot.objects.none()
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('plat',)

    def get_queryset(self):
        queryset = Lot.objects.filter(is_active=True)

        PageNumberPagination.page_size = 0
        paginatePage = self.request.query_params.get('paginatePage', None)
        pageSize = self.request.query_params.get('pageSize', settings.PAGINATION_SIZE)

        if paginatePage is not None:
            PageNumberPagination.page_size = 10
            pagination_class = PageNumberPagination
        
        return queryset.order_by('address_street', 'address_number', 'address_unit')

class LotExactionsViewSet(viewsets.ModelViewSet):
    serializer_class = LotExactionsSerializer
    queryset = Lot.objects.filter(is_active=True).order_by('address_street', 'address_number', 'address_unit')

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
    