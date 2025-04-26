import pytest

from conftest import TestData
from plats.utils import calculate_lot_balance

pytestmark = pytest.mark.django_db

def test_calculate_lot_balance_ledger(test_data: TestData):
    lot = test_data.lot

    all_exactions = calculate_lot_balance(lot)

    assert all_exactions["dues_roads_dev"] == 0
    assert all_exactions["dues_roads_own"] == 0
    assert all_exactions["dues_parks_dev"] == 0
    assert all_exactions["dues_parks_own"] == 0
    assert all_exactions["dues_open_space_dev"] == 370.37 - 70.37
    assert all_exactions["dues_open_space_own"] == 0
    assert all_exactions["dues_storm_dev"] == 0
    assert all_exactions["dues_storm_own"] == 0
    assert all_exactions["dues_sewer_cap_dev"] == 770.96
    assert all_exactions["dues_sewer_cap_own"] == 0
    assert all_exactions["dues_sewer_trans_dev"] == 2942.35
    assert all_exactions["dues_sewer_trans_own"] == 0

    # assert all_exactions["total_exactions"] == (370.37 + 770.96 + 2942.35) - 70.37
    # assert all_exactions["sewer_exactions"] == 770.96 + 2942.35
    # assert all_exactions["non_sewer_exactions"] == 370.37 - 70.37
    # assert all_exactions["current_exactions"] == (370.37 + 770.96 + 2942.35) - 70.37
