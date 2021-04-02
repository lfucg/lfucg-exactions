import csv
import math
from django.views.generic import View
from django.http import HttpResponse
from django.db.models import Count, Max, Q, Prefetch
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView
import datetime
from decimal import Decimal
import pandas as pd
import numpy as np
from io import BytesIO

from django.contrib.auth.models import User
from .models import Account, AccountLedger, Agreement, Payment, Project, ProjectCostEstimate
from .serializers import UserSerializer, AccountSerializer, AccountLedgerSerializer, AgreementSerializer, PaymentSerializer, ProjectSerializer, ProjectCostEstimateSerializer
from plats.models import Lot, Plat, PlatZone, Subdivision
from plats.serializers import LotSerializer, PlatSerializer, PlatZoneSerializer

class CurrentUserDetails(RetrieveAPIView):
    model = User
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class AccountCSVExportView(View):
    def get_serializer_class(self, serializer_class):
        return serializer_class

    def list(self, queryset, serializer_class, many):
        serializer_class = self.get_serializer_class(serializer_class)
        serializer = serializer_class(queryset, many=many)
        return serializer

    def get(self, request, *args, **kwargs):
        headers = [
            'Account Name',
            'Contact Name',
            'Address',
            'Email',
            'Phone',
            'Balance',
        ]

        all_rows = []

        account_value = request.GET.get('account', None)

        if account_value is not None:
            account_queryset = Account.objects.filter(id=account_value).exclude(is_active=False)
            account_serializer = self.list(
                account_queryset,
                AccountSerializer,
                many=True
            )
            filename = account_queryset[0].account_name + '_account_report.csv'

        else:
            account_queryset = Account.objects.all()

            plat_set = self.request.GET.get('plat_account__id', None)
            if plat_set is not None:
                account_queryset = account_queryset.filter(plat_account=plat_set)

            lot_set = self.request.GET.get('lot_account__id', None)
            if lot_set is not None:
                account_queryset = account_queryset.filter(lot_account=lot_set)

            search_set = self.request.GET.get('search', None)
            if search_set is not None:
                account_queryset = account_queryset.filter(
                        Q(account_name__icontains=search_set) |
                        Q(contact_full_name__icontains=search_set) |
                        Q(address_full__icontains=search_set) |
                        Q(phone__icontains=search_set) |
                        Q(email__icontains=search_set)
                    )

            account_serializer = self.list(
                account_queryset,
                AccountSerializer,
                many=True
            )

            filename = 'account_report_' + datetime.datetime.now().strftime("%Y-%m-%d") + '.csv'

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename='+filename

        for account in account_serializer.data:

            row = {
                'Account Name': account['account_name'],
                'Contact Name': account['contact_full_name'],
                'Address': account['address_full'],
                'Email': account['email'],
                'Phone': account['phone'],
                'Balance': account['current_account_balance'],
            }

            plat_queryset = Plat.objects.filter(account=account['id'])
            if plat_queryset is not None:
                plat_serializer = self.list (
                    plat_queryset,
                    PlatSerializer,
                    many=True
                )

                for i, plat in zip(range(plat_queryset.count()), plat_serializer.data):
                    headers.extend(['Subdivision -%s' %(i+1)])
                    headers.extend(['Cabinet -%s' %(i+1)])
                    headers.extend(['Slide -%s' %(i+1)])
                    headers.extend(['Acreage -%s' %(i+1)])
                    headers.extend(['Buildable Lots -%s' %(i+1)])
                    headers.extend(['Non-Buildable Lots -%s' %(i+1)])
                    headers.extend(['Plat Type -%s' %(i+1)])
                    headers.extend(['Section -%s' %(i+1)])
                    headers.extend(['Block -%s' %(i+1)])
                    headers.extend(['Unit -%s' %(i+1)])

                    subdivision = ''

                    if plat['subdivision']:
                        subdivision = plat['subdivision']['name']

                    row['Subdivision -%s' %(i+1)] = subdivision
                    row['Cabinet -%s' %(i+1)] = plat['cabinet']
                    row['Slide -%s' %(i+1)] = plat['slide']
                    row['Acreage -%s' %(i+1)] = plat['total_acreage']
                    row['Buildable Lots -%s' %(i+1)] = plat['buildable_lots']
                    row['Non-Buildable Lots -%s' %(i+1)] = plat['non_buildable_lots']
                    row['Plat Type -%s' %(i+1)] = plat['plat_type_display']
                    row['Section -%s' %(i+1)] = plat['section']
                    row['Block -%s' %(i+1)] = plat['block']
                    row['Unit -%s' %(i+1)] = plat['unit']

                    plat_zone_queryset = PlatZone.objects.filter(plat=plat['id'])
                    if plat_zone_queryset is not None:
                        plat_zone_serializer = self.list (
                            plat_zone_queryset,
                            PlatZoneSerializer,
                            many=True
                        )

                        for j, plat_zone in zip(range(plat_zone_queryset.count()), plat_zone_serializer.data):
                            headers.extend(['Zone -%s-%s' %((i+1), (j+1))])
                            headers.extend(['Acres -%s-%s' %((i+1), (j+1))])

                            row['Zone -%s-%s' %((i+1), (j+1))] = plat_zone['zone']
                            row['Acres -%s-%s' %((i+1), (j+1))] = plat_zone['acres']
 
            lot_queryset = Lot.objects.filter(account=account['id'])
            if lot_queryset is not None:
                lot_serializer = self.list (
                    lot_queryset,
                    LotSerializer,
                    many=True
                )

                for i, lot in zip(range(lot_queryset.count()), lot_serializer.data):
                    total_exactions = ''
                    current_exactions = ''

                    if lot['lot_exactions']:
                        total_exactions = lot['lot_exactions']['total_exactions']
                    #     current_exactions = lot['lot_exactions']['current_exactions']

                    headers.extend(['Address -%s' %(i+1)])
                    headers.extend(['Permit ID -%s' %(i+1)])
                    headers.extend(['Lot Number -%s' %(i+1)])
                    headers.extend(['Parcel ID -%s' %(i+1)])
                    headers.extend(['Total Exactions -%s' %(i+1)])
                    headers.extend(['Current Exactions -%s' %(i+1)])

                    row['Address -%s' %(i+1)] = lot['address_full']
                    row['Permit ID -%s' %(i+1)] = lot['permit_id']
                    row['Lot Number -%s' %(i+1)] = lot['lot_number']
                    row['Parcel ID -%s' %(i+1)] = lot['parcel_id']
                    row['Total Exactions -%s' %(i+1)] = total_exactions
                    row['Current Exactions -%s' %(i+1)] = current_exactions

            payment_queryset = Payment.objects.filter(credit_account=account['id'])
            if payment_queryset is not None:
                payment_serializer = self.list (
                    payment_queryset,
                    PaymentSerializer,
                    many=True
                )

                for i, payment in zip(range(payment_queryset.count()), payment_serializer.data):
                    headers.extend(['Payment Type -%s' %(i+1)])
                    headers.extend(['Roads Paid -%s' %(i+1)])
                    headers.extend(['Parks Paid -%s' %(i+1)])
                    headers.extend(['Storm Paid -%s' %(i+1)])
                    headers.extend(['Open Space Paid -%s' %(i+1)])
                    headers.extend(['Sewer Trans. Paid -%s' %(i+1)])
                    headers.extend(['Sewer Cap. Paid -%s' %(i+1)])

                    row['Payment Type -%s' %(i+1)] = payment['payment_type_display']
                    row['Roads Paid -%s' %(i+1)] = payment['paid_roads']
                    row['Parks Paid -%s' %(i+1)] = payment['paid_parks']
                    row['Storm Paid -%s' %(i+1)] = payment['paid_storm']
                    row['Open Space Paid -%s' %(i+1)] = payment['paid_open_space']
                    row['Sewer Trans. Paid -%s' %(i+1)] = payment['paid_sewer_trans']
                    row['Sewer Cap. Paid -%s' %(i+1)] = payment['paid_sewer_cap']

            ledger_queryset = AccountLedger.objects.filter(account_from=account['id'], account_to=account['id'])
            if ledger_queryset is not None:
                ledger_serializer = self.list (
                    ledger_queryset,
                    AccountLedgerSerializer,
                    many=True
                )
                
                for i, ledger in zip(range(ledger_queryset.count()), ledger_serializer.data):
                    headers.extend(['Ledger Type -%s' %(i+1)])
                    headers.extend(['Roads Credits -%s' %(i+1)])
                    headers.extend(['Parks Credits -%s' %(i+1)])
                    headers.extend(['Storm Credits -%s' %(i+1)])
                    headers.extend(['Open Space Credits -%s' %(i+1)])
                    headers.extend(['Non-Sewer Credits -%s' %(i+1)])
                    headers.extend(['Sewer Trans. Credits -%s' %(i+1)])
                    headers.extend(['Sewer Cap. Credits -%s' %(i+1)])
                    headers.extend(['Sewer Credits -%s' %(i+1)])

                    row['Ledger Type -%s' %(i+1)] = ledger['entry_type_display']
                    row['Roads Credits -%s' %(i+1)] = ledger['roads']
                    row['Parks Credits -%s' %(i+1)] = ledger['parks']
                    row['Storm Credits -%s' %(i+1)] = ledger['storm']
                    row['Open Space Credits -%s' %(i+1)] = ledger['open_space']
                    row['Non-Sewer Credits -%s' %(i+1)] = ledger['non_sewer_credits']
                    row['Sewer Trans. Credits -%s' %(i+1)] = ledger['sewer_trans']
                    row['Sewer Cap. Credits -%s' %(i+1)] = ledger['sewer_cap']
                    row['Sewer Credits -%s' %(i+1)] = ledger['sewer_credits']

            all_rows.append(row)

        unique_fieldnames = []
        for name in headers:
            if name not in unique_fieldnames:
                unique_fieldnames.append(name)

        writer = csv.DictWriter(response, fieldnames=unique_fieldnames, extrasaction='ignore')
        writer.writeheader()

        for row in all_rows:
            writer.writerow(row)

        return response

