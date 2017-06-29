# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-29 20:39
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0003_auto_20170629_1628'),
    ]

    operations = [
        migrations.AlterField(
            model_name='historicalrate',
            name='category',
            field=models.CharField(choices=[('ROADS', 'Roads'), ('OPEN_SPACE', 'Open Space'), ('SEWER_CAP', 'Sewer Capacity'), ('SEWER_TRANS', 'Sewer Trans.'), ('PARK', 'Park'), ('STORM_WATER', 'Storm Water')], max_length=100),
        ),
        migrations.AlterField(
            model_name='rate',
            name='category',
            field=models.CharField(choices=[('ROADS', 'Roads'), ('OPEN_SPACE', 'Open Space'), ('SEWER_CAP', 'Sewer Capacity'), ('SEWER_TRANS', 'Sewer Trans.'), ('PARK', 'Park'), ('STORM_WATER', 'Storm Water')], max_length=100),
        ),
    ]
