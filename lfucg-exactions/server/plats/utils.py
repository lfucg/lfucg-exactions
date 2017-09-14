from .models import Lot, Plat
from accounts.models import *

def calculate_lot_balance(lot_id):
    lot = Lot.objects.filter(id=lot_id)[0]

    # PAYMENTS
    payments = Payment.objects.filter(lot_id=lot_id)

    sewer_payment = 0
    non_sewer_payment = 0

    sewer_exactions = (lot.dues_sewer_cap_own +
        lot.dues_sewer_trans_dev +
        lot.dues_sewer_trans_own +
        lot.dues_sewer_cap_dev +
        lot.dues_sewer_cap_own)

    non_sewer_exactions = (lot.dues_roads_own +
        lot.dues_roads_dev +
        lot.dues_parks_dev +
        lot.dues_parks_own +
        lot.dues_storm_dev +
        lot.dues_storm_own +
        lot.dues_open_space_dev +
        lot.dues_open_space_own)

    total_exactions = sewer_exactions + non_sewer_exactions

    if payments is not None:
        for payment in payments:
            sewer_payment_paid = (
                payment.paid_sewer_trans +
                payment.paid_sewer_cap
            )
            non_sewer_payment_paid = (
                payment.paid_roads +
                payment.paid_parks +
                payment.paid_storm +
                payment.paid_open_space
            )

            sewer_payment += sewer_payment_paid
            non_sewer_payment += non_sewer_payment_paid

    # ACCOUNT LEDGERS
    account_ledgers = AccountLedger.objects.filter(lot=lot_id)

    sewer_credits_applied = 0
    non_sewer_credits_applied = 0

    if account_ledgers is not None:
        for ledger in account_ledgers:
            sewer_credits_applied += ledger.sewer_credits
            non_sewer_credits_applied += ledger.non_sewer_credits


    all_exactions = {
        'total_exactions': total_exactions,
        'sewer_exactions': sewer_exactions,
        'non_sewer_exactions': non_sewer_exactions,

        'sewer_payment': sewer_payment,
        'non_sewer_payment': non_sewer_payment,

        'sewer_credits_applied': sewer_credits_applied,
        'non_sewer_credits_applied': non_sewer_credits_applied,

        'current_exactions': total_exactions - sewer_payment - non_sewer_payment - sewer_credits_applied - non_sewer_credits_applied,
        'sewer_due': sewer_exactions - sewer_payment - sewer_credits_applied,
        'non_sewer_due': non_sewer_exactions - non_sewer_payment - non_sewer_credits_applied,
    }

    return all_exactions

