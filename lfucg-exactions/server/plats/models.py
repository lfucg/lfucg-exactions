from django.db import models
from django.contrib.contenttypes.fields import GenericRelation

from django.contrib.auth.models import User

from simple_history.models import HistoricalRecords
from notes.models import *

ZONES = (
    ('EAR-1', 'EAR-1'),
    ('EAR-1SRA', 'EAR-1SRA'),
    ('EAR-2', 'EAR-2'),
    ('EAR-3', 'EAR-3'),
    ('CC(RES)', 'CC(RES)'),
    ('CC(NONR)', 'CC(NONR)'),
    ('ED', 'ED'),
)

class Subdivision(models.Model):
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='subdivision_created')
    modified_by = models.ForeignKey(User, related_name='subdivision_modified')    

    name = models.CharField(max_length=200)
    gross_acreage = models.DecimalField(max_digits=20, decimal_places=3)

    history = HistoricalRecords()

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        try:
            existing_subdivision = Subdivision.objects.get(id=self.id)
            if existing_subdivision.exists():
                created_by = existing_subdivision.created_by
            else:
                created_by = self.created_by
        except:
            created_by = self.created_by

        super(Subdivision, self).save(*args, **kwargs)

class Plat(models.Model):
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    EXPANSION_AREAS = (
        ('EA-1', 'EA-1'),
        ('EA-2A', 'EA-2A'),
        ('EA-2B', 'EA-2B'),
        ('EA-2C', 'EA-2C'),
        ('EA-3', 'EA-3'),
    )

    PLAT_TYPES = (
        ('PLAT', 'Final Record Plat'),
        ('DEVELOPMENT_PLAN', 'Final Development Plan'),
    )

    subdivision = models.ForeignKey(Subdivision, blank=True, null=True, related_name='plat')
    account = models.ForeignKey('accounts.Account', blank=True, null=True, related_name='plat_account')

    date_recorded = models.DateField()
    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='plat_created')
    modified_by = models.ForeignKey(User, related_name='plat_modified')

    name = models.CharField(max_length=300)    
    total_acreage = models.DecimalField(max_digits=20, decimal_places=2)
    latitude = models.CharField(max_length=100, null=True, blank=True)
    longitude = models.CharField(max_length=100, null=True, blank=True)

    # plan or development plan
    plat_type = models.CharField(max_length=100, choices=PLAT_TYPES)

    expansion_area = models.CharField(max_length=100, choices=EXPANSION_AREAS)
    unit = models.CharField(max_length=200, null=True, blank=True)
    section = models.CharField(max_length=200, null=True, blank=True)
    block = models.CharField(max_length=200, null=True, blank=True)
    
    buildable_lots = models.IntegerField()
    non_buildable_lots = models.IntegerField(default=0)

    cabinet = models.CharField(max_length=200)
    slide = models.CharField(max_length=200)

    calculation_note = models.TextField(default='None')

    sewer_due = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    non_sewer_due = models.DecimalField(max_digits=20, decimal_places=2, default=0)

    history = HistoricalRecords()

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        try:
            existing_plat = Plat.objects.get(id=self.id)
            if existing_plat is not None:
                created_by = existing_plat.created_by
        except:
            created_by = self.created_by

        plat_zones = self.plat_zone.all()
        if plat_zones is not None:
            sewer_calc = 0
            non_sewer_calc = 0
            for plat_zone in plat_zones:
                sewer_calc += (plat_zone.dues_sewer_cap + plat_zone.dues_sewer_trans)
                non_sewer_calc += (plat_zone.dues_roads + plat_zone.dues_open_spaces + plat_zone.dues_parks + plat_zone.dues_storm_water)

            self.sewer_due = sewer_calc
            self.non_sewer_due = non_sewer_calc

        super(Plat, self).save(*args, **kwargs)


