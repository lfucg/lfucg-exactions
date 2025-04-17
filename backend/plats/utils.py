from .models import Lot, Plat
from accounts.models import *
from rest_framework.response import Response
from rest_framework import status
from decimal import Decimal

def calculate_lot_totals(lot):
    sewer_exactions = (
        round(float(lot.current_dues_sewer_cap_own), 2) +
        round(float(lot.current_dues_sewer_trans_dev), 2) +
        round(float(lot.current_dues_sewer_trans_own), 2) +
        round(float(lot.current_dues_sewer_cap_dev), 2)
    )

    non_sewer_exactions = (
        round(float(lot.current_dues_roads_own), 2) +
        round(float(lot.current_dues_roads_dev), 2) +
        round(float(lot.current_dues_parks_dev), 2) +
        round(float(lot.current_dues_parks_own), 2) +
        round(float(lot.current_dues_storm_dev), 2) +
        round(float(lot.current_dues_storm_own), 2) +
        round(float(lot.current_dues_open_space_dev), 2) +
        round(float(lot.current_dues_open_space_own), 2)
    )

    total_exactions = sewer_exactions + non_sewer_exactions

    return {
        'sewer_exactions': round(float(sewer_exactions), 2),
        'non_sewer_exactions': round(float(non_sewer_exactions), 2),
        'total_exactions': round(float(total_exactions), 2),
    }

def subtract_ledger_values(ledger_value, lot_dev_value, lot_own_value):
    new_led = ledger_value
    new_dev = lot_dev_value
    new_own = lot_own_value
    should_escape = False

    while new_led > 0 and not should_escape:
        if new_own > 0:
            if new_own >= new_led:
                new_own -= new_led
                new_led -= new_led
            elif new_led > new_own:
                new_led -= new_own
                new_own -= new_own
        elif new_dev > 0:
            if new_dev >= new_led:
                new_dev -= new_led
                new_led -= new_led
            elif new_led > new_dev:
                new_led -= new_dev
                new_dev -= new_dev
        elif new_led > 0:
            new_dev -= new_led
            new_led -= new_led
        else:
            should_escape = True

    return (new_led, new_dev, new_own)

def get_all_lot_exactions_from_selected_lot(lot):
    dues_roads_dev = round(float(lot.dues_roads_dev), 2)
    dues_roads_own = round(float(lot.dues_roads_own), 2)
    dues_sewer_trans_dev = round(float(lot.dues_sewer_trans_dev), 2)
    dues_sewer_trans_own = round(float(lot.dues_sewer_trans_own), 2)
    dues_sewer_cap_dev = round(float(lot.dues_sewer_cap_dev), 2)
    dues_sewer_cap_own = round(float(lot.dues_sewer_cap_own), 2)
    dues_parks_dev = round(float(lot.dues_parks_dev), 2)
    dues_parks_own = round(float(lot.dues_parks_own), 2)
    dues_storm_dev = round(float(lot.dues_storm_dev), 2)
    dues_storm_own = round(float(lot.dues_storm_own), 2)
    dues_open_space_dev = round(float(lot.dues_open_space_dev), 2)
    dues_open_space_own = round(float(lot.dues_open_space_own), 2)

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

    return all_exactions


