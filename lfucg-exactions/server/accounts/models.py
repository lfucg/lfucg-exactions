from django.db import models

from django.contrib.auth.models import User
from plats.models import Lot, Plat

from simple_history.models import HistoricalRecords

EXPANSION_AREAS = (
    ('EA-1', 'EA-1'),
    ('EA-2A', 'EA-2A'),
    ('EA-2B', 'EA-2B'),
    ('EA-2C', 'EA-2C'),
    ('EA-3', 'EA-3'),
)


class Account(models.Model):
    is_active = models.BooleanField(default=True)

    STATES = (
        ('AK', 'Alaska'),
        ('AL', 'Alabama'),
        ('AR', 'Arkansas'),
        ('AS', 'American Samoa'),
        ('AZ', 'Arizona'),
        ('CA', 'California'),
        ('CO', 'Colorado'),
        ('CT', 'Connecticut'),
        ('DC', 'District of Columbia'),
        ('DE', 'Delaware'),
        ('FL', 'Florida'),
        ('GA', 'Georgia'),
        ('GU', 'Guam'),
        ('HI', 'Hawaii'),
        ('IA', 'Iowa'),
        ('ID', 'Idaho'),
        ('IL', 'Illinois'),
        ('IN', 'Indiana'),
        ('KS', 'Kansas'),
        ('KY', 'Kentucky'),
        ('LA', 'Louisiana'),
        ('MA', 'Massachusetts'),
        ('MD', 'Maryland'),
        ('ME', 'Maine'),
        ('MI', 'Michigan'),
        ('MN', 'Minnesota'),
        ('MO', 'Missouri'),
        ('MP', 'Northern Mariana Islands'),
        ('MS', 'Mississippi'),
        ('MT', 'Montana'),
        ('NA', 'National'),
        ('NC', 'North Carolina'),
        ('ND', 'North Dakota'),
        ('NE', 'Nebraska'),
        ('NH', 'New Hampshire'),
        ('NJ', 'New Jersey'),
        ('NM', 'New Mexico'),
        ('NV', 'Nevada'),
        ('NY', 'New York'),
        ('OH', 'Ohio'),
        ('OK', 'Oklahoma'),
        ('OR', 'Oregon'),
        ('PA', 'Pennsylvania'),
        ('PR', 'Puerto Rico'),
        ('RI', 'Rhode Island'),
        ('SC', 'South Carolina'),
        ('SD', 'South Dakota'),
        ('TN', 'Tennessee'),
        ('TX', 'Texas'),
        ('UT', 'Utah'),
        ('VA', 'Virginia'),
        ('VI', 'Virgin Islands'),
        ('VT', 'Vermont'),
        ('WA', 'Washington'),
        ('WI', 'Wisconsin'),
        ('WV', 'West Virginia'),
        ('WY', 'Wyoming'),
    )

    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='account_created')
    modified_by = models.ForeignKey(User, related_name='account_modified')

    account_name = models.CharField(max_length=200)

    contact_first_name = models.CharField(max_length=100)
    contact_last_name = models.CharField(max_length=100)
    contact_full_name = models.CharField(max_length=200)

    address_number = models.IntegerField()
    address_street = models.CharField(max_length=200)
    address_city = models.CharField(max_length=100)
    address_state = models.CharField(max_length=50, choices=STATES)
    address_zip = models.CharField(max_length=10)
    address_full = models.CharField(max_length=300)

    phone = models.CharField(max_length=15)
    email = models.EmailField(max_length=100)

    current_account_balance = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)
    current_sewer_balance = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)
    current_non_sewer_balance = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)

    history = HistoricalRecords()

    def __str__(self):
        return self.account_name

class Agreement(models.Model):
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    AGREEMENT_TYPES = (
        ('MEMO', 'Memo'),
        ('RESOLUTION', 'Resolution'),
        ('OTHER', 'Other'),
    )
 
    date_executed = models.DateField()
    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='agreement_created')
    modified_by = models.ForeignKey(User, related_name='agreement_modified')    

    account_id = models.ForeignKey(Account, related_name='agreement')
    resolution_number = models.CharField(max_length=100, unique=True)

    expansion_area = models.CharField(max_length=100, choices=EXPANSION_AREAS)
    agreement_type = models.CharField(max_length=100, choices=AGREEMENT_TYPES)

    history = HistoricalRecords()

    def __str__(self):
        return self.resolution_number

