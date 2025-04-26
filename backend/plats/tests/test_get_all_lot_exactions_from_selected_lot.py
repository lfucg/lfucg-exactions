import pytest

from conftest import TestData
from plats.utils import get_all_lot_exactions_from_selected_lot

pytestmark = pytest.mark.django_db

def test_get_all_lot_exactions_from_selected_lot_initialized(
    test_data: TestData,
):
    lot = test_data.lot

    assert lot is not None

    # Assert we have these values before other tests to properly test calculations
    assert lot.dues_roads_dev == 0
    assert lot.dues_roads_own == 0
    assert lot.dues_parks_dev == 0
    assert lot.dues_parks_own == 0
    assert lot.dues_open_space_dev == 370.37
    assert lot.dues_open_space_own == 0
    assert lot.dues_storm_dev == 0
    assert lot.dues_storm_own == 0
    assert lot.dues_sewer_cap_dev == 770.96
    assert lot.dues_sewer_cap_own == 0
    assert lot.dues_sewer_trans_dev == 2942.35
    assert lot.dues_sewer_trans_own == 0

def test_get_all_lot_exactions_from_selected_lot_all_exactions(
    test_data: TestData,
):
    lot = test_data.lot

    all_exactions = get_all_lot_exactions_from_selected_lot(lot)

    assert all_exactions['dues_roads_dev'] == 0
    assert all_exactions['dues_roads_own'] == 0
    assert all_exactions['dues_parks_dev'] == 0
    assert all_exactions['dues_parks_own'] == 0
    assert all_exactions['dues_open_space_dev'] == 370.37
    assert all_exactions['dues_open_space_own'] == 0
    assert all_exactions['dues_storm_dev'] == 0
    assert all_exactions['dues_storm_own'] == 0
    assert all_exactions['dues_sewer_cap_dev'] == 770.96
    assert all_exactions['dues_sewer_cap_own'] == 0
    assert all_exactions['dues_sewer_trans_dev'] == 2942.35
    assert all_exactions['dues_sewer_trans_own'] == 0

    assert all_exactions["total_exactions"] == 370.37 + 770.96 + 2942.35
    assert all_exactions["sewer_exactions"] == 770.96 + 2942.35
    assert all_exactions["non_sewer_exactions"] == 370.37
    assert all_exactions["current_exactions"] == 370.37 + 770.96 + 2942.35
