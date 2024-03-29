# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2022-03-07 20:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plats', '0006_auto_20220216_2050'),
    ]

    operations = [
        migrations.AlterField(
            model_name='historicallot',
            name='address_direction',
            field=models.CharField(blank=True, default='', max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='historicallot',
            name='address_unit',
            field=models.CharField(blank=True, default='', max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='lot',
            name='address_direction',
            field=models.CharField(blank=True, default='', max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='lot',
            name='address_unit',
            field=models.CharField(blank=True, default='', max_length=100, null=True),
        ),
        migrations.AlterUniqueTogether(
            name='lot',
            unique_together=set([('address_number', 'address_street', 'address_full')]),
        ),
    ]
