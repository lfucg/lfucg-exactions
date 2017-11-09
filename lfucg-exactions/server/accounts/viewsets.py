
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

from .utils import update_entry

class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    queryset = Account.objects.all()
    permission_classes = (CanAdminister,)
    filter_backends = (DjangoFilterBackend, filters.SearchFilter,)
    search_fields = ('account_name', 'contact_full_name', 'address_full', 'phone', 'email',)
    filter_fields = ('plat_account__id', 'lot_account__id')

    def get_queryset(self):
        queryset = Account.objects.exclude(is_active=False)
        PageNumberPagination.page_size = 0
        
        paginatePage = self.request.query_params.get('paginatePage', None)
        pageSize = self.request.query_params.get('pageSize', settings.PAGINATION_SIZE)

        if paginatePage is not None:
            pagination_class = PageNumberPagination
            PageNumberPagination.page_size = pageSize

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
        return update_entry(self, request, pk)

class AgreementViewSet(viewsets.ModelViewSet):
    serializer_class = AgreementSerializer
    queryset = Agreement.objects.all()
    permission_classes = (CanAdminister,)
    filter_backends = (DjangoFilterBackend, filters.SearchFilter,)
    search_fields = ('resolution_number', 'account_id__account_name', 'agreement_type', 'expansion_area',)
    filter_fields = ('agreement_type', 'account_id', 'expansion_area', 'is_approved',)

    def get_queryset(self):
        queryset = Agreement.objects.exclude(is_active=False)
        paginatePage = self.request.query_params.get('paginatePage', None)
        pageSize = self.request.query_params.get('pageSize', settings.PAGINATION_SIZE)

        if self.request.user.is_anonymous(): 
            queryset = queryset.exclude(is_approved=False)

        account_id_set = self.request.query_params.get('account_id', None)
        if account_id_set is not None:
            queryset = queryset.filter(account_id=account_id_set)

        if paginatePage is not None:
            pagination_class = PageNumberPagination
            PageNumberPagination.page_size = pageSize

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
        return update_entry(self, request, pk)
            
class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    queryset = Payment.objects.all()
    permission_classes = (CanAdminister,)
    filter_backends = (DjangoFilterBackend, filters.SearchFilter,)
    search_fields = ('lot_id__address_full', 'payment_type', 'check_number', 'credit_account__account_name', 'paid_by', 'credit_source__resolution_number')
    filter_fields = ('payment_type', 'paid_by_type', 'credit_account', 'lot_id', 'credit_source', 'is_approved',)

    def get_queryset(self):
        queryset = Payment.objects.exclude(is_active=False)
        PageNumberPagination.page_size = 0

        paginatePage = self.request.query_params.get('paginatePage', None)
        pageSize = self.request.query_params.get('pageSize', settings.PAGINATION_SIZE)

        if self.request.user.is_anonymous(): 
            queryset = queryset.exclude(is_approved=False)

        if paginatePage is not None:
            pagination_class = PageNumberPagination
            PageNumberPagination.page_size = pageSize

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
        return update_entry(self, request, pk)
            
class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()
    permission_classes = (CanAdminister,)
    filter_backends = (DjangoFilterBackend, filters.SearchFilter,)
    search_fields = ('agreement_id__resolution_number', 'name', 'project_category', 'project_description',)
    filter_fields = ('project_category', 'project_status', 'agreement_id', 'project_type', 'expansion_area', 'is_approved',)

    def get_queryset(self):
        queryset = Project.objects.exclude(is_active=False)
        PageNumberPagination.page_size = 0

        paginatePage = self.request.query_params.get('paginatePage', None)
        pageSize = self.request.query_params.get('pageSize', settings.PAGINATION_SIZE)

        if self.request.user.is_anonymous(): 
            queryset = queryset.exclude(is_approved=False)

        if paginatePage is not None:
            pagination_class = PageNumberPagination
            PageNumberPagination.page_size = pageSize

        agreement_id_set = self.request.query_params.get('agreement_id', None)
        if agreement_id_set is not None:
            queryset = queryset.filter(agreement_id=agreement_id_set)

        return queryset.order_by('-date_modified')

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
        return update_entry(self, request, pk)
            
class ProjectCostEstimateViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectCostEstimateSerializer
    queryset = ProjectCostEstimate.objects.all()
    permission_classes = (CanAdminister,)
    filter_backends = (DjangoFilterBackend, filters.SearchFilter,)
    search_fields = ('project_id__name', 'estimate_type',)
    filter_fields = ('project_id', 'is_approved',)


    def get_queryset(self):
        queryset = ProjectCostEstimate.objects.exclude(is_active=False)
        PageNumberPagination.page_size = 0

        paginatePage = self.request.query_params.get('paginatePage', None)
        pageSize = self.request.query_params.get('pageSize', settings.PAGINATION_SIZE)
        
        if self.request.user.is_anonymous(): 
            queryset = queryset.exclude(is_approved=False)

        if paginatePage is not None:
            pagination_class = PageNumberPagination
            PageNumberPagination.page_size = pageSize

        return queryset.order_by('-date_modified')

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
        return update_entry(self, request, pk)
            
class AccountLedgerViewSet(viewsets.ModelViewSet):
    serializer_class = AccountLedgerSerializer
    queryset = AccountLedger.objects.all()
    permission_classes = (CanAdminister,)
    filter_backends = (DjangoFilterBackend, filters.SearchFilter,)
    search_fields = ('entry_type', 'agreement__resolution_number', 'lot__address_full', 'account_to__account_name', 'account_from__account_name',)
    filter_fields = ('entry_type', 'agreement', 'lot', 'account_to', 'account_from', 'is_approved',)

    def get_queryset(self):
        queryset = AccountLedger.objects.exclude(is_active=False)
        PageNumberPagination.page_size = 0
        paginatePage = self.request.query_params.get('paginatePage', None)
        pageSize = self.request.query_params.get('pageSize', settings.PAGINATION_SIZE)

        if self.request.user.is_anonymous(): 
            queryset = queryset.exclude(is_approved=False)
        
        if paginatePage is not None:
            pagination_class = PageNumberPagination
            PageNumberPagination.page_size = pageSize

        lot_set = self.request.query_params.get('lot', None)
        if lot_set is not None:
            queryset = queryset.filter(lot=lot_set)

        account_set = self.request.query_params.get('acct', None)
        if account_set is not None:
            queryset = queryset.filter(Q(account_from=account_set) | Q(account_to=account_set))

        agreement_set = self.request.query_params.get('agreement', None)
        if agreement_set is not None:
            queryset = queryset.filter(agreement=agreement_set)

        return queryset.order_by('entry_date')

    def create(self, request):
        data_set = request.data

        data_set['created_by'] = self.request.user.id
        data_set['modified_by'] = self.request.user.id

        if data_set['lot']:
            serializer = AccountLedgerSerializer(data=data_set)
            if serializer.is_valid(raise_exception=True):
                self.perform_create(serializer)
                return Response(serializer.data)

        elif data_set['plat']:
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
            sewer_cap_credits_per_lot = 0
            sewer_trans_credits_per_lot = 0
            roads_credits_per_lot = 0
            storm_credits_per_lot = 0
            parks_credits_per_lot = 0
            open_space_credits_per_lot = 0
            for lot in chosen_lots:
                data_set['lot'] = lot.id
                data_set['non_sewer_credits'] = non_sewer_credits_per_lot
                data_set['sewer_credits'] = sewer_credits_per_lot
                data_set['sewer_cap'] = sewer_credits_per_lot / 2
                data_set['sewer_trans'] = sewer_credits_per_lot / 2
                data_set['roads'] = non_sewer_credits_per_lot * .75
                data_set['storm'] = non_sewer_credits_per_lot * .025
                data_set['parks'] = non_sewer_credits_per_lot * .2
                data_set['open_space'] = non_sewer_credits_per_lot * .025

                serializer = AccountLedgerSerializer(data=data_set)
                if serializer.is_valid(raise_exception=True):
                    self.perform_create(serializer)
            return Response('Success')

        else:
            serializer = AccountLedgerSerializer(data=data_set)
            if serializer.is_valid(raise_exception=True):
                self.perform_create(serializer)
                return Response(serializer.data)

    def update(self, request, pk):
        return update_entry(self, request, pk)
                
class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()