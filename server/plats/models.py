from django.db import models
from django.contrib.auth.models import User

from simple_history.models import HistoricalRecords

class Subdivision(models.Model):
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='subdivision_created')
    modified_by = models.ForeignKey(User, related_name='subdivision_modified')    

    name = models.CharField(max_length=200)
    gross_acreage = models.DecimalField(max_digits=20, decimal_places=3)
    number_allowed_lots = models.PositiveIntegerField()

    history = HistoricalRecords()

    def __str__(self):
        return self.name

class Plat(models.Model):
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    subdivision = models.ForeignKey(Subdivision, blank=True, null=True, related_name='plat')

    date_recorded = models.DateField()
    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='plat_created')
    modified_by = models.ForeignKey(User, related_name='plat_modified')
    
    total_acreage = models.DecimalField(max_digits=20, decimal_places=3)
    latitude = models.CharField(max_length=100)
    longitude = models.CharField(max_length=100)

    # plan or development plan
    plat_type = models.CharField(max_length=200)

    expansion_area = models.CharField(max_length=100)
    unit = models.CharField(max_length=200)
    section = models.CharField(max_length=200)
    block = models.CharField(max_length=200)
    
    buildable_lots = models.CharField(max_length=200)
    non_buildable_lots = models.CharField(max_length=200)

    cabinet = models.CharField(max_length=200)
    slide = models.CharField(max_length=200)

    calculation_note = models.TextField()

    sewer_due = models.DecimalField(max_digits=20, decimal_places=2)
    non_sewer_due = models.DecimalField(max_digits=20, decimal_places=2)

    history = HistoricalRecords()

    def __str__(self):
        return 'Lat: ' + self.latitude +  ' Long: ' + self.longitude


class Lot(models.Model):
    is_approved = models.BooleanField(default=False)
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

    plat = models.ForeignKey(Plat, related_name='lot')
    parcel_id = models.CharField(max_length=200, null=True, blank=True)
    
    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='lot_created')
    modified_by = models.ForeignKey(User, related_name='lot_modified')

    lot_number = models.CharField(max_length=100)
    permit_id = models.CharField(max_length=200)

    latitude = models.CharField(max_length=100)
    longitude = models.CharField(max_length=100)

    address_number = models.IntegerField()
    address_direction = models.CharField(max_length=50, null=True, blank=True)
    address_street = models.CharField(max_length=200)
    address_suffix = models.CharField(max_length=100, null=True, blank=True)
    address_unit = models.CharField(max_length=100, null=True, blank=True)
    address_city = models.CharField(max_length=100)
    address_state = models.CharField(max_length=50, choices=STATES)
    address_zip = models.CharField(max_length=10)
    address_full = models.CharField(max_length=300)

    dues_roads_dev = models.DecimalField(max_digits=20, decimal_places=2)
    dues_roads_own = models.DecimalField(max_digits=20, decimal_places=2)
    
    dues_sewer_trans_dev = models.DecimalField(max_digits=20, decimal_places=2)
    dues_sewer_trans_own = models.DecimalField(max_digits=20, decimal_places=2)
    dues_sewer_cap_dev = models.DecimalField(max_digits=20, decimal_places=2)
    dues_sewer_cap_own = models.DecimalField(max_digits=20, decimal_places=2)

    dues_parks_dev = models.DecimalField(max_digits=20, decimal_places=2)
    dues_parks_own = models.DecimalField(max_digits=20, decimal_places=2)

    dues_storm_dev = models.DecimalField(max_digits=20, decimal_places=2)
    dues_storm_own = models.DecimalField(max_digits=20, decimal_places=2)

    dues_open_space_dev = models.DecimalField(max_digits=20, decimal_places=2)
    dues_open_space_own = models.DecimalField(max_digits=20, decimal_places=2)

    history = HistoricalRecords()

    def __str__(self):
        return self.address_full    

class PlatZone(models.Model):
    is_active = models.BooleanField(default=True)

    ZONES = (
        ('A-R', 'Agricultural Rural'),
        ('A-B', 'Agricultural Buffer'),
        ('A-N', 'Agricultural Natural Areas'),
        ('A-U', 'Agricultural Urban'),
        ('R-1A', 'Single Family Residential'),
        ('R-1B', 'Single Family Residential'),
        ('R-1C', 'Single Family Residential'),
        ('R-1D', 'Single Family Residential'),
        ('R-1E', 'Single Family Residential'),
        ('R-1T', 'Townhouse Residential'),
        ('R-2', 'Two-Family Residential'),
        ('R-3', 'Planned Neighborhood Residential'),
        ('R-4', 'High Density Apartment'),
        ('R-5', 'High Rise Apartment'),
        ('P-1', 'Professional Office'),
        ('B-1', 'Neighborhood Business'),
        ('B-2', 'Downtown Business'),
        ('B-2A', 'Downtown Frame Business'),
        ('B-2B', 'Lexington Center Business'),
        ('B-3', 'Highway Service Business'),
        ('B-4', 'Wholesale and Warehouse Business'),
        ('I-1', 'Light Industrial'),
        ('I-2', 'Heavy Industrial'),
        ('P-2', 'Office, Industry, and Research Park'),
    )

    plat = models.ForeignKey(Plat, related_name='plat_zone')

    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='plat_zone_created')
    modified_by = models.ForeignKey(User, related_name='plat_zone_modified')

    zone = models.CharField(max_length=100, choices=ZONES)
    acres = models.DecimalField(max_digits=20, decimal_places=2)

    history = HistoricalRecords()

    def __str__(self):
        return self.zone

class CalculationWorksheet(models.Model):
    is_active = models.BooleanField(default=True)

    ZONES = (
        ('A-R', 'Agricultural Rural'),
        ('A-B', 'Agricultural Buffer'),
        ('A-N', 'Agricultural Natural Areas'),
        ('A-U', 'Agricultural Urban'),
        ('R-1A', 'Single Family Residential'),
        ('R-1B', 'Single Family Residential'),
        ('R-1C', 'Single Family Residential'),
        ('R-1D', 'Single Family Residential'),
        ('R-1E', 'Single Family Residential'),
        ('R-1T', 'Townhouse Residential'),
        ('R-2', 'Two-Family Residential'),
        ('R-3', 'Planned Neighborhood Residential'),
        ('R-4', 'High Density Apartment'),
        ('R-5', 'High Rise Apartment'),
        ('P-1', 'Professional Office'),
        ('B-1', 'Neighborhood Business'),
        ('B-2', 'Downtown Business'),
        ('B-2A', 'Downtown Frame Business'),
        ('B-2B', 'Lexington Center Business'),
        ('B-3', 'Highway Service Business'),
        ('B-4', 'Wholesale and Warehouse Business'),
        ('I-1', 'Light Industrial'),
        ('I-2', 'Heavy Industrial'),
        ('P-2', 'Office, Industry, and Research Park'),
    )

    acres = models.DecimalField(max_digits=20, decimal_places=2)
    zone = models.CharField(max_length=100, choices=ZONES)

    history = HistoricalRecords()

    def __str__(self):
        return self.zone + self.acres