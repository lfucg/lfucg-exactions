
from rest_framework.pagination import PageNumberPagination
from rest_framework import viewsets, status, filters
from django.db.models import Q
from rest_framework.response import Response

from django.contrib.auth.models import User
from .models import *
from .serializers import *
from .permissions import CanAdminister

from django.conf import settings

from django_filters.rest_framework import DjangoFilterBackend

from plats.models import Plat, Lot


class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    queryset = Account.objects.all()
    permission_classes = (CanAdminister,)
    filter_backends = (DjangoFilterBackend, filters.SearchFilter,)
    filter_fields = ('plat_account__id', 'lot_account__id')
    search_fields = ('account_name', 'contact_full_name', 'address_full', 'phone', 'email',)

    def get_queryset(self):
        queryset = Account.objects.all()
        PageNumberPagination.page_size = 0
        
        paginatePage = self.request.query_params.get('paginatePage', None)
        query_text = self.request.query_params.get('query', None)

        if query_text is not None:
            query_text = query_text.lower()
            queryset = queryset.filter(
                Q(account_name__icontains=query_text) |
                Q(contact_full_name__icontains=query_text) |
                Q(address_full=query_text) |
                Q(phone__icontains=query_text) |
                Q(email__icontains=query_text))


        if paginatePage is not None:
            pagination_class = PageNumberPagination
            PageNumberPagination.page_size = settings.PAGINATION_SIZE

        return queryset.order_by('account_name')

    def create(self, request):
        data_set = request.data

        data_set['created_by'] = self.request.user.id
        data_set['modified_by'] = self.request.user.id

        serializer = AccountSerializer(data=data_set)
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

class AgreementViewSet(viewsets.ModelViewSet):
    serializer_class = AgreementSerializer
    queryset = Agreement.objects.all()
    permission_classes = (CanAdminister,)

    def get_queryset(self):
        queryset = Agreement.objects.all()
        paginatePage = self.request.query_params.get('paginatePage', None)

        account_id_set = self.request.query_params.get('account_id', None)
        if account_id_set is not None:
            queryset = queryset.filter(account_id=account_id_set)

        query_text = self.request.query_params.get('query', None)
        if query_text is not None:
            query_text = query_text.lower()
            queryset = queryset.filter(
                Q(account_id__account_name__icontains=query_text) |
                Q(resolution_number__icontains=query_text) |
                Q(agreement_type__icontains=query_text) |
                Q(expansion_area__icontains=query_text))
            
        if paginatePage is not None:
            pagination_class = PageNumberPagination
            PageNumberPagination.page_size = settings.PAGINATION_SIZE

        return queryset.order_by('expansion_area')

    def create(self, request):
        data_set = request.data

        data_set['created_by'] = self.request.user.id
        data_set['modified_by'] = self.request.user.id

        serializer = AgreementSerializer(data=data_set)
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
            
class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    queryset = Payment.objects.all()
    permission_classes = (CanAdminister,)

    def get_queryset(self):
        queryset = Payment.objects.all()
        PageNumberPagination.page_size = 0

        paginatePage = self.request.query_params.get('paginatePage', None)
        if paginatePage is not None:
            pagination_class = PageNumberPagination
            PageNumberPagination.page_size = settings.PAGINATION_SIZE

        lot_id_set = self.request.query_params.get('lot_id', None)
        if lot_id_set is not None:
            queryset = queryset.filter(lot_id=lot_id_set)

        credit_account_set = self.request.query_params.get('credit_account', None)
        if credit_account_set is not None:
            queryset = queryset.filter(credit_account=credit_account_set)

        credit_source_set = self.request.query_params.get('credit_source', None)
        if credit_source_set is not None:
            queryset = queryset.filter(credit_source=credit_source_set)

        return queryset.order_by('-date_created')

    def create(self, request):
        data_set = request.data

        data_set['created_by'] = self.request.user.id
        data_set['modified_by'] = self.request.user.id

        serializer = PaymentSerializer(data=data_set)
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
            
class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()
    permission_classes = (CanAdminister,)

    def get_queryset(self):
        queryset = Project.objects.all()

        agreement_id_set = self.request.query_params.get('agreement_id', None)
        if agreement_id_set is not None:
            queryset = queryset.filter(agreement_id=agreement_id_set)

        return queryset

    def create(self, request):
        data_set = request.data

        data_set['created_by'] = self.request.user.id
        data_set['modified_by'] = self.request.user.id

        serializer = ProjectSerializer(data=data_set)
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
            
class ProjectCostEstimateViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectCostEstimateSerializer
    queryset = ProjectCostEstimate.objects.all()
    permission_classes = (CanAdminister,)

    def get_queryset(self):
        queryset = ProjectCostEstimate.objects.all()
        PageNumberPagination.page_size = 0

        paginatePage = self.request.query_params.get('paginatePage', None)
        if paginatePage is not None:
            pagination_class = PageNumberPagination
            PageNumberPagination.page_size = settings.PAGINATION_SIZE

        return queryset

    def create(self, request):
        data_set = request.data

        data_set['created_by'] = self.request.user.id
        data_set['modified_by'] = self.request.user.id

        serializer = ProjectCostEstimateSerializer(data=data_set)
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
            
class AccountLedgerViewSet(viewsets.ModelViewSet):
    serializer_class = AccountLedgerSerializer
    queryset = AccountLedger.objects.all()
    permission_classes = (CanAdminister,)

    def get_queryset(self):
        queryset = AccountLedger.objects.all()

        lot_set = self.request.query_params.get('lot', None)
        if lot_set is not None:
            queryset = queryset.filter(lot=lot_set)

        account_from_set = self.request.query_params.get('account_from', None)
        if account_from_set is not None:
            queryset = queryset.filter(account_from=account_from_set)

        agreement_set = self.request.query_params.get('agreement', None)
        if agreement_set is not None:
            queryset = queryset.filter(agreement=agreement_set)

        return queryset.order_by('entry_date')

    def create(self, request):
        data_set = request.data

        data_set['created_by'] = self.request.user.id
        data_set['modified_by'] = self.request.user.id

        if 'plat' in self.request.data:
            chosen_plat = self.request.data['plat']
            plat_set = Plat.objects.filter(id=chosen_plat)
            
            non_sewer_credits_per_lot = 0
            sewer_credits_per_lot = 0

            if plat_set.exists():
                buildable_lots = plat_set[0].buildable_lots

                try:
                    non_sewer_credits_per_lot = round((int(data_set['non_sewer_credits']) / buildable_lots), 2)
                    sewer_credits_per_lot = round((int(data_set['sewer_credits']) / buildable_lots), 2)
                except Exception as exc:
                    return Response('Invalid credit entry', status=status.HTTP_400_BAD_REQUEST)

            chosen_lots = Lot.objects.filter(plat=chosen_plat)
            for lot in chosen_lots:
                data_set['lot'] = lot.id
                data_set['non_sewer_credits'] = non_sewer_credits_per_lot
                data_set['sewer_credits'] = sewer_credits_per_lot

                serializer = AccountLedgerSerializer(data=data_set)
                if serializer.is_valid(raise_exception=True):
                    self.perform_create(serializer)
            return Response('Success')

        elif 'lot' in self.request.data:
            chosen_lot = self.request.data['lot']
            serializer = AccountLedgerSerializer(data=data_set)
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
                
class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()