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
from plats.serializers import LotSerializer

class CurrentUserDetails(RetrieveAPIView):
    model = User
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class TransactionCSVExportView(View):
    def get_serializer_class(self, serializer_class):
        return serializer_class

    def list(self, queryset, serializer_class, many):
        serializer_class = self.get_serializer_class(serializer_class)
        serializer = serializer_class(queryset, many=many)
        return serializer

    def get(self, request, *args, **kwargs):
        headers = [
            'Subdivision',
            'Cabinet',
            'Slide',
            'Unit',
            'Section',
            'Block',
            'Plat Zones',
            'Lot Address',
            'Permit ID',
            'Alt. Address',
            'Transaction Type',
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

        starting_date = request.GET.get('starting_date', None)
        ending_date = request.GET.get('ending_date', datetime.date.today())

        if starting_date is not None:
            transaction_filename = 'transactions_starting_date_' + starting_date + 'ending_date_' + ending_date

            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename=' + transaction_filename + '.csv'

            payment_queryset = Payment.objects.filter(date_created__lte=ending_date, date_created__gte=starting_date)
            ledger_queryset = AccountLedger.objects.filter(date_created__lte=ending_date, date_created__gte=starting_date)

            lot_queryset = Lot.objects.filter(
                Q(payment__in=payment_queryset) |
                Q(ledger_lot__in=ledger_queryset)
            ).distinct()

            lot_serializer = self.list(
                lot_queryset,
                LotSerializer,
                many=True
            )

            writer = csv.DictWriter(response, fieldnames=headers, extrasaction='ignore')
            writer.writeheader()

            for lot in lot_serializer.data:
                subdivision = ''
                all_plat_zones = ''
                alt_address = ''

                if lot['plat']['subdivision']:
                    subdivision = lot['plat']['subdivision']['name']

                plat_zones = PlatZone.objects.filter(plat=lot['plat']['id'])
                if plat_zones.count() > 0: 
                    all_plat_zones = ''
                    for zone in plat_zones:
                        all_plat_zones += (zone.zone + ', ')

                if lot['alternative_address_number'] or lot['alternative_address_street']:
                    alt_address = lot['alternative_address_number'] + lot['alternative_address_street']

                lot_payments = Payment.objects.filter(lot_id=lot['id'])
                lot_ledgers = AccountLedger.objects.filter(lot=lot['id'])

                if lot_payments is not None:
                    payment_serializer = self.list(
                        lot_payments,
                        PaymentSerializer,
                        many=True
                    )
                    
                    for payment in payment_serializer.data:
                        sewer_sub = round(float(payment['paid_sewer_trans']) + float(payment['paid_sewer_cap']), 2)
                        non_sewer_sub = round(float(payment['paid_roads']) + float(payment['paid_parks']) + float(payment['paid_storm']) + float(payment['paid_open_space']), 2)
                        total = sewer_sub + non_sewer_sub
                        row = {
                            'Subdivision': subdivision,
                            'Cabinet': lot['plat']['cabinet'],
                            'Slide': lot['plat']['slide'],
                            'Unit': lot['plat']['unit'],
                            'Section': lot['plat']['section'],
                            'Block': lot['plat']['block'],
                            'Plat Zones': all_plat_zones,
                            'Lot Address': lot['address_full'],
                            'Permit ID': lot['permit_id'],
                            'Alt. Address': alt_address,
                            'Transaction Type': payment['payment_type_display'],
                            'Paid By': payment['paid_by'],
                            'Sewer Trans.': payment['paid_sewer_trans'],
                            'Sewer Cap.': payment['paid_sewer_cap'],
                            'SEWER SUBTL': sewer_sub,
                            'Roads': payment['paid_roads'],
                            'Parks': payment['paid_parks'],
                            'Stormwater': payment['paid_storm'],
                            'Open Space': payment['paid_open_space'],
                            'NONSWR SUBTL': non_sewer_sub,
                            'Total': total,
                        }

                        writer.writerow(row)

                if lot_ledgers is not None:
                    ledger_serializer = self.list(
                        lot_ledgers,
                        AccountLedgerSerializer,
                        many=True
                    )
                    
                    for ledger in ledger_serializer.data:
                        total = round(float(ledger['sewer_credits']) + float(ledger['non_sewer_credits']), 2)
                        row = {
                            'Subdivision': subdivision,
                            'Cabinet': lot['plat']['cabinet'],
                            'Slide': lot['plat']['slide'],
                            'Unit': lot['plat']['unit'],
                            'Section': lot['plat']['section'],
                            'Block': lot['plat']['block'],
                            'Plat Zones': all_plat_zones,
                            'Lot Address': lot['address_full'],
                            'Permit ID': lot['permit_id'],
                            'Alt. Address': alt_address,
                            'Transaction Type': 'credits',
                            'Paid By': ledger['account_from']['account_name'],
                            'Sewer Trans.': ledger['sewer_trans'],
                            'Sewer Cap.': ledger['sewer_cap'],
                            'SEWER SUBTL': ledger['sewer_credits'],
                            'Roads': ledger['roads'],
                            'Parks': ledger['parks'],
                            'Stormwater': ledger['storm'],
                            'Open Space': ledger['open_space'],
                            'NONSWR SUBTL': ledger['non_sewer_credits'],
                            'Total': total,
                        }

                        writer.writerow(row)
            return response

