# -*- coding: utf-8 -*-
# Generated by Django 1.11.18 on 2019-10-28 13:07
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_auto_20190208_1349'),
    ]

    operations = [
        migrations.AddField(
            model_name='historicalpayment',
            name='entry_date',
            field=models.DateField(default='1970-01-01'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='payment',
            name='entry_date',
            field=models.DateField(default='1970-01-01'),
            preserve_default=False,
        ),
    ]
