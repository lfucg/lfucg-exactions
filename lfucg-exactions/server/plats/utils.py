from .models import Lot, Plat
from accounts.models import *
from rest_framework.response import Response
from rest_framework import status
from decimal import Decimal

def calculate_lot_balance(lot):
    # PAYMENTS
    payments = Payment.objects.exclude(is_active=False).filter(lot_id=lot.id)

    sewer_payment = 0
    non_sewer_payment = 0

    sewer_exactions = (
        Decimal(lot.dues_sewer_cap_own) +
        Decimal(lot.dues_sewer_trans_dev) +
        Decimal(lot.dues_sewer_trans_own) +
        Decimal(lot.dues_sewer_cap_dev)
    )

    non_sewer_exactions = (
        Decimal(lot.dues_roads_own) +
        Decimal(lot.dues_roads_dev) +
        Decimal(lot.dues_parks_dev) +
        Decimal(lot.dues_parks_own) +
        Decimal(lot.dues_storm_dev) +
        Decimal(lot.dues_storm_own) +
        Decimal(lot.dues_open_space_dev) +
        Decimal(lot.dues_open_space_own)
    )

    dues_roads_dev = Decimal(lot.dues_roads_dev)
    dues_roads_own = Decimal(lot.dues_roads_own)
    dues_sewer_trans_dev = Decimal(lot.dues_sewer_trans_dev)
    dues_sewer_trans_own = Decimal(lot.dues_sewer_trans_own)
    dues_sewer_cap_dev = Decimal(lot.dues_sewer_cap_dev)
    dues_sewer_cap_own = Decimal(lot.dues_sewer_cap_own)
    dues_parks_dev = Decimal(lot.dues_parks_dev)
    dues_parks_own = Decimal(lot.dues_parks_own)
    dues_storm_dev = Decimal(lot.dues_storm_dev)
    dues_storm_own = Decimal(lot.dues_storm_own)
    dues_open_space_dev = Decimal(lot.dues_open_space_dev)
    dues_open_space_own = Decimal(lot.dues_open_space_own)

    total_exactions = sewer_exactions + non_sewer_exactions

    if payments is not None:
        for payment in payments:
            sewer_payment_paid = Decimal(
                payment.paid_sewer_trans +
                payment.paid_sewer_cap
            )
            non_sewer_payment_paid = Decimal(
                payment.paid_roads +
                payment.paid_parks +
                payment.paid_storm +
                payment.paid_open_space
            )

            dues_roads_dev -= payment.paid_roads
            dues_sewer_trans_dev -= payment.paid_sewer_trans
            dues_sewer_cap_dev -= payment.paid_sewer_cap
            dues_parks_dev -= payment.paid_parks
            dues_storm_dev -= payment.paid_storm
            dues_open_space_dev -= payment.paid_open_space

            sewer_payment += sewer_payment_paid
            non_sewer_payment += non_sewer_payment_paid

    # ACCOUNT LEDGERS
    account_ledgers = AccountLedger.objects.exclude(is_active=False).filter(lot=lot.id, entry_type='USE')
    
    sewer_credits_applied = 0
    non_sewer_credits_applied = 0

    if account_ledgers is not None:
        for ledger in account_ledgers:
            sewer_credits_applied += Decimal(ledger.sewer_credits)
            non_sewer_credits_applied += Decimal(ledger.non_sewer_credits)


    all_exactions = {
        'total_exactions': total_exactions,
        'sewer_exactions': sewer_exactions,
        'non_sewer_exactions': non_sewer_exactions,

        'sewer_payment': sewer_payment,
        'non_sewer_payment': non_sewer_payment,

        'sewer_credits_applied': sewer_credits_applied,
        'non_sewer_credits_applied': non_sewer_credits_applied,

        'current_exactions': round((total_exactions - sewer_payment - non_sewer_payment - sewer_credits_applied - non_sewer_credits_applied), 2),
        'sewer_due': sewer_exactions - sewer_payment - sewer_credits_applied,
        'non_sewer_due': non_sewer_exactions - non_sewer_payment - non_sewer_credits_applied,
        'dues_roads_dev': dues_roads_dev,
        'dues_roads_own': dues_roads_own,
        'dues_sewer_trans_dev': dues_sewer_trans_dev,
        'dues_sewer_trans_own': dues_sewer_trans_own,
        'dues_sewer_cap_dev': dues_sewer_cap_dev,
        'dues_sewer_cap_own': dues_sewer_cap_own,
        'dues_parks_dev': dues_parks_dev,
        'dues_parks_own': dues_parks_own,
        'dues_storm_dev': dues_storm_dev,
        'dues_storm_own': dues_storm_own,
        'dues_open_space_dev': dues_open_space_dev,
        'dues_open_space_own': dues_open_space_own,
    }

    return all_exactions

def calculate_plat_balance(plat):
    lots_on_plat = Lot.objects.filter(plat=plat.id)

    lots_sewer_paid = 0
    lots_non_sewer_paid = 0
    if lots_on_plat.exists():
        for lot in lots_on_plat:
            calculated_lot = calculate_lot_balance(lot)
            lots_non_sewer_paid += calculated_lot['non_sewer_payment'] + calculated_lot['non_sewer_credits_applied']
            lots_sewer_paid += calculated_lot['sewer_payment'] + calculated_lot['sewer_credits_applied']

    plat_exactions = {
        'plat_sewer_due': plat.sewer_due - lots_sewer_paid,
        'plat_non_sewer_due': plat.non_sewer_due - lots_non_sewer_paid,
        'remaining_lots': plat.buildable_lots - len(lots_on_plat),
    }

    return plat_exactions

def update_entry(self, request, pk):
    existing_object = self.get_object()
    setattr(existing_object, 'modified_by', request.user)
    serializer = self.get_serializer(existing_object, data=request.data, partial=True)
    if serializer.is_valid(raise_exception=True):
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

