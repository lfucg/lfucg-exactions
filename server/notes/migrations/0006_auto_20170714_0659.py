# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-07-14 10:59
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0005_auto_20170629_1649'),
    ]

    operations = [
        migrations.AlterField(
            model_name='historicalratetable',
            name='resolution_number',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='ratetable',
            name='resolution_number',
            field=models.CharField(max_length=200),
        ),
    ]
