
from rest_framework.pagination import PageNumberPagination
from rest_framework import viewsets, status, filters
from django.db.models import Q
from rest_framework.response import Response

from django.contrib.auth.models import User
from .models import *
from .serializers import *
from .permissions import CanAdminister
from django.conf import settings
from builtins import hasattr

# from django_filters.rest_framework import DjangoFilterBackend

from plats.models import Plat, Lot

from .utils import update_entry

class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    queryset = Account.objects.all()
    permission_classes = (CanAdminister,)
    filter_backends = (filters.DjangoFilterBackend, filters.SearchFilter,)
    search_fields = ('account_name', 'contact_full_name', 'address_full', 'phone', 'email',)
    filter_fields = ('plat_account__id', 'lot_account__id', 'ledger_account_to', 'ledger_account_from', )

    def get_queryset(self):
        queryset = Account.objects.all()
        PageNumberPagination.page_size = 0

        show_inactive = self.request.query_params.get('showDeleted', False)
        if show_inactive:
            print('Show deleted entries')
        else:
            queryset = queryset.exclude(is_active=False)
        
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

class AccountQuickViewSet(viewsets.ModelViewSet):
    serializer_class = AccountQuickSerializer
    queryset = Account.objects.filter(is_active=True).order_by('account_name')
    pagination_class = None

class AgreementViewSet(viewsets.ModelViewSet):
    serializer_class = AgreementSerializer
    queryset = Agreement.objects.all()
    permission_classes = (CanAdminister,)
    filter_backends = (filters.DjangoFilterBackend, filters.SearchFilter,)
    search_fields = ('resolution_number', 'account_id__account_name', 'agreement_type', 'expansion_area',)
    filter_fields = ('agreement_type', 'account_id', 'expansion_area', 'is_approved', 'ledger',)

    def get_queryset(self):
        queryset = Agreement.objects.all()
        paginatePage = self.request.query_params.get('paginatePage', None)
        pageSize = self.request.query_params.get('pageSize', settings.PAGINATION_SIZE)

        show_inactive = self.request.query_params.get('showDeleted', False)
        if show_inactive:
            print('Show deleted entries')
        else:
            queryset = queryset.exclude(is_active=False)
        if self.request.user.is_anonymous(): 
            queryset = queryset.exclude(is_approved=False)

        account_id_set = self.request.query_params.get('account_id', None)
        if account_id_set is not None:
            queryset = queryset.filter(account_id=account_id_set)

        if paginatePage is not None:
            pagination_class = PageNumberPagination
            PageNumberPagination.page_size = pageSize

        return queryset.order_by('resolution_number', 'expansion_area')

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

class AgreementQuickViewSet(viewsets.ModelViewSet):
    serializer_class = AgreementQuickSerializer
    queryset = Agreement.objects.filter(is_active=True).order_by('resolution_number')
    pagination_class = None
            
class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    queryset = Payment.objects.all()
    permission_classes = (CanAdminister,)
    filter_backends = (filters.DjangoFilterBackend, filters.SearchFilter,)
    search_fields = ('lot_id__address_full', 'payment_type', 'check_number', 'credit_account__account_name', 'paid_by', 'credit_source__resolution_number')
    filter_fields = ('payment_type', 'paid_by_type', 'credit_account', 'lot_id', 'credit_source', 'is_approved',)

    def get_queryset(self):
        queryset = Payment.objects.all()
        PageNumberPagination.page_size = 0

        show_inactive = self.request.query_params.get('showDeleted', False)
        if show_inactive:
            print('Show deleted entries')
        else:
            queryset = queryset.exclude(is_active=False)

        paginatePage = self.request.query_params.get('paginatePage', None)
        pageSize = self.request.query_params.get('pageSize', settings.PAGINATION_SIZE)

        if self.request.user.is_anonymous(): 
            queryset = queryset.exclude(is_approved=False)

        if paginatePage is not None:
            pagination_class = PageNumberPagination
            PageNumberPagination.page_size = pageSize

        lot_id_set = self.request.query_params.get('lot_id', None)
        if lot_id_set is not None:
            queryset = queryset.filter(Q(lot_id=lot_id_set))

        credit_account_set = self.request.query_params.get('credit_account', None)
        if credit_account_set is not None:
            queryset = queryset.filter(Q(credit_account=credit_account_set))

        credit_source_set = self.request.query_params.get('credit_source', None)
        if credit_source_set is not None:
            queryset = queryset.filter(Q(credit_source=credit_source_set))

        ending_date = self.request.query_params.get('ending_date', None)
        if ending_date is not None:
            queryset = queryset.filter(Q(entry_date__lte=ending_date))
        
        starting_date = self.request.query_params.get('starting_date', None)
        if starting_date is not None:
            queryset = queryset.filter(Q(entry_date__gte=starting_date))

        return queryset.order_by('-entry_date', 'id')

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
    filter_backends = (filters.DjangoFilterBackend, filters.SearchFilter,)
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

        return queryset.order_by('-date_modified', 'id')

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
    
class ProjectQuickViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectQuickSerializer
    queryset = Project.objects.filter(is_active=True).order_by('-date_modified')
    pagination_class = None
            
class ProjectCostEstimateViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectCostEstimateSerializer
    queryset = ProjectCostEstimate.objects.all()
    permission_classes = (CanAdminister,)
    filter_backends = (filters.DjangoFilterBackend, filters.SearchFilter,)
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

        return queryset.order_by('-date_modified', 'id')

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
    filter_backends = (filters.DjangoFilterBackend, filters.SearchFilter,)
    search_fields = ('entry_type', 'agreement__resolution_number', 'lot__address_full', 'account_to__account_name', 'account_from__account_name',)
    filter_fields = ('entry_type', 'agreement', 'lot', 'account_to', 'account_from', 'is_approved',)

    def get_queryset(self):
        queryset = AccountLedger.objects.all()
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

        starting_date = self.request.query_params.get('starting_date', None)
        if starting_date is not None:
            queryset = queryset.filter(entry_date__gte=starting_date)

        ending_date = self.request.query_params.get('ending_date', None)
        if ending_date is not None:
            queryset = queryset.filter(entry_date__lte=ending_date)

        return queryset.order_by('entry_date', 'id')

    def create(self, request):
        data_set = request.data

        data_set['created_by'] = self.request.user.id
        data_set['modified_by'] = self.request.user.id

        if 'lot' in self.request.data:
            serializer = AccountLedgerSerializer(data=data_set)
            if serializer.is_valid(raise_exception=True):
                self.perform_create(serializer)
                return Response(serializer.data)

        elif 'plat' in self.request.data:
            chosen_plat = self.request.data['plat']
            plat_set = Plat.objects.filter(id=chosen_plat)
            non_sewer_credits_per_lot = 0
            sewer_credits_per_lot = 0
            roads_per_lot = 0
            parks_per_lot = 0
            storm_per_lot = 0
            open_space_per_lot = 0
            sewer_trans_per_lot = 0
            sewer_cap_per_lot = 0

            if plat_set.exists():
                buildable_lots = plat_set[0].buildable_lots

                if buildable_lots == 0:
                    return Response('There are no buildable lots for assignment.', status=status.HTTP_400_BAD_REQUEST)

                try:
                    non_sewer_credits_per_lot = round((float(data_set['non_sewer_credits']) / buildable_lots), 2) if hasattr(data_set, 'non_sewer_credits') else 0
                    sewer_credits_per_lot = round((float(data_set['sewer_credits']) / buildable_lots), 2) if hasattr(data_set, 'sewer_credits') else 0
                    roads_per_lot = round((float(data_set['roads']) / buildable_lots), 2) if hasattr(data_set, 'roads') else 0
                    parks_per_lot = round((float(data_set['parks']) / buildable_lots), 2) if hasattr(data_set, 'parks') else 0
                    storm_per_lot = round((float(data_set['storm']) / buildable_lots), 2) if hasattr(data_set, 'storm') else 0
                    open_space_per_lot = round((float(data_set['open_space']) / buildable_lots), 2) if hasattr(data_set, 'open_space') else 0
                    sewer_trans_per_lot = round((float(data_set['sewer_trans']) / buildable_lots), 2) if hasattr(data_set, 'sewer_trans') else 0
                    sewer_cap_per_lot = round((float(data_set['sewer_cap']) / buildable_lots), 2) if hasattr(data_set, 'sewer_cap') else 0
                except Exception as exc:
                    return Response('Invalid credit entry', status=status.HTTP_400_BAD_REQUEST)

            chosen_lots = Lot.objects.filter(plat=chosen_plat)
            if chosen_lots.exists():
                for lot in chosen_lots:
                    data_set['lot'] = lot.id
                    data_set['non_sewer_credits'] = non_sewer_credits_per_lot
                    data_set['sewer_credits'] = sewer_credits_per_lot
                    data_set['roads'] = roads_per_lot
                    data_set['parks'] = parks_per_lot
                    data_set['storm'] = storm_per_lot
                    data_set['open_space'] = open_space_per_lot
                    data_set['sewer_trans'] = sewer_trans_per_lot
                    data_set['sewer_cap'] = sewer_cap_per_lot

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