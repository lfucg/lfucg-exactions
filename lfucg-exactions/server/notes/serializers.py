from rest_framework import serializers

from .models import *

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = (
            'id',
            'is_active',
            'user',
            'note',
            'date',
        )

class RateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rate
        fields = (
            'id',
            'is_active',
            'date_created',
            'date_modified',
            'created_by',
            'modified_by',
            'rate_table_id',
            'expansion_area',
            'zone',
            'category',
            'rate',
        )

class RateTableSerializer(serializers.ModelSerializer):
    rates = RateSerializer(many=True, read_only=True)

    class Meta:
        model = RateTable
        fields = (
            'id',
            'is_active',
            'date_created',
            'date_modified',
            'created_by',
            'modified_by',
            'begin_effective_date',
            'end_effective_date',
            'resolution_number',
            'rates',
        )
