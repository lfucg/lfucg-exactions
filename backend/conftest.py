import pytest
from django.contrib.auth.models import Group, User
from django.core.management import call_command

from accounts.models import (
    Account,
    AccountLedger,
    Agreement,
    Payment,
    Profile,
)
from plats.models import (
    Lot,
    Plat,
    PlatZone,
    Subdivision,
)


@pytest.fixture()
def initial_data(django_db_blocker):
    with django_db_blocker.unblock():
        call_command("loaddata", "-v", "0", "initial_data.json")


class TestUsers:
    super_admin = User()
    finance_supervisor = User()
    finance_regular = User()
    planning_supervisor = User()
    planning_regular = User()
    inspection_supervisor = User()
    inspection_regular = User()

@pytest.fixture
def superuser_client(client):
    super_admin = User.objects.create_user(
        username='super_admin',
        email="superuser@lexingtonky.gov",
        password="test",
        first_name="Super",
        last_name="User",
        is_active=True,
        is_staff=True,
        is_superuser=True,
    )

    client.force_login(super_admin)


@pytest.fixture
def test_users() -> TestUsers:
    users = TestUsers()

    users.super_admin = User.objects.create_user(
        username="super_admin",
        email="superuser@lexingtonky.gov",
        password="test",
        first_name="Super",
        last_name="User",
        is_active=True,
        is_staff=True,
        is_superuser=True,
    )

    # Finance Users
    finance_group = Group.objects.get_or_create(name='Finance')

    users.finance_supervisor = User.objects.create_user(
        username='finance_supervisor',
        email="finance_supervisor@lexingtonky.gov",
        password="finance_supervisor",
        first_name="Finance",
        last_name="Supervisor",
        is_active=True,
        is_staff=False,
        is_superuser=False,
    )
    # users.finance_supervisor.groups.add(finance_group)
    users.finance_supervisor.save()
    Profile.objects.get_or_create(
        user=users.finance_supervisor,
        is_supervisor=True,
        is_approval_required=False,
    )

    users.finance_regular = User.objects.create_user(
        username='finance_regular',
        email="finance_regular@lexingtonky.gov",
        password="finance_regular",
        first_name="Finance",
        last_name="Regular",
        is_active=True,
        is_staff=False,
        is_superuser=False,
    )
    # users.finance_regular.groups.add(finance_group)
    users.finance_regular.save()
    Profile.objects.get_or_create(
        user=users.finance_regular,
        is_supervisor=False,
        is_approval_required=True,
    )

    # Planning Users
    planning_group = Group.objects.get_or_create(name='Planning')

    users.planning_supervisor = User.objects.create_user(
        username='planning_supervisor',
        email="planning_supervisor@lexingtonky.gov",
        password="planning_supervisor",
        first_name="Planning",
        last_name="Supervisor",
        is_active=True,
        is_staff=False,
        is_superuser=False,
    )
    # users.planning_supervisor.groups.add(planning_group)
    users.planning_supervisor.save()
    Profile.objects.get_or_create(
        user=users.planning_supervisor,
        is_supervisor=True,
        is_approval_required=False,
    )

    users.planning_regular = User.objects.create_user(
        username='planning_regular',
        email="planning_regular@lexingtonky.gov",
        password="planning_regular",
        first_name="Planning",
        last_name="Regular",
        is_active=True,
        is_staff=False,
        is_superuser=False,
    )
    # users.planning_regular.groups.add(planning_group)
    users.planning_regular.save()
    Profile.objects.get_or_create(
        user=users.planning_regular,
        is_supervisor=False,
        is_approval_required=True,
    )

    # Building Inspection Users
    inspection_group = Group.objects.get_or_create(name="Building Inspection")

    users.inspection_supervisor = User.objects.create_user(
        username='inspection_supervisor',
        email="inspection_supervisor@lexingtonky.gov",
        password="inspection_supervisor",
        first_name="Inspection",
        last_name="Supervisor",
        is_active=True,
        is_staff=False,
        is_superuser=False,
    )
    # users.inspection_supervisor.groups.add(inspection_group)
    users.inspection_supervisor.save()
    Profile.objects.get_or_create(
        user=users.inspection_supervisor,
        is_supervisor=True,
        is_approval_required=False,
    )

    users.inspection_regular = User.objects.create_user(
        username='inspection_regular',
        email="inspection_regular@lexingtonky.gov",
        password="inspection_regular",
        first_name="Inspection",
        last_name="Regular",
        is_active=True,
        is_staff=False,
        is_superuser=False,
    )
    # users.inspection_regular.groups.add(inspection_group)
    users.inspection_regular.save()
    Profile.objects.get_or_create(
        user=users.inspection_regular,
        is_supervisor=False,
        is_approval_required=True,
    )

    return users


