from rest_framework import viewsets
from django.db.models import Q

from django.contrib.auth.models import User
from .models import *
from .serializers import *

class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    queryset = Account.objects.all()

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

class AgreementViewSet(viewsets.ModelViewSet):
    serializer_class = AgreementSerializer
    queryset = Agreement.objects.all()

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    queryset = Payment.objects.all()

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()

class ProjectCostEstimateViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectCostEstimateSerializer
    queryset = ProjectCostEstimate.objects.all()

class AccountLedgerViewSet(viewsets.ModelViewSet):
    serializer_class = AccountLedgerSerializer
    queryset = AccountLedger.objects.all()
    
class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()