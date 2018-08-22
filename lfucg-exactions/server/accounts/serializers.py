from rest_framework import serializers

from django.contrib.auth.models import User, Group
from rest_framework.authtoken.models import Token

from .models import *
from .utils import calculate_account_balance, calculate_agreement_balance
from plats.models import Plat, Lot
from plats.serializers import PlatSerializer, LotSerializer

class LotField(serializers.Field):
    def to_internal_value(self, data):
        try: 
            return Lot.objects.get(id=data)
        except: 
            return None

    def to_representation(self, obj):
        return LotSerializer(obj).data

class AccountQuickSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = (
            'id',
            'account_name',
        )

class AccountSerializer(serializers.ModelSerializer):
    plat_account = PlatSerializer(many=True, required=False, allow_null=True)
    lot_account = LotSerializer(many=True, required=False, allow_null=True)

    address_state_display = serializers.SerializerMethodField(read_only=True)

    balance = serializers.SerializerMethodField(read_only=True)

    def get_address_state_display(self, obj):
        return obj.get_address_state_display()

    def get_balance(self, obj):
        calculated_balance = calculate_account_balance(obj.id)

        if calculated_balance['current_account_balance'] > 0:
            return {
                'balance': '${:,.2f}'.format(calculated_balance['current_account_balance']),
                'sewer_balance': '${:,.2f}'.format(calculated_balance['current_sewer_balance']),
                'non_sewer_balance': '${:,.2f}'.format(calculated_balance['current_non_sewer_balance']),
                'credit_availability': 'Credit Available'
            }
        else:
            return {
                'balance': '${:,.2f}'.format(calculated_balance['current_account_balance']),
                'sewer_balance': '${:,.2f}'.format(calculated_balance['current_sewer_balance']),
                'non_sewer_balance': '${:,.2f}'.format(calculated_balance['current_non_sewer_balance']),
                'credit_availability': 'No Credit Available'
            }

    class Meta:
        model = Account
        fields = (
            'id',
            'is_active',
            'date_created',
            'date_modified',
            'created_by',
            'modified_by',

            'plat_account',
            'lot_account',

            'account_name',
            'contact_first_name',
            'contact_last_name',
            'contact_full_name',

            'address_number',
            'address_street',
            'address_city',
            'address_state',
            'address_zip',
            'address_full',

            'phone',
            'email',

            'address_state_display',

            'balance',
        )

class AccountField(serializers.Field):
    def to_internal_value(self, data):
        try: 
            return Account.objects.get(id=data)
        except: 
            return None

    def to_representation(self, obj):
        return AccountSerializer(obj).data

class AgreementSerializer(serializers.ModelSerializer):
    account_id = AccountField()

    agreement_type_display = serializers.SerializerMethodField(read_only=True)
    agreement_balance = serializers.SerializerMethodField(read_only=True)

    def get_agreement_type_display(self, obj):
        return obj.get_agreement_type_display()

    def get_agreement_balance(self, obj):
        return {
            'total': '${:,.2f}'.format(calculate_agreement_balance(obj.id)),
        }

    class Meta:
        model = Agreement
        fields = (
            'id',
            'is_approved',
            'is_active',
            'date_executed',
            'date_created',
            'date_modified',
            'created_by',
            'modified_by',

            'account_id',

            'resolution_number',
            'expansion_area',
            'agreement_type',

            'agreement_type_display',
            'agreement_balance',
        )

class AgreementField(serializers.Field):
    def to_internal_value(self, data):
        try: 
            return Agreement.objects.get(id=data)
        except: 
            return None

    def to_representation(self, obj):
        return AgreementSerializer(obj).data

class ProjectSerializer(serializers.ModelSerializer):
    agreement_id = AgreementField()

    project_category_display = serializers.SerializerMethodField(read_only=True)
    project_type_display = serializers.SerializerMethodField(read_only=True)
    project_status_display = serializers.SerializerMethodField(read_only=True)

    def get_project_category_display(self, obj):
        return obj.get_project_category_display()

    def get_project_type_display(self, obj):
        return obj.get_project_type_display()

    def get_project_status_display(self, obj):
        return obj.get_project_status_display()

    class Meta:
        model = Project
        fields = (
            'id',
            'is_approved',
            'is_active',
            'date_created',
            'date_modified',
            'created_by',
            'modified_by',

            'agreement_id',

            'name',
            'expansion_area',

            'project_category',
            'project_type',
            'project_status',
            'status_date',
            'project_description',

            'project_category_display',
            'project_type_display',
            'project_status_display',

            'project_description',
        )

class ProjectField(serializers.Field):
    def to_internal_value(self, data):
        try: 
            return Project.objects.get(id=data)
        except: 
            return None

    def to_representation(self, obj):
        return ProjectSerializer(obj).data

