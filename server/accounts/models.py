from django.db import models
from django.contrib.auth.models import User
from plats.models import Lot

class Account(models.Model):
    is_active = models.BooleanField(default=True)

    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='account_created')
    modified_by = models.ForeignKey(User, related_name='account_modified')

    account_name = models.CharField(max_length=200)

    contact_first_name = models.CharField(max_length=100)
    contact_last_name = models.CharField(max_length=100)
    contact_full_name = models.CharField(max_length=200)

    address_city = models.CharField(max_length=100)
    address_state = models.CharField(max_length=50)
    address_zip = models.CharField(max_length=10)
    address_full = models.CharField(max_length=300)

    phone = models.CharField(max_length=15)
    email = models.EmailField(max_length=100)

    def __str__(self):
        return self.account_name

class Agreement(models.Model):
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    date_executed = models.DateField()
    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='agreement_created')
    modified_by = models.ForeignKey(User, related_name='agreement_modified')    

    account_id = models.ForeignKey(Account, related_name='agreement')
    resolution_number = models.CharField(max_length=100)

    expansion_area = models.CharField(max_length=100)
    agreement_type = models.CharField(max_length=100)

    def __str__(self):
        return self.account_id.account_name

class Payment(models.Model):
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    lot_id = models.ForeignKey(Lot, related_name='payment')
    credit_source = models.ForeignKey(Agreement, related_name='payment_source')
    credit_account = models.ForeignKey(Account, related_name='payment_account')

    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='payment_created')
    modified_by = models.ForeignKey(User, related_name='payment_modified')

    paid_by = models.CharField(max_length=100)
    paid_by_type = models.CharField(max_length=100)
    payment_type = models.CharField(max_length=100)
    check_number = models.IntegerField()

    paid_roads = models.DecimalField(max_digits=20, decimal_places=2)
    paid_sewer_trans = models.DecimalField(max_digits=20, decimal_places=2)
    paid_sewer_cap = models.DecimalField(max_digits=20, decimal_places=2)
    paid_parks = models.DecimalField(max_digits=20, decimal_places=2)
    paid_storm = models.DecimalField(max_digits=20, decimal_places=2)
    paid_open_space = models.DecimalField(max_digits=20, decimal_places=2)

    def __str__(self):
        return self.lot_id.address_full

class Project(models.Model):
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='project_created')
    modified_by = models.ForeignKey(User, related_name='project_modified')  

    agreement_id = models.ForeignKey(Agreement, related_name='project')

    expansion_area = models.CharField(max_length=100)
    
    project_category = models.CharField(max_length=200)
    project_type = models.CharField(max_length=200)
    project_description = models.TextField()
    project_status = models.CharField(max_length=200)
    status_date = models.DateField()

    def __str__(self):
        return self.project_description

class ProjectCostEstimate(models.Model):
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='project_cost_estimate_created')
    modified_by = models.ForeignKey(User, related_name='project_cost_estimate_modified')  

    project_id = models.ForeignKey(Project, related_name='project_cost_estimate')

    estimate_type = models.CharField(max_length=200)

    land_cost = models.DecimalField(max_digits=20, decimal_places=2)
    design_cost = models.DecimalField(max_digits=20, decimal_places=2)
    construction_cost = models.DecimalField(max_digits=20, decimal_places=2)
    admin_cont = models.DecimalField(max_digits=20, decimal_places=2)
    management_cost = models.DecimalField(max_digits=20, decimal_places=2)

    credits_available = models.DecimalField(max_digits=20, decimal_places=2)

    def __str__(self):
        return self.project_id.agreement_id.account_name

class AccountLedger(models.Model):
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    entry_date = models.DateField()
    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='ledger_created')
    modified_by = models.ForeignKey(User, related_name='ledger_modified')  

    account_from = models.ForeignKey(Account, related_name='ledger_account_from', blank=True, null=True)
    account_to = models.ForeignKey(Account, related_name='ledger_account_to', blank=True, null=True)
    lot = models.ForeignKey(Lot, related_name='ledger_lot', blank=True, null=True)
    agreement = models.ForeignKey(Agreement, related_name='ledger', blank=True, null=True)

    entry_type = models.CharField(max_length=200)

    non_sewer_credits = models.DecimalField(max_digits=20, decimal_places=2)
    sewer_credits = models.DecimalField(max_digits=20, decimal_places=2)

    def __str__(self):
        return 'Lat: ' + self.lot.latitude +  ' Long: ' + self.lot.longitude
