from rest_framework import serializers
from django.contrib.auth.models import User

from django.contrib.contenttypes.models import ContentType

from .models import *
from .utils import created_by_modified_by
from plats.models import Plat, Lot

class UserNameField(serializers.Field):
    def to_internal_value(self, data):
        return User.objects.filter(id=data)[0]

    def to_representation(self, obj):
        return obj.first_name + ' ' + obj.last_name

class ContentTypeField(serializers.Field):
    def to_internal_value(self, data):
        if data == 'Plat':
            return ContentType.objects.get_for_model(Plat)
        elif data == 'Lot':
            return ContentType.objects.get_for_model(Lot)

    def to_representation(self, obj):
        if obj.model == 'plat':
            return 'Plat'
        elif obj.model == 'lot':
            return 'Lot'
        else:
            return obj.model

class CleanedDateField(serializers.Field):
    def to_representation(self, obj):
        return obj.strftime('%m/%d/%Y')

class NoteSerializer(serializers.ModelSerializer):
    user = UserNameField()
    content_type = ContentTypeField()
    date = CleanedDateField(read_only=True)

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

    def save(self, **kwargs):
        created_by_modified_by(self, **kwargs)

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

    def save(self, **kwargs):
        created_by_modified_by(self, **kwargs)