class AgreementCSVExportView(View):
    def get_serializer_class(self, serializer_class):
        return serializer_class

    def list(self, queryset, serializer_class, many):
        serializer_class = self.get_serializer_class(serializer_class)
        serializer = serializer_class(queryset, many=many)
        return serializer

    def get(self, request, *args, **kwargs):
        headers = [
            'Agreement',
            'Agreement Type',
            'Date Executed',
            'Expansion Area',
            'Account',
            'Type',
            'Roads',
            'Parks',
            'Stormwater', 
            'Open Space',
            'Non-Sewer',
            'Sewer Trans.',
            'Sewer Cap.',
            'Sewer',
            'Project Category',
            'Project Type',
            'Project Status',
            'Estimate Type',
            'Land Cost',
            'Design Cost',
            'Constr. Cost',
            'Admin Cost',
            'Mgmt. Cost',
            'Other Cost',
        ]

        all_rows = []

        agreement_value = request.GET.get('agreement', None)

        if agreement_value is not None:
            agreement_queryset = Agreement.objects.filter(id=agreement_value).exclude(is_active=False)
            agreement_serializer = self.list(
                agreement_queryset,
                AgreementSerializer,
                many=True
            )

            filename = agreement_queryset.first().resolution_number + '_agreement_report.csv'
        else:
            agreement_queryset = Agreement.objects.all().exclude(is_active=False)

            is_approved_set = self.request.GET.get('is_approved', None)
            if is_approved_set is not None:
                is_approved_set = True if is_approved_set == 'true' else False
                agreement_queryset = agreement_queryset.filter(is_approved=is_approved_set)

            account_set = self.request.GET.get('account_id', None)
            if account_set is not None:
                agreement_queryset = agreement_queryset.filter(account_id=account_set)

            expansion_area_set = self.request.GET.get('expansion_area', None)
            if expansion_area_set is not None:
                agreement_queryset = agreement_queryset.filter(expansion_area=expansion_area_set)

            agreement_type_set = self.request.GET.get('agreement_type', None)
            if agreement_type_set is not None:
                agreement_queryset = agreement_queryset.filter(agreement_type=agreement_type_set)

            search_set = self.request.GET.get('search', None)
            if search_set is not None:
                agreement_queryset = agreement_queryset.filter(
                        Q(resolution_number__icontains=search_set) |
                        Q(account_id__account_name__icontains=search_set) |
                        Q(agreement_type__icontains=search_set) |
                        Q(expansion_area__icontains=search_set)
                    )

            agreement_serializer = self.list(
                agreement_queryset,
                AgreementSerializer,
                many=True
            )
            filename = 'agreement_report_' + datetime.datetime.now().strftime("%Y-%m-%d") + '.csv'

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename='+filename

        for agreement in agreement_serializer.data:
            account_name = ''

            if agreement['account_id']:
                account_name = agreement['account_id']['account_name']

            row = {
                'Agreement': agreement['resolution_number'],
                'Agreement Type': agreement['agreement_type_display'],
                'Date Executed': agreement['date_executed'],
                'Expansion Area': agreement['expansion_area'],
                'Account': account_name,
            }

            all_rows.append(row)

            project_queryset = Project.objects.filter(agreement_id=agreement['id'])
            if project_queryset is not None:
                project_serializer = self.list (
                    project_queryset,
                    ProjectSerializer,
                    many=True
                )

                for i, project in zip(range(project_queryset.count()), project_serializer.data):
                    row = {
                        'Project Category': project['project_category_display'],
                        'Project Type': project['project_type_display'],
                        'Project Status': project['project_status_display'],
                    }

                    all_rows.append(row)


            project_estimate_queryset = ProjectCostEstimate.objects.filter(project_id__agreement_id=agreement['id'])
            if project_estimate_queryset is not None:
                project_estimate_serializer = self.list (
                    project_estimate_queryset,
                    ProjectCostEstimateSerializer,
                    many=True
                )

                for i, project_estimate in zip(range(project_estimate_queryset.count()), project_estimate_serializer.data):
                    row = {
                        'Estimate Type': project_estimate['estimate_type'],
                        'Land Cost': project_estimate['land_cost'],
                        'Design Cost': project_estimate['design_cost'],
                        'Constr. Cost': project_estimate['construction_cost'],
                        'Admin Cost': project_estimate['admin_cost'],
                        'Mgmt. Cost': project_estimate['management_cost'],
                        'Other Cost': project_estimate['other_cost'],
                    }

            payment_queryset = Payment.objects.filter(credit_source=agreement['id']).exclude(is_active=False)
            if payment_queryset is not None:
                payment_serializer = self.list (
                    payment_queryset,
                    PaymentSerializer,
                    many=True
                )

                for i, payment in zip(range(payment_queryset.count()), payment_serializer.data):
                    row = {
                        'Type': payment['payment_type_display'],
                        'Roads': payment['paid_roads'],
                        'Parks': payment['paid_parks'],
                        'Stormwater': payment['paid_storm'],
                        'Open Space': payment['paid_open_space'],
                        'Non-Sewer': Decimal(payment['paid_roads']) + Decimal(payment['paid_parks']) + Decimal(payment['paid_storm']) + Decimal(payment['paid_open_space']),
                        'Sewer Trans.': payment['paid_sewer_trans'],
                        'Sewer Cap.': payment['paid_sewer_cap'],
                        'Sewer': Decimal(payment['paid_sewer_trans']) + Decimal(payment['paid_sewer_cap'],)
                    }

                    all_rows.append(row)

            ledger_queryset = AccountLedger.objects.filter(agreement=agreement['id']).exclude(is_active=False)
            if ledger_queryset is not None:
                ledger_serializer = self.list (
                    ledger_queryset,
                    AccountLedgerSerializer,
                    many=True
                )
                
                for i, ledger in zip(range(ledger_queryset.count()), ledger_serializer.data):
                    row = {
                        'Type': ledger['entry_type_display'],
                        'Roads': ledger['roads'],
                        'Parks': ledger['parks'],
                        'Stormwater': ledger['storm'],
                        'Open Space': ledger['open_space'],
                        'Non-Sewer': ledger['non_sewer_credits'],
                        'Sewer Trans.': ledger['sewer_trans'],
                        'Sewer Cap.': ledger['sewer_cap'],
                        'Sewer': ledger['sewer_credits'],
                    }

                    all_rows.append(row)

        unique_fieldnames = []
        for name in headers:
            if name not in unique_fieldnames:
                unique_fieldnames.append(name)

        writer = csv.DictWriter(response, fieldnames=unique_fieldnames, extrasaction='ignore')
        writer.writeheader()

        for row in all_rows:
            writer.writerow(row)

        return response

