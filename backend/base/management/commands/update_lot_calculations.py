from django.core.management import BaseCommand
from datetime import date

from plats.utils import calculate_lot_balance
from django.contrib.auth.models import User
from plats.models import Lot

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        user = User.objects.get(username="IMPORT")
        lots = Lot.objects.filter(date_modified__gte=date(1970, 1, 1))

        for related_lot in lots:
            lot_balances = calculate_lot_balance(related_lot)
            print("LOT NAME ", related_lot.address_street)
            related_lot.current_dues_roads_dev = lot_balances["dues_roads_dev"]
            related_lot.current_dues_roads_own = lot_balances["dues_roads_own"]
            related_lot.current_dues_sewer_trans_dev = lot_balances["dues_sewer_trans_dev"]
            related_lot.current_dues_sewer_trans_own = lot_balances["dues_sewer_trans_own"]
            related_lot.current_dues_sewer_cap_dev = lot_balances["dues_sewer_cap_dev"]
            related_lot.current_dues_sewer_cap_own = lot_balances["dues_sewer_cap_own"]
            related_lot.current_dues_parks_dev = lot_balances["dues_parks_dev"]
            related_lot.current_dues_parks_own = lot_balances["dues_parks_own"]
            related_lot.current_dues_storm_dev = lot_balances["dues_storm_dev"]
            related_lot.current_dues_storm_own = lot_balances["dues_storm_own"]
            related_lot.current_dues_open_space_dev = lot_balances["dues_open_space_dev"]
            related_lot.current_dues_open_space_own = lot_balances["dues_open_space_own"]
            print("ROADS ", related_lot.current_dues_roads_dev)
            related_lot.modified_by = user
            related_lot.save()