def calculate_lot_balance(lot_queryset):
    lot = lot_queryset
    payments = lot_queryset.payment.filter(is_active=True) if hasattr(lot_queryset, 'payment') else None
    account_ledgers = lot_queryset.ledger_lot.filter(is_active=True) if hasattr(lot_queryset, 'ledger_lot') else None

    all_exactions = get_all_lot_exactions_from_selected_lot(lot)

    if payments is not None:
        for payment in payments:
            all_exactions['sewer_payment'] = all_exactions['sewer_payment'] + round(float(
                payment.paid_sewer_trans +
                payment.paid_sewer_cap
            ), 2)
            all_exactions['non_sewer_payment'] = all_exactions['non_sewer_payment'] + round(float(
                payment.paid_roads +
                payment.paid_parks +
                payment.paid_storm +
                payment.paid_open_space
            ), 2)

            paid_sewer_trans = round(float(payment.paid_sewer_trans), 2)
            paid_sewer_cap = round(float(payment.paid_sewer_cap), 2)
            paid_roads = round(float(payment.paid_roads), 2)
            paid_parks = round(float(payment.paid_parks), 2)
            paid_storm = round(float(payment.paid_storm), 2)
            paid_open_space = round(float(payment.paid_open_space), 2)

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
                all_exactions['dues_sewer_trans_own'] = 0
                all_exactions['dues_sewer_cap_dev'] = all_exactions['dues_sewer_cap_dev'] - pay_val['paid_sewer_cap']
                all_exactions['dues_sewer_cap_own'] = 0
                all_exactions['dues_roads_dev'] = all_exactions['dues_roads_dev'] - pay_val['paid_roads']
                all_exactions['dues_roads_own'] = 0
                all_exactions['dues_parks_dev'] = all_exactions['dues_parks_dev'] - pay_val['paid_parks']
                all_exactions['dues_parks_own'] = 0
                all_exactions['dues_storm_dev'] = all_exactions['dues_storm_dev'] - pay_val['paid_storm']
                all_exactions['dues_storm_own'] = 0
                all_exactions['dues_open_space_dev'] = all_exactions['dues_open_space_dev'] - pay_val['paid_open_space']
                all_exactions['dues_open_space_own'] = 0

    if account_ledgers is not None:
        for ledger in account_ledgers:
            all_exactions['sewer_credits_applied'] += round(float(ledger.sewer_credits), 2)
            all_exactions['non_sewer_credits_applied'] += round(float(ledger.non_sewer_credits), 2)
            all_exactions['sewer_due'] -= (round(float(ledger.sewer_trans), 2) + round(float(ledger.sewer_cap), 2))
            all_exactions['non_sewer_due'] -= (round(float(ledger.roads), 2) + round(float(ledger.parks), 2) + round(float(ledger.storm), 2) + round(float(ledger.open_space), 2))

            ledger_set = {
                'ledger_sewer_trans': round(float(ledger.sewer_trans), 2),
                'ledger_sewer_cap': round(float(ledger.sewer_cap), 2),
                'ledger_roads': round(float(ledger.roads), 2),
                'ledger_parks': round(float(ledger.parks), 2),
                'ledger_storm': round(float(ledger.storm), 2),
                'ledger_open_space': round(float(ledger.open_space), 2),
            }

            ledger_calc_set = [
                {
                    'ledger_sewer_trans': ledger_set['ledger_sewer_trans'],
                    'dues_sewer_trans_dev': all_exactions['dues_sewer_trans_dev'],
                    'dues_sewer_trans_own': all_exactions['dues_sewer_trans_own']
                },
                {
                    'ledger_sewer_cap': ledger_set['ledger_sewer_cap'],
                    'dues_sewer_cap_dev': all_exactions['dues_sewer_cap_dev'],
                    'dues_sewer_cap_own': all_exactions['dues_sewer_cap_own']
                },
                {
                    'ledger_roads': ledger_set['ledger_roads'],
                    'dues_roads_dev': all_exactions['dues_roads_dev'],
                    'dues_roads_own': all_exactions['dues_roads_own']
                },
                {
                    'ledger_parks': ledger_set['ledger_parks'],
                    'dues_parks_dev': all_exactions['dues_parks_dev'],
                    'dues_parks_own': all_exactions['dues_parks_own']
                },
                {
                    'ledger_storm': ledger_set['ledger_storm'],
                    'dues_storm_dev': all_exactions['dues_storm_dev'],
                    'dues_storm_own': all_exactions['dues_storm_own']
                },
                {
                    'ledger_open_space': ledger_set['ledger_open_space'],
                    'dues_open_space_dev': all_exactions['dues_open_space_dev'],
                    'dues_open_space_own': all_exactions['dues_open_space_own']
                },
            ]

            for led_calc in ledger_calc_set:
                led_keys = list(led_calc.keys())

                ledger_key = [i for i in led_keys if 'ledger' in i][0]
                dev_key = [i for i in led_keys if 'dev' in i][0]
                own_key = [i for i in led_keys if 'own' in i][0]

                new_led, new_dev, new_own = subtract_ledger_values(
                    led_calc[ledger_key] or 0,
                    led_calc[dev_key] or 0,
                    led_calc[own_key] or 0
                )

                ledger_set[ledger_key] = new_led
                all_exactions[dev_key] = new_dev
                all_exactions[own_key] = new_own

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
    user = request.user
    is_superuser = getattr(user, 'is_superuser', False)

    profile = Profile.objects.filter(user=user).first()
    if profile is not None or is_superuser:
        is_supervisor = getattr(profile, 'is_supervisor', False)
        if (is_supervisor and hasattr(existing_object, 'is_approved')) or is_superuser:
            setattr(existing_object, 'is_approved', True)

    setattr(existing_object, 'modified_by', user)
    serializer = self.get_serializer(existing_object, data=request.data, partial=True)
    if serializer.is_valid(raise_exception=True):
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

