# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-07-06 20:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plats', '0006_auto_20170706_1621'),
    ]

    operations = [
        migrations.AlterField(
            model_name='historicalplatzone',
            name='dues_open_spaces',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=20),
        ),
        migrations.AlterField(
            model_name='historicalplatzone',
            name='dues_parks',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=20),
        ),
        migrations.AlterField(
            model_name='historicalplatzone',
            name='dues_roads',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=20),
        ),
        migrations.AlterField(
            model_name='historicalplatzone',
            name='dues_sewer_cap',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=20),
        ),
        migrations.AlterField(
            model_name='historicalplatzone',
            name='dues_sewer_trans',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=20),
        ),
        migrations.AlterField(
            model_name='historicalplatzone',
            name='dues_storm_water',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=20),
        ),
        migrations.AlterField(
            model_name='platzone',
            name='dues_open_spaces',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=20),
        ),
        migrations.AlterField(
            model_name='platzone',
            name='dues_parks',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=20),
        ),
        migrations.AlterField(
            model_name='platzone',
            name='dues_roads',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=20),
        ),
        migrations.AlterField(
            model_name='platzone',
            name='dues_sewer_cap',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=20),
        ),
        migrations.AlterField(
            model_name='platzone',
            name='dues_sewer_trans',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=20),
        ),
        migrations.AlterField(
            model_name='platzone',
            name='dues_storm_water',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=20),
        ),
    ]