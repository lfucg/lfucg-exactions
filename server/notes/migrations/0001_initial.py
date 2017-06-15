# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-15 02:00
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True)),
                ('note', models.TextField()),
                ('date', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='note', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Rate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True)),
                ('date_created', models.DateField(auto_now_add=True)),
                ('date_modified', models.DateField(auto_now=True)),
                ('expansion_area', models.CharField(max_length=200)),
                ('zone', models.CharField(choices=[('A-R', 'Agricultural Rural'), ('A-B', 'Agricultural Buffer'), ('A-N', 'Agricultural Natural Areas'), ('A-U', 'Agricultural Urban'), ('R-1A', 'Single Family Residential'), ('R-1B', 'Single Family Residential'), ('R-1C', 'Single Family Residential'), ('R-1D', 'Single Family Residential'), ('R-1E', 'Single Family Residential'), ('R-1T', 'Townhouse Residential'), ('R-2', 'Two-Family Residential'), ('R-3', 'Planned Neighborhood Residential'), ('R-4', 'High Density Apartment'), ('R-5', 'High Rise Apartment'), ('P-1', 'Professional Office'), ('B-1', 'Neighborhood Business'), ('B-2', 'Downtown Business'), ('B-2A', 'Downtown Frame Business'), ('B-2B', 'Lexington Center Business'), ('B-3', 'Highway Service Business'), ('B-4', 'Wholesale and Warehouse Business'), ('I-1', 'Light Industrial'), ('I-2', 'Heavy Industrial'), ('P-2', 'Office, Industry, and Research Park')], max_length=100)),
                ('category', models.CharField(max_length=200)),
                ('rate', models.CharField(max_length=200)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rate_created', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rate_modified', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='RateTable',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True)),
                ('date_created', models.DateField(auto_now_add=True)),
                ('date_modified', models.DateField(auto_now=True)),
                ('begin_effective_date', models.DateField()),
                ('end_effective_date', models.DateField()),
                ('resolution_number', models.IntegerField()),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rate_table_created', to=settings.AUTH_USER_MODEL)),
                ('modified_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rate_table_modified', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='rate',
            name='rate_table_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rate', to='notes.RateTable'),
        ),
    ]
