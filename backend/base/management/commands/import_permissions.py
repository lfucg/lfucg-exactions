from django.core.management import BaseCommand
from django.contrib.auth.models import Group, Permission
import csv
from decimal import Decimal
from datetime import datetime

from django.contrib.auth.models import User
from plats.models import Plat, PlatZone, Lot, Subdivision
from accounts.models import Account, Agreement
from notes.models import Rate, RateTable


class Command(BaseCommand):
    help = "Imports permissions for groups"
    permission_errors = []

    def handle(self, *args, **options):
        finance_perm = [
            "add_accountledger",
            "change_accountledger",
            "add_account",
            "change_account",
            "add_agreement",
            "change_agreement",
            "add_payment",
            "change_payment",
            "add_fileupload",
            "change_fileupload",
            "add_note",
            "change_note",
            "change_lot",
            "change_plat",
            "add_platzone",
            "change_platzone",
        ]

        finance_group = Group.objects.filter(name="Finance").first()
        finance_permissions = Permission.objects.filter(codename__in=finance_perm)

        finance_group.permissions.set(finance_permissions)

        planning_perm = [
            "add_fileupload",
            "change_fileupload",
            "add_note",
            "change_note",
            "add_lot",
            "change_lot",
            "add_plat",
            "change_plat",
            "add_subdivision",
            "change_subdivision",
            "add_platzone",
            "change_platzone",
        ]

        planning_group = Group.objects.filter(name="Planning").first()
        planning_permissions = Permission.objects.filter(codename__in=planning_perm)

        planning_group.permissions.set(planning_permissions)

        building_perm = [
            "add_payment",
            "change_payment",
            "add_fileupload",
            "change_fileupload",
            "change_lot",
        ]

        building_group = Group.objects.filter(name="Building Inspection").first()
        building_permissions = Permission.objects.filter(codename__in=building_perm)

        building_group.permissions.set(building_permissions)

        print('PERMISSION ERRORS ', self.permission_errors)
