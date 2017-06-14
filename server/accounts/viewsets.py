from rest_framework import viewsets

from .models import *
from .serializers import *

class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    queryset = Account.objects.all()

class AgreementViewSet(viewsets.ModelViewSet):
    serializer_class = AgreementSerializer
    queryset = Agreement.objects.all()

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerilizer
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
    