class PaymentCSVExportView(View):
    def get_serializer_class(self, serializer_class):
        return serializer_class

    def list(self, queryset, serializer_class, many):
        serializer_class = self.get_serializer_class(serializer_class)
        serializer = serializer_class(queryset, many=many)
        return serializer

    def get(self, request, *args, **kwargs):
        headers = [
            'Lot',
            'Expansion Area',
            'Payment Type',
            'Payer Type',
            'Payer',
            'Check Number',
            'Date',
            'Roads Paid',
            'Parks Paid',
            'Stormwater',
            'Open Space',
            'Sewer Trans.',
            'Sewer Cap.',
            'Total Paid',
            'Developer Account',
            'Agreement',
        ]

        all_rows = []

        payment_value = request.GET.get('payment', None)
        payment_queryset = Payment.objects.all().prefetch_related(
            'credit_source',
            'credit_account',
            Prefetch(
                'lot_id',
                queryset=Lot.objects.all().prefetch_related(
                    'plat',
                )
            )
        )

        show_inactive = request.GET.get('showDeleted', False)
        if show_inactive:
            print('Show deleted entries')
        else:
            payment_queryset = payment_queryset.exclude(is_active=False)

        if payment_value is not None:
            payment_queryset = payment_queryset.filter(id=payment_value)
            payment_serializer = self.list(
                payment_queryset,
                PaymentSerializer,
                many=True
            )
            filename = payment_queryset[0].payment_type + '-' + payment_queryset[0].paid_by + '_payment_report.csv'
        else:
            lot_set = self.request.GET.get('lot_id', None)
            if lot_set is not None:
                payment_queryset = payment_queryset.filter(lot_id=lot_set)

            is_approved_set = self.request.GET.get('is_approved', None)
            if is_approved_set is not None:
                is_approved_set = True if is_approved_set == 'true' else False
                payment_queryset = payment_queryset.filter(is_approved=is_approved_set)

            account_set = self.request.GET.get('credit_account', None)
            if account_set is not None:
                payment_queryset = payment_queryset.filter(credit_account=account_set)

            agreement_set = self.request.GET.get('credit_source', None)
            if agreement_set is not None:
                payment_queryset = payment_queryset.filter(credit_source=agreement_set)

            paid_by_type_set = self.request.GET.get('paid_by_type', None)
            if paid_by_type_set is not None:
                payment_queryset = payment_queryset.filter(paid_by_type=paid_by_type_set)

            payment_type_set = self.request.GET.get('payment_type', None)
            if payment_type_set is not None:
                payment_queryset = payment_queryset.filter(payment_type=payment_type_set)

            search_set = self.request.GET.get('search', None)
            if search_set is not None:
                payment_queryset = payment_queryset.filter(
                        Q(lot_id__address_full__icontains=search_set) |
                        Q(payment_type__icontains=search_set) |
                        Q(check_number__icontains=search_set) |
                        Q(credit_account__account_name__icontains=search_set) |
                        Q(paid_by__icontains=search_set) |
                        Q(credit_source__resolution_number__icontains=search_set)
                    )

            payment_serializer = self.list(
                payment_queryset,
                PaymentSerializer,
                many=True
            )
            filename = 'payment_report_' + datetime.datetime.now().strftime("%Y-%m-%d") + '.csv'

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=%s'%filename
        
        for payment in payment_serializer.data:
            lot_address = ''
            account_name = ''
            agreement_number = ''
            expansion_area = ''

            if payment['lot_id']:
                lot_address = payment['lot_id']['address_full']

                if 'plat' in payment['lot_id']:
                    expansion_area = payment['lot_id']['plat']['expansion_area']

            if payment['credit_account']:
                account_name = payment['credit_account']['account_name']

            if payment['credit_source']:
                agreement_number = payment['credit_source']['resolution_number']

            row = {
                'Lot': lot_address,
                'Expansion Area': expansion_area,
                'Payment Type': payment['payment_type_display'],
                'Payer Type': payment['paid_by_type_display'],
                'Payer': payment['paid_by'],
                'Check Number': payment['check_number'],
                'Date': payment['entry_date'],
                'Roads Paid': payment['paid_roads'],
                'Parks Paid': payment['paid_parks'],
                'Stormwater': payment['paid_storm'],
                'Open Space': payment['paid_open_space'],
                'Sewer Trans.': payment['paid_sewer_trans'],
                'Sewer Cap.': payment['paid_sewer_cap'],
                'Total Paid': payment['total_paid'],
                'Developer Account': account_name,
                'Agreement': agreement_number,
            }

            all_rows.append(row)

        unique_fieldnames = []
        for name in headers:
            if name not in unique_fieldnames:
                unique_fieldnames.append(name)

        writer = csv.DictWriter(response, fieldnames=unique_fieldnames, extrasaction='ignore')
        writer.writeheader()

        for row in all_rows:
            writer.writerow(row)

        return response

