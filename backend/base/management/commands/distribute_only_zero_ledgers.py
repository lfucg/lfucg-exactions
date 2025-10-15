from django.core.management import BaseCommand
import datetime

from accounts.utils import get_all_zero_ledgers
from django.contrib.auth.models import User
from plats.models import Lot
from accounts.models import AccountLedger

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        user = User.objects.get(username="IMPORT")
        mismatched_ledgers = get_all_zero_ledgers()
        mismatched_ledgers_exclude_previous = mismatched_ledgers.exclude(reconciliation_reason="Distributing sewer and non-sewer for zero ledger balances to individual fields")
        today = datetime.date.today()

        try:
            for old_ledger in mismatched_ledgers_exclude_previous:
                print(f"Processing old ledger ID: {old_ledger.id}")
                # Mark the old instance as inactive
                old_ledger_id = old_ledger.id
                lot = Lot.objects.get(pk=old_ledger.lot.id) if old_ledger.lot is not None else None

                # Create new instance as a copy of the old
                new_ledger = AccountLedger.objects.get(pk=old_ledger_id)
                new_ledger.pk = None
                # new_ledger.save()  # Save to generate a new primary key

                print('New ledger PK after save:', new_ledger.pk)

                # Calculate individual fields for new instance
                sewer = new_ledger.sewer_credits
                non_sewer = new_ledger.non_sewer_credits

                while (sewer > 0):
                    lot_sewer_cap = lot.dues_sewer_cap_dev + lot.dues_sewer_cap_own
                    lot_sewer_trans = lot.dues_sewer_trans_dev + lot.dues_sewer_trans_own

                    if (sewer >= lot_sewer_cap + lot_sewer_trans):
                        new_ledger.sewer_cap = lot_sewer_cap
                        new_ledger.sewer_trans = lot_sewer_trans
                        sewer -= (lot_sewer_cap + lot_sewer_trans)
                    else:
                        if (sewer > lot_sewer_cap) or (sewer > lot_sewer_trans):
                            if (sewer > lot_sewer_cap):
                                new_ledger.sewer_cap = lot_sewer_cap
                                sewer -= lot_sewer_cap
                            if (sewer > lot_sewer_trans):
                                new_ledger.sewer_trans = lot_sewer_trans
                                sewer -= lot_sewer_trans
                        elif (lot_sewer_cap == 0):
                            new_ledger.sewer_cap = sewer
                            sewer = 0
                        elif (lot_sewer_trans == 0):
                            new_ledger.sewer_trans = sewer
                            sewer = 0
                        else:
                            sewer = 0  # Safety net to avoid infinite loop

                while (non_sewer > 0):
                    lot_roads = lot.dues_roads_dev + lot.dues_roads_own
                    lot_parks = lot.dues_parks_dev + lot.dues_parks_own
                    lot_storm = lot.dues_storm_dev + lot.dues_storm_own
                    lot_open_space = lot.dues_open_space_dev + lot.dues_open_space_own

                    if (non_sewer >= lot_roads + lot_parks + lot_storm + lot_open_space):
                        new_ledger.roads = lot_roads
                        new_ledger.parks = lot_parks
                        new_ledger.storm = lot_storm
                        new_ledger.open_space = lot_open_space
                        non_sewer -= (lot_roads + lot_parks + lot_storm + lot_open_space)
                    else:
                        if (non_sewer > lot_roads) or (non_sewer > lot_parks) or (non_sewer > lot_storm) or (non_sewer > lot_open_space):
                            if (non_sewer > lot_roads):
                                new_ledger.roads = lot_roads
                                non_sewer -= lot_roads
                            if (non_sewer > lot_parks):
                                new_ledger.parks = lot_parks
                                non_sewer -= lot_parks
                            if (non_sewer > lot_storm):
                                new_ledger.storm = lot_storm
                                non_sewer -= lot_storm
                            if (non_sewer > lot_open_space):
                                new_ledger.open_space = lot_open_space
                                non_sewer -= lot_open_space
                        elif (lot_roads == 0):
                            new_ledger.roads = non_sewer
                            non_sewer = 0
                        elif (lot_parks == 0):
                            new_ledger.parks = non_sewer
                            non_sewer = 0
                        elif (lot_storm == 0):
                            new_ledger.storm = non_sewer
                            non_sewer = 0
                        elif (lot_open_space == 0):
                            new_ledger.open_space = non_sewer
                            non_sewer = 0
                        else:
                            non_sewer = 0  # Safety net to avoid infinite loop

                new_ledger.reconciliation_date = today
                new_ledger.reconciliation_reason = "Distributing sewer and non-sewer for zero ledger balances to individual fields"

                new_ledger.save()
                new_ledger.original_account_ledger = old_ledger
                new_ledger.is_active = old_ledger.is_active
                new_ledger.is_approved = old_ledger.is_approved
                new_ledger.date_created = old_ledger.date_created
                new_ledger.created_by = old_ledger.created_by
                new_ledger.modified_by = old_ledger.modified_by or user
                new_ledger.date_modified = old_ledger.date_modified
                new_ledger.save()

                old_ledger.is_active = False
                old_ledger.save()

        except Exception as e:
            print(f"Error processing ledger: {e}")
