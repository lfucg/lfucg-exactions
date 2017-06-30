from django.db import models
from django.contrib.auth.models import User

from simple_history.models import HistoricalRecords

class Note(models.Model):
    is_active = models.BooleanField(default=True)

    user = models.ForeignKey(User, related_name='note')

    note = models.TextField()
    date = models.DateTimeField(auto_now=True)

    history = HistoricalRecords()

    def __str__(self):
        return self.note

class RateTable(models.Model):
    is_active = models.BooleanField(default=True)

    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='rate_table_created')
    modified_by = models.ForeignKey(User, related_name='rate_table_modified')

    begin_effective_date = models.DateField()
    end_effective_date = models.DateField()

    resolution_number = models.IntegerField()

    history = HistoricalRecords()

class Rate(models.Model):
    is_active = models.BooleanField(default=True)
    
    ZONES = (
        ('EAR-1', 'EAR-1'),
        ('EAR-1SRA', 'EAR-1SRA'),
        ('EAR-2', 'EAR-2'),
        ('EAR-3', 'EAR-3'),
        ('CC(RES)', 'CC(RES)'),
        ('CC(NONR)', 'CC(NONR)'),
        ('ED', 'ED'),
        # ('A-R', 'Agricultural Rural'),
        # ('A-B', 'Agricultural Buffer'),
        # ('A-N', 'Agricultural Natural Areas'),
        # ('A-U', 'Agricultural Urban'),
        # ('R-1A', 'Single Family Residential'),
        # ('R-1B', 'Single Family Residential'),
        # ('R-1C', 'Single Family Residential'),
        # ('R-1D', 'Single Family Residential'),
        # ('R-1E', 'Single Family Residential'),
        # ('R-1T', 'Townhouse Residential'),
        # ('R-2', 'Two-Family Residential'),
        # ('R-3', 'Planned Neighborhood Residential'),
        # ('R-4', 'High Density Apartment'),
        # ('R-5', 'High Rise Apartment'),
        # ('P-1', 'Professional Office'),
        # ('B-1', 'Neighborhood Business'),
        # ('B-2', 'Downtown Business'),
        # ('B-2A', 'Downtown Frame Business'),
        # ('B-2B', 'Lexington Center Business'),
        # ('B-3', 'Highway Service Business'),
        # ('B-4', 'Wholesale and Warehouse Business'),
        # ('I-1', 'Light Industrial'),
        # ('I-2', 'Heavy Industrial'),
        # ('P-2', 'Office, Industry, and Research Park'),
    )

    CATEGORIES = (
        ('ROADS', 'Roads'),
        ('OPEN_SPACE', 'Open Space'),
        ('SEWER_CAP', 'Sewer Capacity'),
        ('SEWER_TRANS', 'Sewer Trans.'),
        ('PARK', 'Park'),
        ('STORM_WATER', 'Storm Water'),
    )

    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='rate_created')
    modified_by = models.ForeignKey(User, related_name='rate_modified')

    rate_table_id = models.ForeignKey(RateTable, related_name='rate')

    expansion_area = models.CharField(max_length=200)
    zone = models.CharField(max_length=100, choices=ZONES)
    category = models.CharField(max_length=100, choices=CATEGORIES)
    rate = models.DecimalField(max_digits=20, decimal_places=2)

    history = HistoricalRecords()

    def __str__(self):
        return self.zone + ': ' + self.category