class ProjectCSVExportView(View):
    def get_serializer_class(self, serializer_class):
        return serializer_class

    def list(self, queryset, serializer_class, many):
        serializer_class = self.get_serializer_class(serializer_class)
        serializer = serializer_class(queryset, many=many)
        return serializer

    def get(self, request, *args, **kwargs):
        headers = [
            'Project Name',
            'Category',
            'Project Type',
            'Status',
            'Status Date',
            'Expansion Area',
            'Agreement Number',
        ]

        all_rows = []

        project_value = request.GET.get('project', None)

        if project_value is not None:
            project_queryset = Project.objects.filter(id=project_value).exclude(is_active=False)
            project_serializer = self.list(
                project_queryset,
                ProjectSerializer,
                many=True
            )
            filename = project_queryset[0].name + '_project_report.csv'
        else:
            project_queryset = Project.objects.all().exclude(is_active=False)

            agreement_set = self.request.GET.get('agreement_id', None)
            if agreement_set is not None:
                project_queryset = project_queryset.filter(agreement_id=agreement_set)

            is_approved_set = self.request.GET.get('is_approved', None)
            if is_approved_set is not None:
                is_approved_set = True if is_approved_set == 'true' else False
                project_queryset = project_queryset.filter(is_approved=is_approved_set)

            status_set = self.request.GET.get('project_status', None)
            if status_set is not None:
                project_queryset = project_queryset.filter(project_status=status_set)

            category_set = self.request.GET.get('project_category', None)
            if category_set is not None:
                project_queryset = project_queryset.filter(project_category=category_set)

            expansion_area_set = self.request.GET.get('expansion_area', None)
            if expansion_area_set is not None:
                project_queryset = project_queryset.filter(expansion_area=expansion_area_set)

            project_type_set = self.request.GET.get('project_type', None)
            if project_type_set is not None:
                project_queryset = project_queryset.filter(project_type=project_type_set)

            search_set = self.request.GET.get('search', None)
            if search_set is not None:
                project_queryset = project_queryset.filter(
                        Q(name__icontains=search_set) |
                        Q(agreement_id__resolution_number__icontains=search_set) |
                        Q(project_category__icontains=search_set) |
                        Q(project_description__icontains=search_set)
                    )

            project_serializer = self.list(
                project_queryset,
                ProjectSerializer,
                many=True
            )
            filename = 'project_report_' + datetime.datetime.now().strftime("%Y-%m-%d") + '.csv'

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=%s'%filename
        
        for project in project_serializer.data:
            agreement = ''

            if project['agreement_id']:
                agreement = project['agreement_id']['resolution_number']

            row = {
                'Project Name': project['name'],
                'Category': project['project_category_display'],
                'Project Type': project['project_type_display'],
                'Status': project['project_status_display'],
                'Status Date': project['status_date'],
                'Expansion Area': project['expansion_area'],
                'Agreement Number': agreement,
            }

            # PLAT ZONE
            project_estimate_queryset = ProjectCostEstimate.objects.filter(project_id=project['id']).exclude(is_active=False)
            if project_estimate_queryset is not None:
                project_estimate_serializer = self.list (
                    project_estimate_queryset,
                    ProjectCostEstimateSerializer,
                    many=True
                )

                for i, project_estimate in zip(range(project_estimate_queryset.count()), project_estimate_serializer.data):
                    headers.extend(['Estimate Type -%s' %((i+1))])
                    headers.extend(['Land Cost -%s' %(i+1)])
                    headers.extend(['Design -%s' %(i+1)])
                    headers.extend(['Construction -%s' %(i+1)])
                    headers.extend(['Admin -%s' %(i+1)])
                    headers.extend(['Management -%s' %(i+1)])
                    headers.extend(['Other -%s' %(i+1)])

                    row['Estimate Type -%s' %((i+1))] = project_estimate['estimate_type']
                    row['Land Cost -%s' %(i+1)] = project_estimate['land_cost']
                    row['Design -%s' %(i+1)] = project_estimate['design_cost']
                    row['Construction -%s' %(i+1)] = project_estimate['construction_cost']
                    row['Admin -%s' %(i+1)] = project_estimate['admin_cost']
                    row['Management -%s' %(i+1)] = project_estimate['management_cost']
                    row['Other -%s' %(i+1)] = project_estimate['other_cost']
                            
            all_rows.append(row)

        unique_fieldnames = []
        for name in headers:
            if name not in unique_fieldnames:
                unique_fieldnames.append(name)

        writer = csv.DictWriter(response, fieldnames=unique_fieldnames, extrasaction='ignore')
        writer.writeheader()

        for row in all_rows:
            writer.writerow(row)

        return response

