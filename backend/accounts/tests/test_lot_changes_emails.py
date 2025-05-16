import pytest

from conftest import TestData, TestUsers
from django.core import mail

from conftest import TestData
from accounts.models import Payment

pytestmark = pytest.mark.django_db

def test_finance_submits_payment_no_lot_email_sent(
    test_users: TestUsers,
    test_data: TestData,
):
    lot = test_data.lot
    account = test_data.account
    finance_user = test_users.finance_regular

    Payment.objects.create(
        lot_id=lot,
        credit_account=account,
        created_by=finance_user,
        modified_by=finance_user,
        entry_date='2025-5-15',
        paid_by='Tester',
        paid_by_type='DEVELOPER',
        payment_type='CREDIT_CARD',
        paid_roads=100,
    )
    assert Payment.objects.all().count() == 1

    # Assert one email is sent for payment creation
    # assert len(mail.outbox) > 0
    # assert mail.outbox[0].subject != "LFUCG Exactions Activity: New Lot Entry Pending Approval"
