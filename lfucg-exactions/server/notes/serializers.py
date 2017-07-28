from rest_framework import serializers

from .models import *

class NoteSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField(read_only=True)
    content_type_title = serializers.SerializerMethodField(read_only=True)
    cleaned_date = serializers.SerializerMethodField(read_only=True)

    def get_user_name(self, obj):
        return obj.user.first_name + ' ' + obj.user.last_name

    def get_content_type_title(self, obj):
        if obj.content_type.model == 'plat':
            return 'Plat'
        elif obj.content_type.model == 'lot':
            return 'Lot'

    def get_cleaned_date(self, obj):
        return obj.date.strftime('%m/%d/%Y')

    class Meta:
        model = Note
        fields = (
            'id',
            'is_active',
            'user',
            'note',
            'date',
            'content_type',
            'object_id',

            'user_name',
            'content_type_title',
            'cleaned_date',
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