class Lot(models.Model):
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    STATES = (
        ('KY', 'Kentucky'),
    )

    ZIPCODES = (
        ('40505', '40505'),
        ('40509', '40509'),
        ('40511', '40511'),
        ('40515', '40515'),
        ('40516', '40516'),
    )

    plat = models.ForeignKey(Plat, related_name='lot')
    account = models.ForeignKey('accounts.Account', blank=True, null=True, related_name='lot_account')
    parcel_id = models.CharField(max_length=200, null=True, blank=True)
    
    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='lot_created')
    modified_by = models.ForeignKey(User, related_name='lot_modified')

    lot_number = models.CharField(max_length=100)
    permit_id = models.CharField(max_length=200, null=True, blank=True)

    latitude = models.CharField(max_length=100, null=True, blank=True)
    longitude = models.CharField(max_length=100, null=True, blank=True)

    address_number = models.IntegerField()
    address_direction = models.CharField(max_length=50, null=True, blank=True)
    address_street = models.CharField(max_length=200)
    address_suffix = models.CharField(max_length=100, null=True, blank=True)
    address_unit = models.CharField(max_length=100, null=True, blank=True)
    address_city = models.CharField(max_length=100, default='Lexington')
    address_state = models.CharField(max_length=50, choices=STATES, default='KY')
    address_zip = models.CharField(max_length=10, choices=ZIPCODES, blank=True, null=True)
    address_full = models.CharField(max_length=300)

    alternative_address_number = models.IntegerField(blank=True, null=True)
    alternative_address_street = models.CharField(max_length=200, blank=True, null=True)

    dues_roads_dev = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    dues_roads_own = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    
    dues_sewer_trans_dev = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    dues_sewer_trans_own = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    dues_sewer_cap_dev = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    dues_sewer_cap_own = models.DecimalField(max_digits=20, decimal_places=2, default=0)

    dues_parks_dev = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    dues_parks_own = models.DecimalField(max_digits=20, decimal_places=2, default=0)

    dues_storm_dev = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    dues_storm_own = models.DecimalField(max_digits=20, decimal_places=2, default=0)

    dues_open_space_dev = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    dues_open_space_own = models.DecimalField(max_digits=20, decimal_places=2, default=0)

    history = HistoricalRecords()

    def __str__(self):
        return self.address_full    

    def save(self, *args, **kwargs):
        plat = Plat.objects.get(id=self.plat.id)
        try:
            existing_lot = Lot.objects.get(id=self.id)
            if existing_lot is not None:
                created_by = existing_lot.created_by
            else:
                created_by = self.created_by
                account = self.plat.account
        except:
            created_by = self.created_by

        plat_expansion_area = plat.expansion_area
        if plat_expansion_area == 'EA-1':
            self.address_zip = '40515'


        plat_zones = plat.plat_zone.all()
        plat_buildable = plat.buildable_lots

        if plat_zones is not None:
            road_calc = 0
            sewer_cap_calc = 0
            sewer_trans_calc = 0
            park_calc = 0
            storm_calc = 0
            open_space_calc = 0

            if (self.dues_roads_dev == 0 and
            self.dues_sewer_cap_dev == 0 and
            self.dues_sewer_trans_dev == 0 and
            self.dues_parks_dev == 0 and
            self.dues_storm_dev == 0 and
            self.dues_open_space_dev ==0 and
            plat_buildable != 0):
                for plat_zone in plat_zones:
                    road_calc += (plat_zone.dues_roads / plat_buildable)
                    sewer_cap_calc += (plat_zone.dues_sewer_cap / plat_buildable)
                    sewer_trans_calc += (plat_zone.dues_sewer_trans / plat_buildable)
                    park_calc += (plat_zone.dues_parks / plat_buildable)
                    storm_calc += (plat_zone.dues_storm_water / plat_buildable)
                    open_space_calc += (plat_zone.dues_open_spaces / plat_buildable)

                self.dues_roads_dev = road_calc
                self.dues_sewer_cap_dev = sewer_cap_calc
                self.dues_sewer_trans_dev = sewer_trans_calc
                self.dues_parks_dev = park_calc
                self.dues_storm_dev = storm_calc
                self.dues_open_space_dev = open_space_calc

        super(Lot, self).save(*args, **kwargs)

class PlatZone(models.Model):
    is_active = models.BooleanField(default=True)

    plat = models.ForeignKey(Plat, related_name='plat_zone')

    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='plat_zone_created')
    modified_by = models.ForeignKey(User, related_name='plat_zone_modified')

    zone = models.CharField(max_length=100, choices=ZONES)
    acres = models.DecimalField(max_digits=20, decimal_places=2)

    dues_roads = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    dues_open_spaces = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    dues_sewer_cap = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    dues_sewer_trans = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    dues_parks = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    dues_storm_water = models.DecimalField(max_digits=20, decimal_places=2, default=0)

    history = HistoricalRecords()

    def __str__(self):
        return self.zone

    def save(self, *args, **kwargs):
        if (self.dues_roads == 0 and
            self.dues_open_spaces == 0 and
            self.dues_sewer_cap == 0 and
            self.dues_sewer_trans == 0 and
            self.dues_parks == 0 and
            self.dues_storm_water == 0
        ):
            current_rate_table = RateTable.objects.filter(is_active=True).first()

            road_rate = Rate.objects.get(expansion_area=self.plat.expansion_area, zone=self.zone, category='ROADS', rate_table_id=current_rate_table.id)
            if road_rate is not None:
                self.dues_roads = (self.acres * road_rate.rate)

            open_space_rate = Rate.objects.get(expansion_area=self.plat.expansion_area, zone=self.zone, category='OPEN_SPACE', rate_table_id=current_rate_table.id)
            if open_space_rate is not None:
                self.dues_open_spaces = (self.acres * open_space_rate.rate)

            sewer_cap_rate = Rate.objects.get(expansion_area=self.plat.expansion_area, zone=self.zone, category='SEWER_CAP', rate_table_id=current_rate_table.id)
            if sewer_cap_rate is not None:
                self.dues_sewer_cap = (self.acres * sewer_cap_rate.rate)

            sewer_trans_rate = Rate.objects.get(expansion_area=self.plat.expansion_area, zone=self.zone, category='SEWER_TRANS', rate_table_id=current_rate_table.id)
            if sewer_trans_rate is not None:
                self.dues_sewer_trans = (self.acres * sewer_trans_rate.rate)

            parks_rate = Rate.objects.get(expansion_area=self.plat.expansion_area, zone=self.zone, category='PARK', rate_table_id=current_rate_table.id)
            if parks_rate is not None:
                self.dues_parks = (self.acres * parks_rate.rate)

            storm_water_rate = Rate.objects.get(expansion_area=self.plat.expansion_area, zone=self.zone, category='STORM_WATER', rate_table_id=current_rate_table.id)
            if storm_water_rate is not None:
                self.dues_storm_water = (self.acres * storm_water_rate.rate)

        super(PlatZone, self).save(*args, **kwargs)
        
        plat_model = self.plat
        plat_model.save()

class CalculationWorksheet(models.Model):
    is_active = models.BooleanField(default=True)

    name = models.CharField(max_length=200)
    acres = models.DecimalField(max_digits=20, decimal_places=2)
    zone = models.CharField(max_length=100, choices=ZONES)

    history = HistoricalRecords()

    def __str__(self):
        return self.zone + self.acres