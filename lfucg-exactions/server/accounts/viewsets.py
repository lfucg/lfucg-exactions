from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q

from django.contrib.auth.models import User
from .models import *
from .serializers import *
from .permissions import CanAdminister

class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    queryset = Account.objects.all()
    permission_classes = (CanAdminister,)
    pagination_class = PageNumberPagination

    def get_queryset(self):
        queryset = Account.objects.all()

        query_text = self.request.query_params.get('query', None)
        if query_text is not None:
            query_text = query_text.lower()

            queryset = queryset.filter(
                Q(account_name__icontains=query_text) |
                Q(contact_full_name__icontains=query_text) |
                Q(address_full=query_text) |
                Q(phone__icontains=query_text) |
                Q(email__icontains=query_text))

        return queryset.order_by('account_name')

    def perform_create(self, serializer):
        instance = serializer.save(modified_by=self.request.user, created_by=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.save(modified_by=self.request.user)

class AgreementViewSet(viewsets.ModelViewSet):
    serializer_class = AgreementSerializer
    queryset = Agreement.objects.all()
    permission_classes = (CanAdminister,)

    def get_queryset(self):
        queryset = Agreement.objects.all()

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

        return queryset.order_by('expansion_area')

    def perform_create(self, serializer):
        instance = serializer.save(modified_by=self.request.user, created_by=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.save(modified_by=self.request.user)

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    queryset = Payment.objects.all()
    permission_classes = (CanAdminister,)

    def get_queryset(self):
        queryset = Payment.objects.all()

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

    def perform_create(self, serializer):
        instance = serializer.save(modified_by=self.request.user, created_by=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.save(modified_by=self.request.user)

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

    def perform_create(self, serializer):
        instance = serializer.save(modified_by=self.request.user, created_by=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.save(modified_by=self.request.user)

class ProjectCostEstimateViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectCostEstimateSerializer
    queryset = ProjectCostEstimate.objects.all()
    permission_classes = (CanAdminister,)

    def perform_create(self, serializer):
        instance = serializer.save(modified_by=self.request.user, created_by=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.save(modified_by=self.request.user)

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

    def perform_create(self, serializer):
        instance = serializer.save(modified_by=self.request.user, created_by=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.save(modified_by=self.request.user)
    
class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()