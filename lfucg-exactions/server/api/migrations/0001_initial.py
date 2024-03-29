# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-08-10 20:29
from __future__ import unicode_literals

from django.db import migrations

def database_forwards(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    consultant, created = Group.objects.get_or_create(name='Consultant')
    consultant.save()

def database_backwards(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    Group.objects.filter(name='Consultant').delete()

class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.RunPython(database_forwards, database_backwards)
    ]
