# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-11-07 19:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plats', '0019_auto_20171019_1403'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicallot',
            name='certificate_of_occupancy',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='lot',
            name='certificate_of_occupancy',
            field=models.DateField(blank=True, null=True),
        ),
    ]
