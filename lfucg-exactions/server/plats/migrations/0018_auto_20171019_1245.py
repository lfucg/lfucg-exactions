# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-10-19 16:45
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plats', '0017_auto_20171018_1508'),
    ]

    operations = [
        migrations.AlterField(
            model_name='calculationworksheet',
            name='zone',
            field=models.CharField(choices=[('EAR-1', 'EAR-1'), ('EAR-1SRA', 'EAR-1SRA'), ('EAR-2', 'EAR-2'), ('EAR-3', 'EAR-3'), ('CC(RES)', 'CC(RES)'), ('CC(NONR)', 'CC(NONR)'), ('ED', 'ED')], max_length=100),
        ),
        migrations.AlterField(
            model_name='historicalcalculationworksheet',
            name='zone',
            field=models.CharField(choices=[('EAR-1', 'EAR-1'), ('EAR-1SRA', 'EAR-1SRA'), ('EAR-2', 'EAR-2'), ('EAR-3', 'EAR-3'), ('CC(RES)', 'CC(RES)'), ('CC(NONR)', 'CC(NONR)'), ('ED', 'ED')], max_length=100),
        ),
        migrations.AlterField(
            model_name='historicalplatzone',
            name='zone',
            field=models.CharField(choices=[('EAR-1', 'EAR-1'), ('EAR-1SRA', 'EAR-1SRA'), ('EAR-2', 'EAR-2'), ('EAR-3', 'EAR-3'), ('CC(RES)', 'CC(RES)'), ('CC(NONR)', 'CC(NONR)'), ('ED', 'ED')], max_length=100),
        ),
        migrations.AlterField(
            model_name='platzone',
            name='zone',
            field=models.CharField(choices=[('EAR-1', 'EAR-1'), ('EAR-1SRA', 'EAR-1SRA'), ('EAR-2', 'EAR-2'), ('EAR-3', 'EAR-3'), ('CC(RES)', 'CC(RES)'), ('CC(NONR)', 'CC(NONR)'), ('ED', 'ED')], max_length=100),
        ),
    ]
