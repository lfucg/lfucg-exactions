# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-29 13:14
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plats', '0002_historicalcalculationworksheet_historicallot_historicalplat_historicalplatzone_historicalsubdivision'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicalplat',
            name='name',
            field=models.CharField(default=1, max_length=300),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='plat',
            name='name',
            field=models.CharField(default='new', max_length=300),
            preserve_default=False,
        ),
    ]