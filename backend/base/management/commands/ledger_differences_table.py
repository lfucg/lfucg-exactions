from django.db.models import Sum, F
import pandas as pd

from accounts.models import AccountLedger


def ledger_list():
    mismatch_non_sewer_ledgers = AccountLedger.objects.annotate(
        non_sewer_sum=Sum(F("roads") + F('parks') + F('storm') + F('open_space'))
    ).exclude(
        non_sewer_sum=F('non_sewer_credits')
    )

    mismatch_sewer_ledgers = AccountLedger.objects.annotate(
        sewer_sum=Sum(F("sewer_trans") + F('sewer_cap'))
    ).exclude(
        sewer_sum=F('sewer_credits')
    )

    mismatched_ledgers = mismatch_non_sewer_ledgers | mismatch_sewer_ledgers

    ledger_pandas = pd.DataFrame.from_records(
        mismatched_ledgers.values(
            'entry_date',
            'date_created',
            'date_modified',

            # 'created_by',
            # 'modified_by',

            'account_from__account_name',
            'account_to__account_name',
            'lot__address_full',
            'agreement__resolution_number',

            'entry_type',

            'non_sewer_credits',
            'sewer_credits',

            'roads',
            'sewer_trans',
            'sewer_cap',
            'parks',
            'storm',
            'open_space',

        )
    )

    ledger_pandas.to_csv(
        "./ledger_differences.csv",
        sep=",",
        index=False,
    )
    # ledger_pandas.to_clipboard(sep=",")


# For use in shell_plus
# from base.management.commands.ledger_differences_table import ledger_list
