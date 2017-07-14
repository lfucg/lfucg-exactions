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

    resolution_number = models.CharField(max_length=200)

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
    )

    CATEGORIES = (
        ('ROADS', 'Roads'),
        ('OPEN_SPACE', 'Open Space'),
        ('SEWER_CAP', 'Sewer Capacity'),
        ('SEWER_TRANS', 'Sewer Trans.'),
        ('PARK', 'Park'),
        ('STORM_WATER', 'Storm Water'),
    )

    EXPANSION_AREAS = (
        ('EA-1', 'EA-1'),
        ('EA-2A', 'EA-2A'),
        ('EA-2B', 'EA-2B'),
        ('EA-2C', 'EA-2C'),
        ('EA-3', 'EA-3'),
    )

    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='rate_created')
    modified_by = models.ForeignKey(User, related_name='rate_modified')

    rate_table_id = models.ForeignKey(RateTable, related_name='rate')

    expansion_area = models.CharField(max_length=100, choices=EXPANSION_AREAS)
    zone = models.CharField(max_length=100, choices=ZONES)
    category = models.CharField(max_length=100, choices=CATEGORIES)
    rate = models.DecimalField(max_digits=20, decimal_places=2)

    history = HistoricalRecords()

    def __str__(self):
        return self.zone + ': ' + self.category
