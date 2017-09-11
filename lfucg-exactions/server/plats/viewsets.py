from rest_framework import viewsets, status
from django.db.models import Q
from rest_framework.response import Response

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
        PageNumberPagination.page_size = None
        paginatePage = self.request.query_params.get('paginatePage', None)

        if query_text == '':
            PageNumberPagination.page_size = 10
            pagination_class = PageNumberPagination

        if paginatePage is not None:
            PageNumberPagination.page_size = 10
            pagination_class = PageNumberPagination
            
        if query_text is not None:
            query_text = query_text.lower()

            queryset = queryset.filter(name__icontains=query_text)

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
        existing_object  = self.get_object()
        setattr(existing_object, 'modified_by', request.user)
        for key, value in request.data.items():
            for existing_object_key, existing_object_value in existing_object.__dict__.items():
                if key == existing_object_key:
                    if value != existing_object_value:
                        setattr(existing_object, existing_object_key, value)
        try:
            existing_object.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class PlatViewSet(viewsets.ModelViewSet):
    serializer_class = PlatSerializer
    queryset = Plat.objects.all()
    permission_classes = (CanAdminister,)

    def get_queryset(self):
        queryset = Plat.objects.all()
        PageNumberPagination.page_size = None
        paginatePage = self.request.query_params.get('paginatePage', None)
        query_text = self.request.query_params.get('query', None)
        
        if query_text == '':
            PageNumberPagination.page_size = 10
            pagination_class = PageNumberPagination

        if paginatePage is not None:
            PageNumberPagination.page_size = 10
            pagination_class = PageNumberPagination

        if query_text is not None:
            query_text = query_text.lower()

            queryset = queryset.filter(
                Q(name__icontains=query_text) |
                Q(expansion_area__icontains=query_text) |
                Q(slide__icontains=query_text) |
                Q(subdivision__name__icontains=query_text))

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
        existing_object  = self.get_object()
        setattr(existing_object, 'modified_by', request.user)
        for key, value in request.data.items():
            for existing_object_key, existing_object_value in existing_object.__dict__.items():
                if key == existing_object_key:
                    if value != existing_object_value:
                        setattr(existing_object, existing_object_key, value)
        try:
            existing_object.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class LotViewSet(viewsets.ModelViewSet):
    serializer_class = LotSerializer
    queryset = Lot.objects.all()
    permission_classes = (CanAdminister,)


    def get_queryset(self):
        queryset = Lot.objects.all()
        query_text = self.request.query_params.get('query', None)
        PageNumberPagination.page_size = None
        paginatePage = self.request.query_params.get('paginatePage', None)

        if query_text == '':
            PageNumberPagination.page_size = 10
            pagination_class = PageNumberPagination

        if paginatePage is not None:
            PageNumberPagination.page_size = 10
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
        existing_object  = self.get_object()
        setattr(existing_object, 'modified_by', request.user)
        for key, value in request.data.items():
            for existing_object_key, existing_object_value in existing_object.__dict__.items():
                if key == existing_object_key:
                    if value != existing_object_value:
                        setattr(existing_object, existing_object_key, value)
        try:
            existing_object.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class PlatZoneViewSet(viewsets.ModelViewSet):
    serializer_class = PlatZoneSerializer
    queryset = PlatZone.objects.all()
    permission_classes = (CanAdminister,)

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
        existing_object  = self.get_object()
        setattr(existing_object, 'modified_by', request.user)
        for key, value in request.data.items():
            for existing_object_key, existing_object_value in existing_object.__dict__.items():
                if key == existing_object_key:
                    if value != existing_object_value:
                        setattr(existing_object, existing_object_key, value)
        try:
            existing_object.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class CalculationWorksheetViewSet(viewsets.ModelViewSet):
    serializer_class = CalculationWorksheetSerializer
    queryset = CalculationWorksheet.objects.all()
    