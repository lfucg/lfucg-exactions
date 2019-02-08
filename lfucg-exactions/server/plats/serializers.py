from rest_framework import serializers

from .models import *
from .utils import calculate_lot_balance, calculate_plat_balance, remaining_plat_lots, calculate_lot_totals

from notes.models import Note
from notes.serializers import NoteSerializer

class SubdivisionSerializer(serializers.ModelSerializer):
    cleaned_gross_acreage = serializers.SerializerMethodField(read_only=True)

    def get_cleaned_gross_acreage(self, obj):
        set_acreage = str(obj.gross_acreage).rstrip('0').rstrip('.')
        return set_acreage

    # EXAMPLE FOR FIELD VALIDATION
    # def validate_name(self, data):
    #     if 'new' in data:
    #         raise serializers.ValidationError('This field has the word new in it.')
    #     return data

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
        )

class SubdivisionQuickSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subdivision
        fields = (
            'id',
            'name',
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
    dollar_values = serializers.SerializerMethodField(read_only=True)

    def get_cleaned_acres(self, obj):
        set_acreage = str(obj.acres).rstrip('0').rstrip('.')
        return set_acreage

    def get_dollar_values(self, obj):
        return {
            'dollar_roads': '${:,.2f}'.format(obj.dues_roads),
            'dollar_open_spaces': '${:,.2f}'.format(obj.dues_open_spaces),
            'dollar_sewer_cap': '${:,.2f}'.format(obj.dues_sewer_cap),
            'dollar_sewer_trans': '${:,.2f}'.format(obj.dues_sewer_trans),
            'dollar_parks': '${:,.2f}'.format(obj.dues_parks),
            'dollar_storm_water': '${:,.2f}'.format(obj.dues_storm_water),
        }

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
            'dollar_values',
        )

class SubdivisionField(serializers.Field):
    def to_internal_value(self, data):
        try:
            return Subdivision.objects.get(id=data)
        except:
            None

    def to_representation(self, obj):
        return SubdivisionSerializer(obj).data

class PlatQuickSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plat
        fields = (
            'id',
            'name',
            'cabinet',
            'slide',
            'current_sewer_due',
            'current_non_sewer_due',
        )

class PlatSerializer(serializers.ModelSerializer):
    plat_zone = serializers.SerializerMethodField(read_only=True)
    cleaned_total_acreage = serializers.SerializerMethodField(read_only=True)
    subdivision = SubdivisionField(required=False, allow_null=True)
    plat_type_display = serializers.SerializerMethodField(read_only=True)
    remaining_lots = serializers.SerializerMethodField(read_only=True)

    def get_cleaned_total_acreage(self, obj):
        set_acreage = str(obj.total_acreage).rstrip('0').rstrip('.')
        return set_acreage

    def get_plat_type_display(self, obj):
        return obj.get_plat_type_display()

    def get_remaining_lots(self, obj):
        return remaining_plat_lots(obj)

    def get_plat_zone(self, obj):
        plat_zone_set = obj.plat_zone
        return PlatZoneSerializer(instance=plat_zone_set, many=True).data

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

            'current_sewer_due',
            'current_non_sewer_due',
            'remaining_lots',
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
    
    def get_lot_exactions(self, obj):
        return calculate_lot_totals(obj)

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

            'alternative_address_number',
            'alternative_address_street',

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
            
            'current_dues_roads_dev',
            'current_dues_roads_own',
            'current_dues_sewer_trans_dev',
            'current_dues_sewer_trans_own',
            'current_dues_sewer_cap_dev',
            'current_dues_sewer_cap_own',
            'current_dues_parks_dev',
            'current_dues_parks_own',
            'current_dues_storm_dev',
            'current_dues_storm_own',
            'current_dues_open_space_dev',
            'current_dues_open_space_own',

            'certificate_of_occupancy_final',

            'lot_exactions',
        )

class LotQuickSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lot
        fields = (
            'id',
            'address_full',
        )

class LotExactionsSerializer(serializers.ModelSerializer):
    lot_exactions = serializers.SerializerMethodField(read_only=True)
    
    def get_lot_exactions(self, obj):
        return calculate_lot_totals(obj)

    class Meta:
        model = Lot
        fields = (
            'id',
            'address_full',
            'lot_exactions',
        )