class Payment(models.Model):
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    PAYMENT_TYPE = (
        ('CHECK', 'Check'),
        ('CREDIT_CARD', 'Credit Card'),
        ('OTHER', 'Other'),
    )

    PAID_BY_TYPE_CHOICES = (
        ('BUILDER', 'Builder'),
        ('DEVELOPER', 'Developer'),
        ('OWNER', 'Home Owner'),
    )

    lot_id = models.ForeignKey(Lot, related_name='payment')
    credit_source = models.ForeignKey(Agreement, related_name='payment_source', null=True, blank=True)
    credit_account = models.ForeignKey(Account, related_name='payment_account')

    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='payment_created')
    modified_by = models.ForeignKey(User, related_name='payment_modified')

    paid_by = models.CharField(max_length=100)
    paid_by_type = models.CharField(max_length=100, choices=PAID_BY_TYPE_CHOICES)
    payment_type = models.CharField(max_length=100, choices=PAYMENT_TYPE)
    check_number = models.CharField(max_length=20, null=True, blank=True)

    paid_roads = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)
    paid_sewer_trans = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)
    paid_sewer_cap = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)
    paid_parks = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)
    paid_storm = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)
    paid_open_space = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)

    history = HistoricalRecords()

    def __str__(self):
        return self.lot_id.address_full

    def calculate_payment_total(self):
        return self.paid_roads + \
            self.paid_sewer_trans + \
            self.paid_sewer_cap + \
            self.paid_parks + \
            self.paid_storm + \
            self.paid_open_space


class Project(models.Model):
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    CATEGORIES = (
        ('ROADS', 'Roads'),
        ('SEWER', 'Sanitary Sewer'),
        ('PARK', 'Park'),
        ('STORM_WATER', 'Storm Water'),
    )

    PROJECT_TYPES = (
        ('Roads', (
                ('BOULEVARD', 'Boulevard'),
                ('PARKWAY', 'Parkway'),
                ('TWO_LANE_BOULEVARD', 'Two-Lane Boulevard'),
                ('TWO_LANE_PARKWAY', 'Two-Lane Parkway'),
            )
        ),
        ('Sewer', (
                ('SEWER_TRANSMISSION', 'Sanitary Sewer Transmission'),
                ('SEWER_OTHER', 'Other Sewer'),
            )
        ),
        ('Stormwater', (
                ('STORMWATER', 'Storm Water'),
                ('LAND_AQUISITION', 'Land Aquisition'),
            )
        ),
        ('Parks', (
                ('PARKS_AQUISITION', 'Parks Aquisition'),
            )
        ),
        ('Other', (
            ('OTHER_NON_SEWER', 'Other Non-Sewer'),
        ))
    )

    STATUS_CHOICES = (
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETE', 'Complete'),
        ('CLOSED', 'Closed Out'),
    )

    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='project_created')
    modified_by = models.ForeignKey(User, related_name='project_modified')  

    agreement_id = models.ForeignKey(Agreement, related_name='project')

    expansion_area = models.CharField(max_length=100, choices=EXPANSION_AREAS)
    name = models.CharField(max_length=200)

    project_category = models.CharField(max_length=100, choices=CATEGORIES)
    project_type = models.CharField(max_length=200, choices=PROJECT_TYPES)
    project_status = models.CharField(max_length=100, choices=STATUS_CHOICES)
    status_date = models.DateField()

    project_description = models.TextField(null=True, blank=True)

    history = HistoricalRecords()

    def __str__(self):
        return self.name

class ProjectCostEstimate(models.Model):
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='project_cost_estimate_created')
    modified_by = models.ForeignKey(User, related_name='project_cost_estimate_modified')  

    project_id = models.ForeignKey(Project, related_name='project_cost_estimate', null=True, blank=True)

    estimate_type = models.CharField(max_length=200)

    land_cost = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)
    design_cost = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)
    construction_cost = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)
    admin_cost = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)
    management_cost = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)
    other_cost = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)

    credits_available = models.DecimalField(max_digits=20, decimal_places=2)

    history = HistoricalRecords()

    def __str__(self):
        return self.estimate_type

class AccountLedger(models.Model):
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    ENTRY_TYPE = (
        ('NEW', 'New Credits'),
        ('USE', 'Use Credits'),
        ('TRANSFER', 'Transfer Credits'),
    )

    entry_date = models.DateField()
    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='ledger_created')
    modified_by = models.ForeignKey(User, related_name='ledger_modified')  

    account_from = models.ForeignKey(Account, related_name='ledger_account_from', blank=True, null=True)
    account_to = models.ForeignKey(Account, related_name='ledger_account_to', blank=True, null=True)
    lot = models.ForeignKey(Lot, related_name='ledger_lot', blank=True, null=True)
    agreement = models.ForeignKey(Agreement, related_name='ledger', blank=True, null=True)

    entry_type = models.CharField(max_length=100, choices=ENTRY_TYPE)

    non_sewer_credits = models.DecimalField(max_digits=20, decimal_places=2)
    sewer_credits = models.DecimalField(max_digits=20, decimal_places=2)

    roads = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)
    sewer_trans = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)
    sewer_cap = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)
    parks = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)
    storm = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)
    open_space = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True, default=0)


    history = HistoricalRecords()

    def __str__(self):
        return str(self.lot)

    def calculate_credits(self):
        return self.non_sewer_credits + self.sewer_credits

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    is_supervisor = models.BooleanField(default=False)
    is_approval_required = models.BooleanField(default=False)