class ProjectCostEstimateCSVExportView(View):
    def get_serializer_class(self, serializer_class):
        return serializer_class

    def list(self, queryset, serializer_class, many):
        serializer_class = self.get_serializer_class(serializer_class)
        serializer = serializer_class(queryset, many=many)
        return serializer

    def get(self, request, *args, **kwargs):
        headers = [
            'Project Name',
            'Category',
            'Project Type',
            'Status',
            'Status Date',
            'Expansion Area',
            'Estimate Type',
            'Land Cost',
            'Design',
            'Construction',
            'Admin',
            'Management',
            'Other',
        ]

        all_rows = []

        project_estimate_value = request.GET.get('project_estimate', None)

        if project_estimate_value is not None:
            project_estimate_queryset = ProjectCostEstimate.objects.filter(id=project_estimate_value)
            project_estimate_serializer = self.list(
                project_estimate_queryset,
                ProjectCostEstimateSerializer,
                many=True
            )
            filename = project_estimate_queryset[0].estimate_type + '_project_estimate_report.csv'
        else:
            project_estimate_queryset = ProjectCostEstimate.objects.all()

            project_set = self.request.GET.get('project_id', None)
            if project_set is not None:
                project_estimate_queryset = project_estimate_queryset.filter(project_id=project_set)

            is_approved_set = self.request.GET.get('is_approved', None)
            if is_approved_set is not None:
                is_approved_set = True if is_approved_set == 'true' else False
                project_estimate_queryset = project_estimate_queryset.filter(is_approved=is_approved_set)

            search_set = self.request.GET.get('search', None)
            if search_set is not None:
                project_estimate_queryset = project_estimate_queryset.filter(
                        Q(project_id__name__icontains=search_set) |
                        Q(estimate_type__icontains=search_set)
                    )

            project_estimate_serializer = self.list(
                project_estimate_queryset,
                ProjectCostEstimateSerializer,
                many=True
            )
            filename = 'project_estimate_report_' + datetime.datetime.now().strftime("%Y-%m-%d") + '.csv'

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=%s'%filename
        
        for project_estimate in project_estimate_serializer.data:
            project_name = ''
            project_category = ''
            project_type = ''
            project_status = ''
            project_status_date = ''
            project_expansion = ''
 
            if project_estimate['project_id']:
                project_name = project_estimate['project_id']['name']
                project_category = project_estimate['project_id']['project_category_display']
                project_type = project_estimate['project_id']['project_type_display']
                project_status = project_estimate['project_id']['project_status_display']
                project_status_date = project_estimate['project_id']['status_date']
                project_expansion = project_estimate['project_id']['expansion_area']

            row = {
                'Project Name': project_name,
                'Category': project_category,
                'Project Type': project_type,
                'Status': project_status,
                'Status Date': project_status_date,
                'Expansion Area': project_expansion,
                'Estimate Type': project_estimate['estimate_type'],
                'Land Cost': project_estimate['land_cost'],
                'Design': project_estimate['design_cost'],
                'Construction': project_estimate['construction_cost'],
                'Admin': project_estimate['admin_cost'],
                'Management': project_estimate['management_cost'],
                'Other': project_estimate['other_cost'],
            }

            all_rows.append(row)

        unique_fieldnames = []
        for name in headers:
            if name not in unique_fieldnames:
                unique_fieldnames.append(name)

        writer = csv.DictWriter(response, fieldnames=unique_fieldnames, extrasaction='ignore')
        writer.writeheader()

        for row in all_rows:
            writer.writerow(row)

        return response

