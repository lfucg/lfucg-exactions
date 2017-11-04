from rest_framework import serializers
from django.contrib.auth.models import User

from django.contrib.contenttypes.models import ContentType

from .models import *
from plats.models import Plat, Lot, Subdivision

class UserNameField(serializers.Field):
    def to_internal_value(self, data):
        return User.objects.filter(id=data)[0]

    def to_representation(self, obj):
        return obj.first_name + ' ' + obj.last_name

class ContentTypeField(serializers.Field):
    def to_internal_value(self, data):
        split_content_type = data.split('_')

        if len(split_content_type) == 2:
            content_type_app_label = split_content_type[0]
            content_type_model = split_content_type[1]

            return ContentType.objects.get(app_label=content_type_app_label, model=content_type_model)

    def to_representation(self, obj):
        return obj.name.title()

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
    table_identifier = serializers.SerializerMethodField(read_only=True)

    def get_table_identifier(self, obj):
        return obj.category + ', ' + obj.zone + ', ' + obj.expansion_area

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
            'table_identifier',
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

class FileUploadSerializer(serializers.ModelSerializer):
    file_content_type = ContentTypeField()
    date = CleanedDateField(read_only=True)

    filename_display = serializers.SerializerMethodField(read_only=True)

    def get_filename_display(self, obj):
        return obj.upload.name

    class Meta:
        model = FileUpload
        fields = (
            'id',
            'upload',
            'date',
            'file_content_type',
            'file_object_id',
            'filename_display',
        )

        read_only = (
            'upload',
            'file_content_type',
            'file_object_id',
            'filename_display',
        )

class FileUploadCreateSerializer(serializers.ModelSerializer):
    file_content_type = ContentTypeField()
    date = CleanedDateField(read_only=True)

    class Meta:
        model = FileUpload
        fields = (
            'id',
            'upload',
            'date',
            'file_content_type',
            'file_object_id',
        )

