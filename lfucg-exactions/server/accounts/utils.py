from .models import *

def calculate_account_balance(account_id):
    account_ledgers_from = AccountLedger.objects.filter(account_from=account_id)
    account_ledgers_to = AccountLedger.objects.filter(account_to=account_id)

    payments = Payment.objects.filter(credit_account=account_id)

    from_value = 0
    to_value = 0
    payment_value = 0

    if account_ledgers_from.exists():
        for ledger in account_ledgers_from:
            ledger_credits = ledger.non_sewer_credits + ledger.sewer_credits
            from_value += ledger_credits

    if account_ledgers_to.exists():
        for ledger in account_ledgers_to:
            ledger_credits = ledger.non_sewer_credits + ledger.sewer_credits
            to_value += ledger_credits

    if payments.exists():
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
    
    current_account_balance = to_value - from_value - payment_value

    return current_account_balance

def calculate_agreement_balance(agreement_id):
    agreement = Agreement.objects.filter(id=agreement_id)

    related_account_id = agreement[0].account_id.id
    related_account = Account.objects.filter(id=related_account_id)

    # account_ledgers_from = AccountLedger.objects.filter(account_from=agreement_id__account_from__id)
    # account_ledgers_to = AccountLedger.objects.filter(account_to=agreement_id__account_to__id)
    account_ledger = AccountLedger.objects.filter(agreement=agreement_id)
    # print('ACCOUNT LEDGER FROM', account_ledgers_from)
    # print('ACCOUNT LEDGER TO', account_ledgers_to)
    payments = Payment.objects.filter(credit_source=agreement_id)

    ledger_value = 0
    # from_value = 0
    # to_value = 0
    payment_value = 0

    if account_ledger.exists():
        for ledger in account_ledger:
            ledger_credits = ledger.non_sewer_credits + ledger.sewer_credits
            ledger_value += ledger_credits

    # if account_ledgers_from is not None:
    #     for ledger in account_ledgers_from:
    #         ledger_credits = ledger.non_sewer_credits + ledger.sewer_credits
    #         from_value += ledger_credits

    # if account_ledgers_to is not None:
    #     for ledger in account_ledgers_to:
    #         ledger_credits = ledger.non_sewer_credits + ledger.sewer_credits
    #         to_value += ledger_credits

    if payments.exists():
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

    print('PAYMENT', payment_value)
    
    current_agreement_balance = ledger_value + payment_value

    return current_agreement_balance
        