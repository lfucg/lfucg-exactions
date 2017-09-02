from .models import AccountLedger, Payment

def calculate_account_balance(account_id):
    account_ledgers_from = AccountLedger.objects.filter(account_from=account_id)
    account_ledgers_to = AccountLedger.objects.filter(account_to=account_id)

    payments = Payment.objects.filter(credit_account=account_id)

    from_value = 0
    to_value = 0
    payment_value = 0

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
    
    current_account_balance = to_value - from_value - payment_value

    return '${:,.2f}'.format(current_account_balance)
