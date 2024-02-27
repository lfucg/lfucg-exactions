from .models import Lot, Plat
from accounts.models import *
from rest_framework.response import Response
from rest_framework import status
from decimal import Decimal

def calculate_lot_totals(lot):
    sewer_exactions = (
        Decimal(lot.current_dues_sewer_cap_own) +
        Decimal(lot.current_dues_sewer_trans_dev) +
        Decimal(lot.current_dues_sewer_trans_own) +
        Decimal(lot.current_dues_sewer_cap_dev)
    )

    non_sewer_exactions = (
        Decimal(lot.current_dues_roads_own) +
        Decimal(lot.current_dues_roads_dev) +
        Decimal(lot.current_dues_parks_dev) +
        Decimal(lot.current_dues_parks_own) +
        Decimal(lot.current_dues_storm_dev) +
        Decimal(lot.current_dues_storm_own) +
        Decimal(lot.current_dues_open_space_dev) +
        Decimal(lot.current_dues_open_space_own)
    )

    total_exactions = sewer_exactions + non_sewer_exactions

    return {
        'sewer_exactions': Decimal(sewer_exactions),
        'non_sewer_exactions': Decimal(non_sewer_exactions),
        'total_exactions': Decimal(total_exactions),
    }

def subtract_ledger_values(ledger_value, lot_dev_value, lot_own_value):
    new_led = ledger_value
    new_dev = lot_dev_value
    new_own = lot_own_value
    should_escape = False

    while new_led > 0 and not should_escape:
        if new_dev >= new_led or new_own >= new_led:
            if new_dev >= new_led:
                new_dev -= new_led
                new_led -= new_led
            if new_own >= new_led:
                new_own -= new_led
                new_led -= new_led
        elif (new_dev + new_own) >= new_led:
            if new_dev > 0:
                new_led -= new_dev
                new_dev -= new_dev
            if new_own > 0:
                new_led -= new_own
                new_own -= new_own
        elif new_dev > 0 or new_own > 0:
            if new_dev > 0:
                new_dev -= new_dev
                new_led -= new_dev
            if new_own > 0:
                new_own -= new_own
                new_led -= new_own
        else:
            should_escape = True

    return (new_led, new_dev, new_own)