class ProjectCostEstimateSerializer(serializers.ModelSerializer):
    project_id = ProjectField()

    total_costs = serializers.SerializerMethodField(read_only=True)
    dollar_values = serializers.SerializerMethodField(read_only=True)

    def get_total_costs(self,obj):
        total = (
            obj.land_cost +
            obj.design_cost +
            obj.construction_cost +
            obj.admin_cost +
            obj.management_cost
        )
        return '${:,.2f}'.format(total)

    def get_dollar_values(self, obj):
        return {
            'land_cost': '${:,.2f}'.format(obj.land_cost),
            'design_cost': '${:,.2f}'.format(obj.design_cost),
            'construction_cost': '${:,.2f}'.format(obj.construction_cost),
            'admin_cost': '${:,.2f}'.format(obj.admin_cost),
            'management_cost': '${:,.2f}'.format(obj.management_cost),
            'other_cost': '${:,.2f}'.format(obj.other_cost),
            'credits_available': '${:,.2f}'.format(obj.credits_available),
        }

    class Meta:
        model = ProjectCostEstimate
        fields = (
            'id',
            'is_approved',
            'is_active',
            'date_created',
            'date_modified',
            'created_by',
            'modified_by',

            'project_id',

            'estimate_type',
            'land_cost',
            'design_cost',
            'construction_cost',
            'admin_cost',
            'management_cost',
            'other_cost',
            'credits_available',

            'total_costs',
            'dollar_values',
        )

class AccountLedgerSerializer(serializers.ModelSerializer):
    lot = LotField(required=False, allow_null=True)
    agreement = AgreementField()
    account_from = AccountField()
    account_to = AccountField()

    entry_type_display = serializers.SerializerMethodField(read_only=True)
    dollar_values = serializers.SerializerMethodField(read_only=True)

    def get_entry_type_display(self, obj):
        return obj.get_entry_type_display()

    def get_dollar_values(self, obj):
        return {
            'dollar_non_sewer': '${:,.2f}'.format(obj.non_sewer_credits),
            'dollar_sewer': '${:,.2f}'.format(obj.sewer_credits),
        }

    class Meta:
        model = AccountLedger
        fields = (
            'id',
            'is_approved',
            'is_active',
            'entry_date',
            'date_created',
            'date_modified',
            'created_by',
            'modified_by',
            
            'account_from',
            'account_to',
            'lot',
            'agreement',

            'entry_type',
            'non_sewer_credits',
            'sewer_credits',

            'sewer_trans',
            'sewer_cap',
            'roads',
            'parks',
            'storm',
            'open_space',

            'entry_type_display',
            'dollar_values',
        )

class PaymentSerializer(serializers.ModelSerializer):
    lot_id = LotField()
    credit_account = AccountField()
    credit_source = AgreementField()

    total_paid = serializers.SerializerMethodField(read_only=True)
    payment_type_display = serializers.SerializerMethodField(read_only=True)
    paid_by_type_display = serializers.SerializerMethodField(read_only=True)

    dollar_values = serializers.SerializerMethodField(read_only=True)

    def get_total_paid(self,obj):
        total = (
            obj.paid_roads +
            obj.paid_sewer_trans +
            obj.paid_sewer_cap +
            obj.paid_parks +
            obj.paid_storm +
            obj.paid_open_space
        )
        return '${:,.2f}'.format(total)

    def get_payment_type_display(self, obj):
        return obj.get_payment_type_display()

    def get_paid_by_type_display(self, obj):
        return obj.get_paid_by_type_display()

    def get_dollar_values(self, obj):
        return {
            'paid_roads': '${:,.2f}'.format(obj.paid_roads),
            'paid_sewer_trans': '${:,.2f}'.format(obj.paid_sewer_trans),
            'paid_sewer_cap': '${:,.2f}'.format(obj.paid_sewer_cap),
            'paid_parks': '${:,.2f}'.format(obj.paid_parks),
            'paid_storm': '${:,.2f}'.format(obj.paid_storm),
            'paid_open_space': '${:,.2f}'.format(obj.paid_open_space),
        }

    class Meta:
        model = Payment
        fields = (
            'id',
            'is_approved',
            'is_active',
            'date_created',
            'date_modified',
            'created_by',
            'modified_by',

            'lot_id',
            'credit_source',
            'credit_account',

            'paid_by',
            'paid_by_type',
            'payment_type',
            'check_number',

            'paid_roads',
            'paid_sewer_trans',
            'paid_sewer_cap',
            'paid_parks',
            'paid_storm',
            'paid_open_space',

            'total_paid',
            'payment_type_display',
            'paid_by_type_display',
            'dollar_values',
        )

class ProfileSerializer(serializers.ModelSerializer):
     class Meta:
        model = Profile
        fields = (
            'id',
            'is_supervisor',
        )       

class ProfileField(serializers.Field):
    def to_representation(self, obj):
        return ProfileSerializer(obj).data

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('name',)

class UserSerializer(serializers.ModelSerializer):
    token = serializers.SerializerMethodField(read_only=True)
    permissions = serializers.SerializerMethodField(read_only=True)
    profile = ProfileField(read_only=True)
    groups = GroupSerializer(many=True)

    def get_token(self, obj):
        token_value = Token.objects.filter(user=obj)[0].key
        return token_value

    def get_permissions(self, obj):
        permission_set = {}
        for permission in obj.get_all_permissions():
            permission_name = permission[permission.index('_') + 1: len(permission)]

            permission_set[permission_name] = True

        return permission_set

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'is_superuser',
            'token',
            'permissions',
            'profile',
            'groups',
        )
