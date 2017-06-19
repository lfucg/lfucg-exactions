# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-19 12:49
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('notes', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='HistoricalNote',
            fields=[
                ('id', models.IntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True)),
                ('note', models.TextField()),
                ('date', models.DateTimeField(blank=True, editable=False)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField()),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'get_latest_by': 'history_date',
                'ordering': ('-history_date', '-history_id'),
                'verbose_name': 'historical note',
            },
        ),
        migrations.CreateModel(
            name='HistoricalRate',
            fields=[
                ('id', models.IntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True)),
                ('date_created', models.DateField(blank=True, editable=False)),
                ('date_modified', models.DateField(blank=True, editable=False)),
                ('expansion_area', models.CharField(max_length=200)),
                ('zone', models.CharField(choices=[('A-R', 'Agricultural Rural'), ('A-B', 'Agricultural Buffer'), ('A-N', 'Agricultural Natural Areas'), ('A-U', 'Agricultural Urban'), ('R-1A', 'Single Family Residential'), ('R-1B', 'Single Family Residential'), ('R-1C', 'Single Family Residential'), ('R-1D', 'Single Family Residential'), ('R-1E', 'Single Family Residential'), ('R-1T', 'Townhouse Residential'), ('R-2', 'Two-Family Residential'), ('R-3', 'Planned Neighborhood Residential'), ('R-4', 'High Density Apartment'), ('R-5', 'High Rise Apartment'), ('P-1', 'Professional Office'), ('B-1', 'Neighborhood Business'), ('B-2', 'Downtown Business'), ('B-2A', 'Downtown Frame Business'), ('B-2B', 'Lexington Center Business'), ('B-3', 'Highway Service Business'), ('B-4', 'Wholesale and Warehouse Business'), ('I-1', 'Light Industrial'), ('I-2', 'Heavy Industrial'), ('P-2', 'Office, Industry, and Research Park')], max_length=100)),
                ('category', models.CharField(max_length=200)),
                ('rate', models.CharField(max_length=200)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField()),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('created_by', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('rate_table_id', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='notes.RateTable')),
            ],
            options={
                'get_latest_by': 'history_date',
                'ordering': ('-history_date', '-history_id'),
                'verbose_name': 'historical rate',
            },
        ),
        migrations.CreateModel(
            name='HistoricalRateTable',
            fields=[
                ('id', models.IntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True)),
                ('date_created', models.DateField(blank=True, editable=False)),
                ('date_modified', models.DateField(blank=True, editable=False)),
                ('begin_effective_date', models.DateField()),
                ('end_effective_date', models.DateField()),
                ('resolution_number', models.IntegerField()),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField()),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('created_by', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'get_latest_by': 'history_date',
                'ordering': ('-history_date', '-history_id'),
                'verbose_name': 'historical rate table',
            },
        ),
    ]