class AccountLedgerCSVExportView(View):
    def get_serializer_class(self, serializer_class):
        return serializer_class

    def list(self, queryset, serializer_class, many):
        serializer_class = self.get_serializer_class(serializer_class)
        serializer = serializer_class(queryset, many=many)
        return serializer

    def get(self, request, *args, **kwargs):
        headers = [
            'Lot',
            'Account From',
            'Account To',
            'Agreement',
            'Entry Type',
            'Entry Date',
            'Roads',
            'Parks',
            'Stormwater',
            'Open Space',
            'Non-Sewer',
            'Sewer Trans.',
            'Sewer Cap.',
            'Sewer',
        ]

        all_rows = []

        ledger_value = request.GET.get('ledger', None)
        ledger_queryset = AccountLedger.objects.all()

        show_inactive = request.GET.get('showDeleted', False)
        if show_inactive:
            print('Show deleted entries')
        else:
            ledger_queryset = ledger_queryset.exclude(is_active=False)


        if ledger_value is not None:
            ledger_queryset = AccountLedger.objects.filter(
                id=ledger_value
            )

            ledger_serializer = self.list(
                ledger_queryset,
                AccountLedgerSerializer,
                many=True
            )
            filename = ledger_queryset[0].entry_type_display + '-' + ledger_queryset[0].entry_date + '_ledger_report.csv'
        else:
            lot_set = self.request.GET.get('lot', None)
            if lot_set is not None:
                ledger_queryset = ledger_queryset.filter(lot=lot_set)

            is_approved_set = self.request.GET.get('is_approved', None)
            if is_approved_set is not None:
                is_approved_set = True if is_approved_set == 'true' else False
                ledger_queryset = ledger_queryset.filter(is_approved=is_approved_set)

            account_from_set = self.request.GET.get('account_from', None)
            if account_from_set is not None:
                ledger_queryset = ledger_queryset.filter(account_from=account_from_set)

            account_to_set = self.request.GET.get('account_to', None)
            if account_to_set is not None:
                ledger_queryset = ledger_queryset.filter(account_to=account_to_set)

            agreement_set = self.request.GET.get('agreement', None)
            if agreement_set is not None:
                ledger_queryset = ledger_queryset.filter(agreement=agreement_set)

            entry_type_set = self.request.GET.get('entry_type', None)
            if entry_type_set is not None:
                ledger_queryset = ledger_queryset.filter(entry_type=entry_type_set)

            search_set = self.request.GET.get('search', None)
            if search_set is not None:
                ledger_queryset = ledger_queryset.filter(
                        Q(entry_type__icontains=search_set) |
                        Q(agreement__resolution_number__icontains=search_set) |
                        Q(lot__address_full__icontains=search_set) |
                        Q(account_to__account_name__icontains=search_set) |
                        Q(account_from__account_name__icontains=search_set)
                    )

            ledger_serializer = self.list(
                ledger_queryset,
                AccountLedgerSerializer,
                many=True
            )
            filename = 'ledger_report_' + datetime.datetime.now().strftime("%Y-%m-%d") + '.csv'

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=%s'%filename
        
        for ledger in ledger_serializer.data:
            lot_address = ''
            account_from = ''
            account_to = ''
            agreement_number = ''

            if ledger['lot']:
                lot_address = ledger['lot']['address_full']

            if ledger['account_from']:
                account_from = ledger['account_from']['account_name']

            if ledger['account_to']:
                account_to = ledger['account_to']['account_name']

            if ledger['agreement']:
                agreement_number = ledger['agreement']['resolution_number']

            row = {
                'Lot': lot_address,
                'Account From': account_from,
                'Account To': account_to,
                'Agreement': agreement_number,
                'Entry Type': ledger['entry_type_display'],
                'Entry Date': ledger['entry_date'],
                'Roads': ledger['roads'],
                'Parks': ledger['parks'],
                'Stormwater': ledger['storm'],
                'Open Space': ledger['open_space'],
                'Non-Sewer': ledger['non_sewer_credits'],
                'Sewer Trans.': ledger['sewer_trans'],
                'Sewer Cap.': ledger['sewer_cap'],
                'Sewer': ledger['sewer_credits'],
            }

            all_rows.append(row)

        unique_fieldnames = []
        for name in headers:
            if name not in unique_fieldnames:
                unique_fieldnames.append(name)

        writer = csv.DictWriter(response, fieldnames=unique_fieldnames, extrasaction='ignore')
        writer.writeheader()

        for row in all_rows:
            writer.writerow(row)

        return response

