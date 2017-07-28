# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-07-27 20:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plats', '0011_auto_20170724_1644'),
        ('accounts', '0003_historicalaccount_historicalaccountledger_historicalagreement_historicalpayment_historicalproject_hi'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='lot',
            field=models.ManyToManyField(blank=True, to='plats.Lot'),
        ),
        migrations.AddField(
            model_name='account',
            name='plat',
            field=models.ManyToManyField(blank=True, to='plats.Plat'),
        ),
    ]