class TestData:
    subdivision = Subdivision()
    plat = Plat()
    lot = Lot()
    plat_zone_1 = PlatZone()
    plat_zone_2 = PlatZone()
    account = Account()
    lfucg_account = Account()
    agreement = Agreement()
    ledger_1 = AccountLedger()
    ledger_2 = AccountLedger()
    payment_1 = Payment()
    payment_2 = Payment()

@pytest.fixture
def test_data(
    client,
    test_users: TestUsers,
    initial_data,
) -> TestData:
    data = TestData()

    data.lfucg_account = Account.objects.get(
        account_name="Lexington Fayette Urban County Government (LFUCG)"
    )

    superuser = getattr(test_users, "super_admin")
    client.force_login(superuser)

    data.account = Account.objects.create(
        account_name='Account Test',
        contact_first_name='Account First',
        contact_last_name='Account Last',
        contact_full_name='Account First Account Last',

        created_by=superuser,
        modified_by=superuser,

        address_number='123',
        address_street='Account Street',
        address_city='Lexington',
        address_state='KY',
        address_zip='40508',
        address_full='123 Account Street Lexington, KY 40508',

        phone='123-123-1234',
        email='account.test@lfucg.org',
    )

    data.subdivision = Subdivision.objects.create(
        name="Subdivision Test",
        gross_acreage=60,
        created_by=superuser,
        modified_by=superuser,
    )

    data.agreement = Agreement.objects.create(
        date_executed="2016-07-05",
        account_id=data.account,
        resolution_number="1234-4321",
        expansion_area="EA-1",
        agreement_type="RESOLUTION",
        created_by=superuser,
        modified_by=superuser,
    )

    data.plat = Plat.objects.create(
        subdivision=data.subdivision,
        account=data.account,
        date_recorded="2016-07-05",
        name="Plat Test",
        total_acreage=40,
        acreage_type="NET",
        plat_type="DEVELOPMENT_PLAN",
        expansion_area="EA-1",
        unit="1-B",
        case_number="3",
        buildable_lots="81",
        non_buildable_lots="3",
        cabinet="S",
        slide="482",
        created_by=superuser,
        modified_by=superuser,
    )

    data.plat_zone_1 = PlatZone.objects.create(
        plat=data.plat,
        zone="EAR-1",
        acres=30,
        created_by=superuser,
        modified_by=superuser,
    )

    data.plat_zone_2 = PlatZone.objects.create(
        plat=data.plat,
        zone="EAR-2",
        acres=10,
        created_by=superuser,
        modified_by=superuser,
    )

    data.lot = Lot.objects.create(
        plat=data.plat,
        account=data.account,
        address_number=123,
        address_street="Lot Test Street",
        address_state="KY",
        address_zip="40509",
        address_full="123 Lot Test Street Lexington, KY 40509",
        created_by=superuser,
        modified_by=superuser,
    )

    data.ledger_1 = AccountLedger.objects.create(
        entry_date='2025-3-14',
        account_from=data.account,
        account_to=data.lfucg_account,
        lot=data.lot,
        agreement=data.agreement,
        entry_type='USE',
        non_sewer_credits=70.37,
        sewer_credits=0,
        roads=0,
        sewer_trans=0,
        sewer_cap=0,
        parks=0,
        storm=0,
        open_space=70.37,
        created_by=superuser,
        modified_by=superuser,
    )

    return data