class TransactionCSVExportView(View):
    def get(self, request, *args, **kwargs):
        try:
            starting_date = request.GET.get('starting_date', None)
            print('STARTING DATE', starting_date)
            ending_date = request.GET.get('ending_date', datetime.date.today())
            print('ENDING DATE', ending_date)

            payment_prefetch = Payment.objects.filter(
                entry_date__lte=ending_date, entry_date__gte=starting_date
            ).exclude(
                is_active=False
            ).prefetch_related(
                Prefetch(
                    'credit_source',
                    queryset=Agreement.objects.exclude(is_active=False),
                ),
                Prefetch(
                    'credit_account',
                    queryset=Account.objects.exclude(is_active=False),
                ),
                Prefetch(
                    'lot_id',
                    queryset=Lot.objects.exclude(
                        is_active=False
                    ).prefetch_related(
                        Prefetch(
                            'plat',
                            queryset=Plat.objects.exclude(is_active=False).prefetch_related(
                                'plat_zone',
                                'subdivision',
                            ),
                        ),
                    ),
                ),
            ).values(
                'lot_id__address_full', 'lot_id__lot_number',
                'lot_id__plat__plat_zone', 'lot_id__plat__expansion_area',
                'lot_id__plat__cabinet', 'lot_id__plat__slide', 
                'credit_account__account_name', 'credit_source__resolution_number',
                'check_number', 'entry_date',
                'paid_by', 'paid_by_type', 'payment_type',
                'paid_open_space', 'paid_parks', 'paid_roads', 'paid_storm',
                'paid_sewer_cap', 'paid_sewer_trans',
            )
            payment_pandas = pd.DataFrame.from_records(payment_prefetch)
            print('PAYMENT PANDAS', payment_pandas[:2])

            payments = payment_pandas.rename(index=str, columns={
                'lot_id__address_full': 'Lot Address',
                'lot_id__lot_number': 'Lot ID',
                'lot_id__plat__plat_zone': 'Plat Zones',
                'lot_id__plat__expansion_area': 'Expansion Area',
                'lot_id__plat__cabinet': 'Cabinet',
                'lot_id__plat__slide': 'Slide', 
                'credit_account__account_name': 'Account From',
                'credit_source__resolution_number': 'Resolution',
                'check_number': 'Check', 'entry_date': 'Date',
                'paid_by': 'Paid By', 'paid_by_type': 'Paid By Type', 'payment_type': 'Transaction Type',
                'paid_open_space': 'Open Space', 'paid_parks': 'Parks', 'paid_roads': 'Roads', 
                'paid_sewer_cap': 'Sewer Cap.', 'paid_sewer_trans': 'Sewer Trans.', 'paid_storm': 'Storm'
            })
            print('PAYMENTS RENAMED', payments[:2])

            ledger_prefetch = AccountLedger.objects.filter(
                entry_date__lte=ending_date, entry_date__gte=starting_date
            ).exclude(
                is_active=False
            ).prefetch_related(
                Prefetch(
                    'account_from',
                    queryset=Account.objects.exclude(is_active=False),
                ),
                Prefetch(
                    'account_to',
                    queryset=Account.objects.exclude(is_active=False),
                ),
                Prefetch(
                    'agreement',
                    queryset=Agreement.objects.exclude(is_active=False),
                ),
                Prefetch(
                    'lot',
                    queryset=Lot.objects.exclude(
                        is_active=False
                    ).prefetch_related(
                        Prefetch(
                            'plat',
                            queryset=Plat.objects.exclude(is_active=False).prefetch_related(
                                'plat_zone',
                                'subdivision',
                            ),
                        ),
                    ),
                ),
            ).values(
                'account_from__account_name', 'account_to__account_name',
                'agreement__resolution_number',
                'lot__lot_number', 'lot__address_full',
                'lot__plat__plat_zone', 'lot__plat__expansion_area',
                'lot__plat__cabinet', 'lot__plat__slide', 
                'entry_date', 'entry_type',
                'non_sewer_credits', 'open_space', 'parks', 'roads', 'storm',
                'sewer_cap', 'sewer_credits', 'sewer_trans',
            )
            ledger_pandas = pd.DataFrame.from_records(ledger_prefetch)
            print('LEDGER PANDAS', ledger_pandas[:2])

            ledgers = ledger_pandas.rename(index=str, columns={
                'lot__address_full': 'Lot Address',
                'lot__lot_number': 'Lot ID',
                'lot__plat__plat_zone': 'Plat Zones',
                'lot__plat__expansion_area': 'Expansion Area',
                'lot__plat__cabinet': 'Cabinet',
                'lot__plat__slide': 'Slide', 
                'account_from__account_name': 'Account From',
                'account_to__account_name': 'Account To',
                'agreement__resolution_number': 'Resolution',
                'entry_date': 'Date', 'entry_type': 'Transaction Type',
                'non_sewer_credits': 'Non-Sewer', 'open_space': 'Open Space', 'parks': 'Parks', 
                'roads': 'Roads', 'storm': 'Storm',
                'sewer_cap': 'Sewer Cap.', 'sewer_credits': 'Sewer', 'sewer_trans': 'Sewer Trans.'
            })
            print('LEDGERS RENAMED', ledgers[:2])

            concat = pd.concat([payments, ledgers], join='outer')
            print('CONCAT', concat[:2])
            print('CONCAT COLUMNS ', list(concat))

            if len(concat) > 0:
                concat = concat[[
                    'Lot Address', 'Lot ID', 'Cabinet', 'Slide', 'Plat Zones',
                    'Expansion Area',
                    'Account From', 'Account To', 'Resolution', 
                    'Transaction Type', 'Paid By', 'Check', 
                    'Non-Sewer', 'Open Space', 'Parks', 'Roads', 'Storm', 
                    'Sewer', 'Sewer Cap.', 'Sewer Trans.'
                ]].sort_values(by=['Lot Address'])
            else:
                concat = pd.DataFrame(columns=[
                    'Lot Address', 'Lot ID', 'Cabinet', 'Slide', 'Plat Zones',
                    'Expansion Area',
                    'Account From', 'Account To', 'Resolution', 
                    'Transaction Type', 'Paid By', 'Check', 
                    'Non-Sewer', 'Open Space', 'Parks', 'Roads', 'Storm', 
                    'Sewer', 'Sewer Cap.', 'Sewer Trans.'
                ])

            bytesio = BytesIO()

            writer = pd.ExcelWriter(bytesio)
            concat.to_excel(writer, 'Transaction Report')

            writer.save()

            bytesio.seek(0)

            response = HttpResponse(bytesio.read(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = 'attachment; filename=Transaction_report_' + starting_date + '_' + ending_date + '.xlsx'

            return response

        except Exception as ex:
            return Response(ex, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
