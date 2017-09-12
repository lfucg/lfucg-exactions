from .models import Lot, Plat
from accounts.models import *

def calculate_lot_balance(lot_id):
    lot = Lot.objects.filter(id=lot_id)[0]
    lot_account = lot.account.id

    account_ledgers_from = AccountLedger.objects.filter(account_from=lot_account)
    account_ledgers_to = AccountLedger.objects.filter(account_to=lot_account)
    
    payments = Payment.objects.filter(lot_id=lot_id)

    from_value = 0
    to_value = 0
    payment_value = 0

    total_exactions = (lot.dues_roads_own +
        lot.dues_roads_dev +
        lot.dues_sewer_cap_own +
        lot.dues_sewer_trans_dev +
        lot.dues_sewer_trans_own +
        lot.dues_sewer_cap_dev +
        lot.dues_sewer_cap_own +
        lot.dues_parks_dev +
        lot.dues_parks_own +
        lot.dues_storm_dev +
        lot.dues_storm_own +
        lot.dues_open_space_dev +
        lot.dues_open_space_own)

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

    print('TOTAL EXACTIONS', total_exactions)

    if account_ledgers_from is not None:
        for ledger in account_ledgers_from:
            ledger_credits = ledger.non_sewer_credits + ledger.sewer_credits
            from_value += ledger_credits

    if account_ledgers_to is not None:
        for ledger in account_ledgers_to:
            ledger_credits = ledger.non_sewer_credits + ledger.sewer_credits
            to_value += ledger_credits

    if payments is not None:
        for payment in payments:
            payment_paid = (
                payment.paid_roads +
                payment.paid_sewer_trans +
                payment.paid_sewer_cap +
                payment.paid_parks +
                payment.paid_storm +
                payment.paid_open_space
            )
            payment_value += payment_paid

    print('FROM VALUE', from_value)
    print('TO VALUE', to_value)
    print('PAYMENT', payment_value)
    print('SEWER EXACTIONS', sewer_exactions)
    print('NON SEWER EXACTIONS', non_sewer_exactions)

    all_exactions = {
        total_exactions,
        sewer_exactions,
        non_sewer_exactions,
        from_value,
        to_value,
        payment_value,
    }

    return all_exactions

