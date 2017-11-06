from rest_framework.generics import RetrieveAPIView

import csv
from django.views.generic import View
from django.http import HttpResponse
from django.db.models import Count, Max, Q
import datetime

from django.contrib.auth.models import User
from .models import Account, AccountLedger, Agreement, Payment
from .serializers import UserSerializer, AccountSerializer, AccountLedgerSerializer, AgreementSerializer, PaymentSerializer
from plats.models import Lot, Plat, PlatZone, Subdivision

class CurrentUserDetails(RetrieveAPIView):
    model = User
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class TransactionCSVExportView(View):
    def get(self, request, *args, **kwargs):
        headers = [
            'Subdivision',
            'Plat Cabinet',
            'Plat Slide',
            'Plat Unit',
            'Plat Section',
            'Plat Block',
            'Plat Zones',
            'Lot Address',
            'Alt. Address',
            'Trans. Type',
            'Paid By',
            'Sewer Trans.',
            'Sewer Cap.',
            'SEWER SUBTL',
            'Roads',
            'Parks',
            'Stormwater',
            'Open Space',
            'NONSWR SUBTL',
            'Total',
        ]

        starting_date = request.GET.get('starting_date')
        ending_date = request.GET.get('ending_date', datetime.date.today())

        transaction_filename = 'transactions_starting_date_' + starting_date + 'ending_date_' + ending_date

        response = HttpResponse(content_type='text')
        response['Content-Disposition'] = 'attachment; filename=%s'%transaction_filename

        writer = csv.writer(response)

        payment_queryset = Payment.objects.filter(date_created__lte=ending_date, date_created__gte=starting_date)
        ledger_queryset = AccountLedger.objects.filter(date_created__lte=ending_date, date_created__gte=starting_date)

        lot_queryset = Lot.objects.filter(
            Q(payment__in=payment_queryset) |
            Q(ledger_lot__in=ledger_queryset)
        )

        # if payment_queryset is not None:
        #     for payment in payment_queryset:
        #         lot = Lot.objects.filter(id=payment.lot.id).first()
        #         if lot is not None and lot.plat:
        #             plat = Plat.objects.filter(id=lot.plat.id).first()
        #             if plat is not None:
        #                 all_plat_zones = ''
        #                 plat_zone = PlatZone.objects.filter(plat=plat)
        #                 if plat_zone.count() > 0:
        #                     for zone in plat_zone:
        #                         all_plat_zones += (zone.zone + ', ')
        #                 if plat.subdivision:
        #                     subdivision = Subdivision.objects.filter(id=plat.subdivision.id)

        # if payment_queryset is not None:
        #     for payment in payment_queryset:
        #         lot = Lot.objects.filter(id=payment.lot.id).first()
        #         if lot is not None and lot.plat:
        #             plat = Plat.objects.filter(id=lot.plat.id).first()
        #             if plat is not None:
        #                 all_plat_zones = ''
        #                 plat_zone = PlatZone.objects.filter(plat=plat)
        #                 if plat_zone.count() > 0:
        #                     for zone in plat_zone:
        #                         all_plat_zones += (zone.zone + ', ')
        #                 if plat.subdivision:
        #                     subdivision = Subdivision.objects.filter(id=plat.subdivision.id)


        #         lot_queryset = Lot.objects.filter(date_created__lte=ending_date, date_created__gte=starting_date)


        print('LOT QUERYSET', lot_queryset)
        print('LOT QUERYSET DIR', dir(lot_queryset))
        # print('LOT QUERYSET', lot_queryset)
        return HttpResponse('Hello')

