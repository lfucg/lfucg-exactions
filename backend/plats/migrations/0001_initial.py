# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-12-10 17:19
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CalculationWorksheet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True)),
                ('name', models.CharField(max_length=200)),
                ('acres', models.DecimalField(decimal_places=2, max_digits=20)),
                ('zone', models.CharField(choices=[('EAR-1', 'EAR-1'), ('EAR-1SRA', 'EAR-1SRA'), ('EAR-1SDAO', 'EAR-1 (Special Design Area Overlay)'), ('EAR-2', 'EAR-2'), ('EAR-2/TA', 'EAR-2 / TA'), ('EAR-3', 'EAR-3'), ('A-R', 'A-R'), ('B-5P', 'B-5P'), ('CC(RES)', 'CC(RES)'), ('CC(NONR)', 'CC(NONR)'), ('ED', 'ED')], max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='HistoricalCalculationWorksheet',
            fields=[
                ('id', models.IntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True)),
                ('name', models.CharField(max_length=200)),
                ('acres', models.DecimalField(decimal_places=2, max_digits=20)),
                ('zone', models.CharField(choices=[('EAR-1', 'EAR-1'), ('EAR-1SRA', 'EAR-1SRA'), ('EAR-1SDAO', 'EAR-1 (Special Design Area Overlay)'), ('EAR-2', 'EAR-2'), ('EAR-2/TA', 'EAR-2 / TA'), ('EAR-3', 'EAR-3'), ('A-R', 'A-R'), ('B-5P', 'B-5P'), ('CC(RES)', 'CC(RES)'), ('CC(NONR)', 'CC(NONR)'), ('ED', 'ED')], max_length=100)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField()),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical calculation worksheet',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': 'history_date',
            },
        ),
        migrations.CreateModel(
            name='HistoricalLot',
            fields=[
                ('id', models.IntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('is_approved', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('parcel_id', models.CharField(blank=True, max_length=200, null=True)),
                ('date_created', models.DateField(blank=True, editable=False)),
                ('date_modified', models.DateField(blank=True, editable=False)),
                ('lot_number', models.CharField(blank=True, max_length=100, null=True)),
                ('permit_id', models.CharField(blank=True, max_length=200, null=True)),
                ('latitude', models.CharField(blank=True, max_length=100, null=True)),
                ('longitude', models.CharField(blank=True, max_length=100, null=True)),
                ('address_number', models.IntegerField()),
                ('address_direction', models.CharField(blank=True, max_length=50, null=True)),
                ('address_street', models.CharField(max_length=200)),
                ('address_suffix', models.CharField(blank=True, max_length=100, null=True)),
                ('address_unit', models.CharField(blank=True, max_length=100, null=True)),
                ('address_city', models.CharField(default='Lexington', max_length=100)),
                ('address_state', models.CharField(choices=[('KY', 'Kentucky')], default='KY', max_length=50)),
                ('address_zip', models.CharField(blank=True, choices=[('40505', '40505'), ('40509', '40509'), ('40511', '40511'), ('40515', '40515'), ('40516', '40516')], max_length=10, null=True)),
                ('address_full', models.CharField(max_length=300)),
                ('alternative_address_number', models.IntegerField(blank=True, null=True)),
                ('alternative_address_street', models.CharField(blank=True, max_length=200, null=True)),
                ('dues_roads_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_roads_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_sewer_trans_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_sewer_trans_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_sewer_cap_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_sewer_cap_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_parks_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_parks_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_storm_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_storm_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_open_space_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_open_space_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_roads_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_roads_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_sewer_trans_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_sewer_trans_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_sewer_cap_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_sewer_cap_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_parks_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_parks_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_storm_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_storm_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_open_space_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_open_space_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('certificate_of_occupancy_final', models.DateField(blank=True, null=True)),
                ('certificate_of_occupancy_conditional', models.DateField(blank=True, null=True)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField()),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('account', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='accounts.Account')),
                ('created_by', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical lot',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': 'history_date',
            },
        ),
        migrations.CreateModel(
            name='HistoricalPlat',
            fields=[
                ('id', models.IntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('is_approved', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('date_recorded', models.DateField()),
                ('date_created', models.DateField(blank=True, editable=False)),
                ('date_modified', models.DateField(blank=True, editable=False)),
                ('name', models.CharField(max_length=300)),
                ('latitude', models.CharField(blank=True, max_length=100, null=True)),
                ('longitude', models.CharField(blank=True, max_length=100, null=True)),
                ('total_acreage', models.DecimalField(decimal_places=2, max_digits=20)),
                ('right_of_way_acreage', models.DecimalField(blank=True, decimal_places=2, max_digits=20, null=True)),
                ('acreage_type', models.CharField(blank=True, choices=[('GROSS', 'gross'), ('NET', 'net')], max_length=100, null=True)),
                ('plat_type', models.CharField(choices=[('PLAT', 'Final Record Plat'), ('DEVELOPMENT_PLAN', 'Final Development Plan')], max_length=100)),
                ('expansion_area', models.CharField(choices=[('EA-1', 'EA-1'), ('EA-2A', 'EA-2A'), ('EA-2B', 'EA-2B'), ('EA-2C', 'EA-2C'), ('EA-3', 'EA-3')], max_length=100)),
                ('unit', models.CharField(blank=True, max_length=200, null=True)),
                ('section', models.CharField(blank=True, max_length=200, null=True)),
                ('block', models.CharField(blank=True, max_length=200, null=True)),
                ('case_number', models.CharField(blank=True, max_length=200, null=True)),
                ('buildable_lots', models.IntegerField()),
                ('non_buildable_lots', models.IntegerField(default=0)),
                ('cabinet', models.CharField(max_length=200)),
                ('slide', models.CharField(max_length=200)),
                ('calculation_note', models.TextField(blank=True, null=True)),
                ('sewer_due', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('non_sewer_due', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_sewer_due', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_non_sewer_due', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('amended', models.BooleanField(default=False)),
                ('signed_date', models.DateField(blank=True, null=True)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField()),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('account', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='accounts.Account')),
            ],
            options={
                'verbose_name': 'historical plat',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': 'history_date',
            },
        ),
        migrations.CreateModel(
            name='HistoricalPlatZone',
            fields=[
                ('id', models.IntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True)),
                ('date_created', models.DateField(blank=True, editable=False)),
                ('date_modified', models.DateField(blank=True, editable=False)),
                ('zone', models.CharField(choices=[('EAR-1', 'EAR-1'), ('EAR-1SRA', 'EAR-1SRA'), ('EAR-1SDAO', 'EAR-1 (Special Design Area Overlay)'), ('EAR-2', 'EAR-2'), ('EAR-2/TA', 'EAR-2 / TA'), ('EAR-3', 'EAR-3'), ('A-R', 'A-R'), ('B-5P', 'B-5P'), ('CC(RES)', 'CC(RES)'), ('CC(NONR)', 'CC(NONR)'), ('ED', 'ED')], max_length=100)),
                ('acres', models.DecimalField(decimal_places=2, max_digits=20)),
                ('dues_roads', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_open_spaces', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_sewer_cap', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_sewer_trans', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_parks', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_storm_water', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField()),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('created_by', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical plat zone',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': 'history_date',
            },
        ),
        migrations.CreateModel(
            name='HistoricalSubdivision',
            fields=[
                ('id', models.IntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('is_approved', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('date_created', models.DateField(blank=True, editable=False)),
                ('date_modified', models.DateField(blank=True, editable=False)),
                ('name', models.CharField(max_length=200)),
                ('gross_acreage', models.DecimalField(decimal_places=3, max_digits=20)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField()),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('created_by', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical subdivision',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': 'history_date',
            },
        ),
        migrations.CreateModel(
            name='Lot',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_approved', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('parcel_id', models.CharField(blank=True, max_length=200, null=True)),
                ('date_created', models.DateField(auto_now_add=True)),
                ('date_modified', models.DateField(auto_now=True)),
                ('lot_number', models.CharField(blank=True, max_length=100, null=True)),
                ('permit_id', models.CharField(blank=True, max_length=200, null=True)),
                ('latitude', models.CharField(blank=True, max_length=100, null=True)),
                ('longitude', models.CharField(blank=True, max_length=100, null=True)),
                ('address_number', models.IntegerField()),
                ('address_direction', models.CharField(blank=True, max_length=50, null=True)),
                ('address_street', models.CharField(max_length=200)),
                ('address_suffix', models.CharField(blank=True, max_length=100, null=True)),
                ('address_unit', models.CharField(blank=True, max_length=100, null=True)),
                ('address_city', models.CharField(default='Lexington', max_length=100)),
                ('address_state', models.CharField(choices=[('KY', 'Kentucky')], default='KY', max_length=50)),
                ('address_zip', models.CharField(blank=True, choices=[('40505', '40505'), ('40509', '40509'), ('40511', '40511'), ('40515', '40515'), ('40516', '40516')], max_length=10, null=True)),
                ('address_full', models.CharField(max_length=300)),
                ('alternative_address_number', models.IntegerField(blank=True, null=True)),
                ('alternative_address_street', models.CharField(blank=True, max_length=200, null=True)),
                ('dues_roads_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_roads_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_sewer_trans_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_sewer_trans_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_sewer_cap_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_sewer_cap_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_parks_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_parks_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_storm_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_storm_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_open_space_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_open_space_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_roads_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_roads_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_sewer_trans_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_sewer_trans_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_sewer_cap_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_sewer_cap_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_parks_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_parks_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_storm_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_storm_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_open_space_dev', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_dues_open_space_own', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('certificate_of_occupancy_final', models.DateField(blank=True, null=True)),
                ('certificate_of_occupancy_conditional', models.DateField(blank=True, null=True)),
                ('account', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='lot_account', to='accounts.Account')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lot_created', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lot_modified', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Plat',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_approved', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('date_recorded', models.DateField()),
                ('date_created', models.DateField(auto_now_add=True)),
                ('date_modified', models.DateField(auto_now=True)),
                ('name', models.CharField(max_length=300)),
                ('latitude', models.CharField(blank=True, max_length=100, null=True)),
                ('longitude', models.CharField(blank=True, max_length=100, null=True)),
                ('total_acreage', models.DecimalField(decimal_places=2, max_digits=20)),
                ('right_of_way_acreage', models.DecimalField(blank=True, decimal_places=2, max_digits=20, null=True)),
                ('acreage_type', models.CharField(blank=True, choices=[('GROSS', 'gross'), ('NET', 'net')], max_length=100, null=True)),
                ('plat_type', models.CharField(choices=[('PLAT', 'Final Record Plat'), ('DEVELOPMENT_PLAN', 'Final Development Plan')], max_length=100)),
                ('expansion_area', models.CharField(choices=[('EA-1', 'EA-1'), ('EA-2A', 'EA-2A'), ('EA-2B', 'EA-2B'), ('EA-2C', 'EA-2C'), ('EA-3', 'EA-3')], max_length=100)),
                ('unit', models.CharField(blank=True, max_length=200, null=True)),
                ('section', models.CharField(blank=True, max_length=200, null=True)),
                ('block', models.CharField(blank=True, max_length=200, null=True)),
                ('case_number', models.CharField(blank=True, max_length=200, null=True)),
                ('buildable_lots', models.IntegerField()),
                ('non_buildable_lots', models.IntegerField(default=0)),
                ('cabinet', models.CharField(max_length=200)),
                ('slide', models.CharField(max_length=200)),
                ('calculation_note', models.TextField(blank=True, null=True)),
                ('sewer_due', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('non_sewer_due', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_sewer_due', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('current_non_sewer_due', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('amended', models.BooleanField(default=False)),
                ('signed_date', models.DateField(blank=True, null=True)),
                ('account', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='plat_account', to='accounts.Account')),
                ('amended_parent_plat', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='plat_amend', to='plats.Plat')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='plat_created', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='plat_modified', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PlatZone',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True)),
                ('date_created', models.DateField(auto_now_add=True)),
                ('date_modified', models.DateField(auto_now=True)),
                ('zone', models.CharField(choices=[('EAR-1', 'EAR-1'), ('EAR-1SRA', 'EAR-1SRA'), ('EAR-1SDAO', 'EAR-1 (Special Design Area Overlay)'), ('EAR-2', 'EAR-2'), ('EAR-2/TA', 'EAR-2 / TA'), ('EAR-3', 'EAR-3'), ('A-R', 'A-R'), ('B-5P', 'B-5P'), ('CC(RES)', 'CC(RES)'), ('CC(NONR)', 'CC(NONR)'), ('ED', 'ED')], max_length=100)),
                ('acres', models.DecimalField(decimal_places=2, max_digits=20)),
                ('dues_roads', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_open_spaces', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_sewer_cap', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_sewer_trans', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_parks', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('dues_storm_water', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='plat_zone_created', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='plat_zone_modified', to=settings.AUTH_USER_MODEL)),
                ('plat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='plat_zone', to='plats.Plat')),
            ],
        ),
        migrations.CreateModel(
            name='Subdivision',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_approved', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('date_created', models.DateField(auto_now_add=True)),
                ('date_modified', models.DateField(auto_now=True)),
                ('name', models.CharField(max_length=200)),
                ('gross_acreage', models.DecimalField(decimal_places=3, max_digits=20)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subdivision_created', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subdivision_modified', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='plat',
            name='subdivision',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='plat', to='plats.Subdivision'),
        ),
        migrations.AddField(
            model_name='lot',
            name='plat',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lot', to='plats.Plat'),
        ),
        migrations.AddField(
            model_name='historicalplatzone',
            name='plat',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='plats.Plat'),
        ),
        migrations.AddField(
            model_name='historicalplat',
            name='amended_parent_plat',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='plats.Plat'),
        ),
        migrations.AddField(
            model_name='historicalplat',
            name='created_by',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='historicalplat',
            name='history_user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='historicalplat',
            name='modified_by',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='historicalplat',
            name='subdivision',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='plats.Subdivision'),
        ),
        migrations.AddField(
            model_name='historicallot',
            name='plat',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='plats.Plat'),
        ),
    ]