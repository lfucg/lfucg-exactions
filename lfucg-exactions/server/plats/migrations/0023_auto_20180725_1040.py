# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-07-25 14:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plats', '0022_auto_20180720_1112'),
    ]

    operations = [
        migrations.AlterField(
            model_name='historicallot',
            name='lot_number',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='lot',
            name='lot_number',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
