from rest_framework import serializers

from .models import *
from .utils import calculate_lot_balance

from notes.models import Note
from notes.serializers import NoteSerializer

class SubdivisionSerializer(serializers.ModelSerializer):
    cleaned_gross_acreage = serializers.SerializerMethodField(read_only=True)

    def get_cleaned_gross_acreage(self, obj):
        set_acreage = str(obj.gross_acreage).rstrip('0').rstrip('.')
        return set_acreage

    class Meta:
        model = Subdivision
        fields = (
            'id',
            'is_approved',
            'is_approved',
            'is_active',
            'date_created',
            'date_modified',

            'name',
            'gross_acreage',
            'cleaned_gross_acreage',
        )

class CalculationWorksheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalculationWorksheet
        fields = (
            'id',
            'is_active',
            'acres',
            'zone',
        )

class PlatZoneSerializer(serializers.ModelSerializer):
    cleaned_acres = serializers.SerializerMethodField(read_only=True)

    def get_cleaned_acres(self, obj):
        set_acreage = str(obj.acres).rstrip('0').rstrip('.')
        return set_acreage

    class Meta:
        model = PlatZone
        fields = (
            'id',
            'is_active',
            'plat',
            'date_created',
            'date_modified',
            'created_by',
            'modified_by',

            'zone',
            'acres',

            'dues_roads',
            'dues_open_spaces',
            'dues_sewer_cap',
            'dues_sewer_trans',
            'dues_parks',
            'dues_storm_water',

            'cleaned_acres',
        )

class SubdivisionField(serializers.Field):
    def to_internal_value(self, data):
        try:
            return Subdivision.objects.get(id=data)
        except:
            None

    def to_representation(self, obj):
        return SubdivisionSerializer(obj).data

class PlatSerializer(serializers.ModelSerializer):
    plat_zone = PlatZoneSerializer(many=True, read_only=True)
    # subdivision = SubdivisionSerializer(read_only=True)
    cleaned_total_acreage = serializers.SerializerMethodField(read_only=True)
    subdivision = SubdivisionField(required=False)
    plat_type_display = serializers.SerializerMethodField(read_only=True)

    def get_cleaned_total_acreage(self, obj):
        set_acreage = str(obj.total_acreage).rstrip('0').rstrip('.')
        return set_acreage

    def get_plat_type_display(self, obj):
        return obj.get_plat_type_display()

    class Meta:
        model = Plat 
        fields = (
            'id',
            'is_approved',
            'is_active',
            'subdivision',
            'account',

            'date_recorded',
            'date_created',
            'date_modified',
            'created_by',
            'modified_by',

            'name', 
            'total_acreage',          
            'cleaned_total_acreage',
            'latitude',
            'longitude',
            'plat_type',
            'expansion_area',
            'unit',
            'section',
            'block',
            'buildable_lots',
            'non_buildable_lots',
            'cabinet',
            'slide',
            'calculation_note',
            'sewer_due',
            'non_sewer_due',
            'plat_zone',
            'plat_type_display',
        )

class PlatField(serializers.Field):
    def to_internal_value(self, data):
        try: 
            return Plat.objects.get(id=data)
        except: 
            return None

    def to_representation(self, obj):
        return PlatSerializer(obj).data

class LotSerializer(serializers.ModelSerializer):
    plat = PlatField()

    lot_exactions = serializers.SerializerMethodField(read_only=True)

    # total_due = serializers.SerializerMethodField(read_only=True)
    # total_sewer_due = serializers.SerializerMethodField(read_only=True)
    # total_non_sewer_due = serializers.SerializerMethodField(read_only=True)

    def get_lot_exactions(self, obj):
        calculated_exactions = calculate_lot_balance(obj.id)

        return {
            'total_exactions': '${:,.2f}'.format(calculated_exactions['total_exactions']),
            'sewer_exactions': '${:,.2f}'.format(calculated_exactions['sewer_exactions']),
            'non_sewer_exactions': '${:,.2f}'.format(calculated_exactions['non_sewer_exactions']),
            'sewer_payment': '${:,.2f}'.format(calculated_exactions['sewer_payment']),
            'non_sewer_payment': '${:,.2f}'.format(calculated_exactions['non_sewer_payment']),
            'current_exactions': '${:,.2f}'.format(calculated_exactions['current_exactions']),
            'sewer_due': '${:,.2f}'.format(calculated_exactions['sewer_due']),
            'non_sewer_due': '${:,.2f}'.format(calculated_exactions['non_sewer_due']),            
        }

    # def get_total_due(self,obj):
    #     total = (
    #         obj.dues_roads_own +
    #         obj.dues_roads_dev +
    #         obj.dues_sewer_cap_own +
    #         obj.dues_sewer_trans_dev +
    #         obj.dues_sewer_trans_own +
    #         obj.dues_sewer_cap_dev +
    #         obj.dues_sewer_cap_own +
    #         obj.dues_parks_dev +
    #         obj.dues_parks_own +
    #         obj.dues_storm_dev +
    #         obj.dues_storm_own +
    #         obj.dues_open_space_dev +
    #         obj.dues_open_space_own
    #     )
    #     return total

    # def get_total_sewer_due(self,obj):
    #     total = (
    #         obj.dues_sewer_cap_own +
    #         obj.dues_sewer_trans_dev +
    #         obj.dues_sewer_trans_own +
    #         obj.dues_sewer_cap_dev +
    #         obj.dues_sewer_cap_own
    #     )
    #     return total

    # def get_total_non_sewer_due(self,obj):
    #     total = (
    #         obj.dues_roads_own +
    #         obj.dues_roads_dev +
    #         obj.dues_parks_dev +
    #         obj.dues_parks_own +
    #         obj.dues_storm_dev +
    #         obj.dues_storm_own +
    #         obj.dues_open_space_dev +
    #         obj.dues_open_space_own
    #     )
    #     return total

    class Meta:
        model = Lot
        fields = (
            'id',
            'is_approved',
            'is_active',
            'plat',
            'account',

            'parcel_id',            
            'date_created',
            'date_modified',
            'created_by',
            'modified_by',

            'lot_number',
            'permit_id',
            'latitude',
            'longitude',
            'address_number',
            'address_direction',
            'address_street',
            'address_suffix',
            'address_unit',
            'address_city',
            'address_state',
            'address_zip',
            'address_full',

            'dues_roads_dev',
            'dues_roads_own',
            'dues_sewer_trans_dev',
            'dues_sewer_trans_own',
            'dues_sewer_cap_dev',
            'dues_sewer_cap_own',
            'dues_parks_dev',
            'dues_parks_own',
            'dues_storm_dev',
            'dues_storm_own',
            'dues_open_space_dev',
            'dues_open_space_own',

            'lot_exactions',
            # 'total_due',
            # 'total_sewer_due',
            # 'total_non_sewer_due',
        )
