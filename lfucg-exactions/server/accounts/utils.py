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

    ledger_from_value = 0
    ledger_to_value = 0
    
    if agreement.exists():
        related_account_id = agreement[0].account_id.id

        account_ledger_agreements_from = AccountLedger.objects.filter(agreement=agreement_id, account_from=related_account_id)
        account_ledger_agreements_to = AccountLedger.objects.filter(agreement=agreement_id, account_to=related_account_id)

        if account_ledger_agreements_from.exists():
            for ledger_from in account_ledger_agreements_from:
                ledger_from_value += ledger_from.non_sewer_credits + ledger_from.sewer_credits

        if account_ledger_agreements_to.exists():
            for ledger_to in account_ledger_agreements_to:
                ledger_to_value += ledger_to.non_sewer_credits + ledger_to.sewer_credits

    payment_value = 0
    payments = Payment.objects.filter(credit_source=agreement_id)

    if payments.exists():
        for payment in payments:
            payment_value += (
                payment.paid_roads +
                payment.paid_sewer_trans +
                payment.paid_sewer_cap +
                payment.paid_parks +
                payment.paid_storm +
                payment.paid_open_space
            )
    
    current_agreement_total = ledger_to_value - ledger_from_value - payment_value

    return current_agreement_total
        