def calculate_lot_balance(lot_queryset):
    lot = lot_queryset
    payments = lot_queryset.payment.all() if hasattr(lot_queryset, 'payment') else None
    account_ledgers = lot_queryset.ledger_lot.all() if hasattr(lot_queryset, 'ledger_lot') else None

    dues_roads_dev = Decimal(lot.dues_roads_dev)
    dues_roads_own = Decimal(lot.dues_roads_own)
    dues_sewer_trans_dev = Decimal(lot.dues_sewer_trans_dev)
    dues_sewer_trans_own = Decimal(lot.dues_sewer_trans_own)
    dues_sewer_cap_dev = Decimal(lot.dues_sewer_cap_dev)
    dues_sewer_cap_own = Decimal(lot.dues_sewer_cap_own)
    dues_parks_dev = Decimal(lot.dues_parks_dev)
    dues_parks_own = Decimal(lot.dues_parks_own)
    dues_storm_dev = Decimal(lot.dues_storm_dev)
    dues_storm_own = Decimal(lot.dues_storm_own)
    dues_open_space_dev = Decimal(lot.dues_open_space_dev)
    dues_open_space_own = Decimal(lot.dues_open_space_own)

    sewer_exactions = (
        dues_sewer_cap_own + dues_sewer_trans_dev +
        dues_sewer_trans_own + dues_sewer_cap_dev
    )

    non_sewer_exactions = (
        dues_roads_own + dues_roads_dev +
        dues_parks_own + dues_parks_dev +
        dues_storm_own + dues_storm_dev +
        dues_open_space_own + dues_open_space_dev
    )

    total_exactions = sewer_exactions + non_sewer_exactions

    all_exactions = {
        'total_exactions': total_exactions,
        'sewer_exactions': sewer_exactions,
        'non_sewer_exactions': non_sewer_exactions,

        'sewer_payment': 0,
        'non_sewer_payment': 0,

        'sewer_credits_applied': 0,
        'non_sewer_credits_applied': 0,

        'current_exactions': total_exactions,
        'sewer_due': sewer_exactions,
        'non_sewer_due': non_sewer_exactions,
        'dues_roads_dev': dues_roads_dev,
        'dues_roads_own': dues_roads_own,
        'dues_sewer_trans_dev': dues_sewer_trans_dev,
        'dues_sewer_trans_own': dues_sewer_trans_own,
        'dues_sewer_cap_dev': dues_sewer_cap_dev,
        'dues_sewer_cap_own': dues_sewer_cap_own,
        'dues_parks_dev': dues_parks_dev,
        'dues_parks_own': dues_parks_own,
        'dues_storm_dev': dues_storm_dev,
        'dues_storm_own': dues_storm_own,
        'dues_open_space_dev': dues_open_space_dev,
        'dues_open_space_own': dues_open_space_own,
    }

    if payments:
        for payment in payments:
            all_exactions['sewer_payment'] = all_exactions['sewer_payment'] + Decimal(
                payment.paid_sewer_trans +
                payment.paid_sewer_cap
            )
            all_exactions['non_sewer_payment'] = all_exactions['non_sewer_payment'] + Decimal(
                payment.paid_roads +
                payment.paid_parks +
                payment.paid_storm +
                payment.paid_open_space
            )

            paid_sewer_trans = Decimal(payment.paid_sewer_trans)
            paid_sewer_cap = Decimal(payment.paid_sewer_cap)
            paid_roads = Decimal(payment.paid_roads)
            paid_parks = Decimal(payment.paid_parks)
            paid_storm = Decimal(payment.paid_storm)
            paid_open_space = Decimal(payment.paid_open_space)

            pay_val = {
                'paid_sewer_trans': paid_sewer_trans,
                'paid_sewer_cap': paid_sewer_cap,
                'paid_roads': paid_roads,
                'paid_parks': paid_parks,
                'paid_storm': paid_storm,
                'paid_open_space': paid_open_space,
            }


            all_exactions['sewer_due'] = all_exactions['sewer_due'] - payment.paid_sewer_trans - payment.paid_sewer_cap
            all_exactions['non_sewer_due'] = all_exactions['non_sewer_due'] - payment.paid_roads - payment.paid_parks - payment.paid_storm - payment.paid_open_space

            own_sum = all_exactions['dues_sewer_trans_own'] + all_exactions['dues_sewer_cap_own'] + all_exactions['dues_roads_own'] + all_exactions['dues_parks_own'] + all_exactions['dues_storm_own'] + all_exactions['dues_open_space_own']
 
            if own_sum > 0:
                if pay_val['paid_sewer_trans'] > all_exactions['dues_sewer_trans_own']:
                    tmp_paid_sewer_trans = pay_val['paid_sewer_trans'] - all_exactions['dues_sewer_trans_own']
                    all_exactions['dues_sewer_trans_dev'] = all_exactions['dues_sewer_trans_dev'] - tmp_paid_sewer_trans
                    all_exactions['dues_sewer_trans_own'] = 0
                else:
                    all_exactions['dues_sewer_trans_own'] = all_exactions['dues_sewer_trans_own'] - pay_val['paid_sewer_trans']
                    pay_val['paid_sewer_trans'] = 0

                if pay_val['paid_sewer_cap'] > all_exactions['dues_sewer_cap_own']:
                    tmp_paid_sewer_cap = pay_val['paid_sewer_cap'] - all_exactions['dues_sewer_cap_own']
                    all_exactions['dues_sewer_cap_dev'] = all_exactions['dues_sewer_cap_dev'] - tmp_paid_sewer_cap
                    all_exactions['dues_sewer_cap_own'] = 0
                else:
                    all_exactions['dues_sewer_cap_own'] = all_exactions['dues_sewer_cap_own'] - pay_val['paid_sewer_cap']
                    pay_val['paid_sewer_cap'] = 0

                if pay_val['paid_roads'] > all_exactions['dues_roads_own']:
                    tmp_paid_roads = pay_val['paid_roads'] - all_exactions['dues_roads_own']
                    all_exactions['dues_roads_dev'] = all_exactions['dues_roads_dev'] - tmp_paid_roads
                    all_exactions['dues_roads_own'] = 0
                else:
                    all_exactions['dues_roads_own'] = all_exactions['dues_roads_own'] - pay_val['paid_roads']
                    pay_val['paid_roads'] = 0

                if pay_val['paid_parks'] > all_exactions['dues_parks_own']:
                    tmp_paid_parks = pay_val['paid_parks'] - all_exactions['dues_parks_own']
                    all_exactions['dues_parks_dev'] = all_exactions['dues_parks_dev'] - tmp_paid_parks
                    all_exactions['dues_parks_own'] = 0
                else:
                    all_exactions['dues_parks_own'] = all_exactions['dues_parks_own'] - pay_val['paid_parks']
                    pay_val['paid_parks'] = 0

                if pay_val['paid_storm'] > all_exactions['dues_storm_own']:
                    tmp_paid_storm = pay_val['paid_storm'] - all_exactions['dues_storm_own']
                    all_exactions['dues_storm_dev'] = all_exactions['dues_storm_dev'] - tmp_paid_storm
                    all_exactions['dues_storm_own'] = 0
                else:
                    all_exactions['dues_storm_own'] = all_exactions['dues_storm_own'] - pay_val['paid_storm']
                    pay_val['paid_storm'] = 0

                if pay_val['paid_open_space'] > all_exactions['dues_open_space_own']:
                    tmp_paid_open_space = pay_val['paid_open_space'] - all_exactions['dues_open_space_own']
                    all_exactions['dues_open_space_dev'] = all_exactions['dues_open_space_dev'] - tmp_paid_open_space
                    all_exactions['dues_open_space_own'] = 0
                else:
                    all_exactions['dues_open_space_own'] = all_exactions['dues_open_space_own'] - pay_val['paid_open_space']
                    pay_val['paid_open_space'] = 0

            else:
                all_exactions['dues_sewer_trans_dev'] = all_exactions['dues_sewer_trans_dev'] - pay_val['paid_sewer_trans']
                all_exactions['dues_sewer_cap_dev'] = all_exactions['dues_sewer_cap_dev'] - pay_val['paid_sewer_cap']
                all_exactions['dues_roads_dev'] = all_exactions['dues_roads_dev'] - pay_val['paid_roads']
                all_exactions['dues_parks_dev'] = all_exactions['dues_parks_dev'] - pay_val['paid_parks']
                all_exactions['dues_storm_dev'] = all_exactions['dues_storm_dev'] - pay_val['paid_storm']
                all_exactions['dues_open_space_dev'] = all_exactions['dues_open_space_dev'] - pay_val['paid_open_space']

    if account_ledgers:
        for ledger in account_ledgers:
            all_exactions['sewer_credits_applied'] += Decimal(ledger.sewer_credits)
            all_exactions['non_sewer_credits_applied'] += Decimal(ledger.non_sewer_credits)
            all_exactions['sewer_due'] -= (Decimal(ledger.sewer_trans) + Decimal(ledger.sewer_cap))
            all_exactions['non_sewer_due'] -= (Decimal(ledger.roads) + Decimal(ledger.parks) + Decimal(ledger.storm) + Decimal(ledger.open_space))

            ledger_set = {
                'ledger_sewer_trans': Decimal(ledger.sewer_trans),
                'ledger_sewer_cap': Decimal(ledger.sewer_cap),
                'ledger_roads': Decimal(ledger.roads),
                'ledger_parks': Decimal(ledger.parks),
                'ledger_storm': Decimal(ledger.storm),
                'ledger_open_space': Decimal(ledger.open_space),
            }

            ledger_calc_set = [
                {'ledger_sewer_trans': ledger_set['ledger_sewer_trans'], 'dues_sewer_trans_dev': all_exactions['dues_sewer_trans_dev'], 'dues_sewer_trans_own': all_exactions['dues_sewer_trans_own']},
                {'ledger_sewer_cap': ledger_set['ledger_sewer_cap'], 'dues_sewer_cap_dev': all_exactions['dues_sewer_cap_dev'], 'dues_sewer_cap_own': all_exactions['dues_sewer_cap_own']},
                {'ledger_roads': ledger_set['ledger_roads'], 'dues_roads_dev': all_exactions['dues_roads_dev'], 'dues_roads_own': all_exactions['dues_roads_own']},
                {'ledger_parks': ledger_set['ledger_parks'], 'dues_parks_dev': all_exactions['dues_parks_dev'], 'dues_parks_own': all_exactions['dues_parks_own']},
                {'ledger_storm': ledger_set['ledger_storm'], 'dues_storm_dev': all_exactions['dues_storm_dev'], 'dues_storm_own': all_exactions['dues_storm_own']},
                {'ledger_open_space': ledger_set['ledger_open_space'], 'dues_open_space_dev': all_exactions['dues_open_space_dev'], 'dues_open_space_own': all_exactions['dues_open_space_own']},
            ]

            for led_calc in ledger_calc_set:
                led_keys = list(led_calc.keys())

                new_led, new_dev, new_own = subtract_ledger_values(
                    led_calc[led_keys[0]],
                    led_calc[led_keys[1]],
                    led_calc[led_keys[2]]
                )

                ledger_set[led_keys[0]] = new_led
                all_exactions[led_keys[1]] = new_dev
                all_exactions[led_keys[2]] = new_own


    return all_exactions

def calculate_plat_balance(plat):
    lots_on_plat = Lot.objects.filter(plat=plat.id)

    lots_sewer_paid = 0
    lots_non_sewer_paid = 0
    if lots_on_plat.exists():
        for lot in lots_on_plat:
            calculated_lot = calculate_lot_balance(lot)
            lots_non_sewer_paid += calculated_lot['non_sewer_payment'] + calculated_lot['non_sewer_credits_applied']
            lots_sewer_paid += calculated_lot['sewer_payment'] + calculated_lot['sewer_credits_applied']

    plat_exactions = {
        'plat_sewer_due': plat.sewer_due - lots_sewer_paid,
        'plat_non_sewer_due': plat.non_sewer_due - lots_non_sewer_paid,
        'remaining_lots': plat.buildable_lots - len(lots_on_plat),
    }

    return plat_exactions

def remaining_plat_lots(plat):
    lots_on_plat = plat.lot.count()

    return plat.buildable_lots - lots_on_plat

def update_entry(self, request, pk):
    existing_object = self.get_object()
    setattr(existing_object, 'modified_by', request.user)
    serializer = self.get_serializer(existing_object, data=request.data, partial=True)
    if serializer.is_valid(raise_exception=True):
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

