from rest_framework import serializers

from .models import *

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
            'created_by',
            'modified_by',   

            'name',
            'gross_acreage',
            'cleaned_gross_acreage',
            'number_allowed_lots',
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

class LotSerializer(serializers.ModelSerializer):
    # payment = PaymentSerializer(read_only=True)

    class Meta:
        model = Lot
        fields = (
            'id',
            'is_approved',
            'is_active',
            'plat',
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
            # 'payment',
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

class PlatSerializer(serializers.ModelSerializer):
    lot = LotSerializer(many=True, read_only=True)
    plat_zone = PlatZoneSerializer(many=True, read_only=True)
    cleaned_total_acreage = serializers.SerializerMethodField(read_only=True)

    def get_cleaned_total_acreage(self, obj):
        set_acreage = str(obj.total_acreage).rstrip('0').rstrip('.')
        return set_acreage
    
    class Meta:
        model = Plat 
        fields = (
            'id',
            'is_approved',
            'is_active',
            'subdivision',
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
            'lot',
            'plat_zone',
        )