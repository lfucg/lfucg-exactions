import pytest
from rest_framework import status

from plats.utils import subtract_ledger_values

pytestmark = pytest.mark.django_db

def test_get_lots(
    client,
):
    response = client.get('/api/lot/')
    assert response.status_code == status.HTTP_200_OK

# TEST THE SUBTRACT LEDGER VALUES FUNCTION
def test_subtract_ledger_values_zero_ledger():
    new_ledger_value, new_dev_value, new_owner_value = subtract_ledger_values(0, 10, 10)
    assert new_ledger_value == 0
    assert new_dev_value == 10
    assert new_owner_value == 10

def test_subtract_ledger_values_clear_owner_only():
    new_ledger_value, new_dev_value, new_owner_value = subtract_ledger_values(10, 10, 10)
    assert new_ledger_value == 0
    assert new_dev_value == 10
    assert new_owner_value == 0

def test_subtract_ledger_values_partial_owner():
    new_ledger_value, new_dev_value, new_owner_value = subtract_ledger_values(5, 10, 10)
    assert new_ledger_value == 0
    assert new_dev_value == 10
    assert new_owner_value == 5

def test_subtract_ledger_values_clear_owner_and_developer():
    new_ledger_value, new_dev_value, new_owner_value = subtract_ledger_values(20, 10, 10)
    assert new_ledger_value == 0
    assert new_dev_value == 0
    assert new_owner_value == 0

def test_subtract_ledger_values_clear_owner_and_partial_developer():
    new_ledger_value, new_dev_value, new_owner_value = subtract_ledger_values(15, 10, 10)
    assert new_ledger_value == 0
    assert new_dev_value == 5
    assert new_owner_value == 0

def test_subtract_ledger_values_developer_goes_negative():
    new_ledger_value, new_dev_value, new_owner_value = subtract_ledger_values(30, 10, 10)
    assert new_ledger_value == 0
    assert new_dev_value == -10
    assert new_owner_value == 0
