from rest_framework.generics import RetrieveAPIView

import csv
from django.views.generic import View
from django.http import HttpResponse
from django.db.models import Count, Max, Q
import datetime

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
            account_queryset = Account.objects.filter(id=account_value)
            account_serializer = self.list(
                account_queryset,
                AccountSerializer,
                many=False
            )
            filename = account[0].account_name + '_account_report.csv'

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
                'Balance': account['balance']['balance'],
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
                        current_exactions = lot['lot_exactions']['current_exactions']

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
        ]

        all_rows = []

        agreement_value = request.GET.get('agreement', None)

        if agreement_value is not None:
            agreement_queryset = Agreement.objects.filter(id=agreement_value)
            agreement_serializer = self.list(
                agreement_queryset,
                AgreementSerializer,
                many=False
            )

            filename = agreement[0]['resolution_number'] + '_agreement_report.csv'
        else:
            agreement_queryset = Agreement.objects.all()

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

            project_queryset = Project.objects.filter(agreement_id=agreement['id'])
            if project_queryset is not None:
                project_serializer = self.list (
                    project_queryset,
                    ProjectSerializer,
                    many=True
                )

                for i, project in zip(range(project_queryset.count()), project_serializer.data):
                    headers.extend(['Project Category -%s' %(i+1)])
                    headers.extend(['Project Type -%s' %(i+1)])
                    headers.extend(['Project Status -%s' %(i+1)])

                    row['Project Category -%s' %(i+1)] = project['project_category_display']
                    row['Project Type -%s' %(i+1)] = project['project_type_display']
                    row['Project Status -%s' %(i+1)] = project['project_status_display']

            project_estimate_queryset = ProjectCostEstimate.objects.filter(project_id__agreement_id=agreement['id'])
            if project_estimate_queryset is not None:
                project_estimate_serializer = self.list (
                    project_estimate_queryset,
                    ProjectCostEstimateSerializer,
                    many=True
                )

                for i, project_estimate in zip(range(project_estimate_queryset.count()), project_estimate_serializer.data):
                    headers.extend(['Estimate Type -%s' %(i+1)])
                    headers.extend(['Land Cost -%s' %(i+1)])
                    headers.extend(['Design Cost -%s' %(i+1)])
                    headers.extend(['Constr. Cost -%s' %(i+1)])
                    headers.extend(['Admin Cost -%s' %(i+1)])
                    headers.extend(['Mgmt. Cost -%s' %(i+1)])
                    headers.extend(['Other Cost -%s' %(i+1)])

                    row['Estimate Type -%s' %(i+1)] = project_estimate['estimate_type']
                    row['Land Cost -%s' %(i+1)] = project_estimate['land_cost']
                    row['Design Cost -%s' %(i+1)] = project_estimate['design_cost']
                    row['Constr. Cost -%s' %(i+1)] = project_estimate['construction_cost']
                    row['Admin Cost -%s' %(i+1)] = project_estimate['admin_cost']
                    row['Mgmt. Cost -%s' %(i+1)] = project_estimate['management_cost']
                    row['Other Cost -%s' %(i+1)] = project_estimate['other_cost']

            payment_queryset = Payment.objects.filter(credit_source=agreement['id'])
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

            ledger_queryset = AccountLedger.objects.filter(agreement=agreement['id'])
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

        if payment_value is not None:
            payment_queryset = Payment.objects.filter(id=payment_value)
            payment_serializer = self.list(
                payment_queryset,
                PaymentSerializer,
                many=False
            )
            filename = payment_queryset[0].payment_type + '-' + payment_queryset[0].paid_by + '_payment_report.csv'
        else:
            payment_queryset = Payment.objects.all()

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

            if payment['lot_id']:
                lot_address = payment['lot_id']['address_full']

            if payment['credit_account']:
                account_name = payment['credit_account']['account_name']

            if payment['credit_source']:
                agreement_number = payment['credit_source']['resolution_number']

            row = {
                'Lot': lot_address,
                'Payment Type': payment['payment_type_display'],
                'Payer Type': payment['paid_by_type_display'],
                'Payer': payment['paid_by'],
                'Check Number': payment['check_number'],
                'Date': payment['date_created'],
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
            project_queryset = Project.objects.filter(id=project_value)
            project_serializer = self.list(
                project_queryset,
                ProjectSerializer,
                many=False
            )
            filename = project_queryset[0].name + '_project_report.csv'
        else:
            project_queryset = Project.objects.all()

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
            project_estimate_queryset = ProjectCostEstimate.objects.filter(project_id=project['id'])
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
                many=False
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

        if ledger_value is not None:
            ledger_queryset = AccountLedger.objects.filter(id=ledger_value)
            ledger_serializer = self.list(
                ledger_queryset,
                AccountLedgerSerializer,
                many=False
            )
            filename = ledger_queryset[0].entry_type_display + '-' + ledger_queryset[0].entry_date + '_ledger_report.csv'
        else:
            ledger_queryset = AccountLedger.objects.all()

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
    def get_serializer_class(self, serializer_class):
        return serializer_class

    def list(self, queryset, serializer_class, many):
        serializer_class = self.get_serializer_class(serializer_class)
        serializer = serializer_class(queryset, many=many)
        return serializer

    def get(self, request, *args, **kwargs):
        headers = [
            'Subdivision',
            'Cabinet',
            'Slide',
            'Unit',
            'Section',
            'Block',
            'Plat Zones',
            'Lot Address',
            'Permit ID',
            'Alt. Address',
            'Transaction Type',
            'Paid By',
            'Sewer Trans.',
            'Sewer Cap.',
            'SEWER SUBTL',
            'Roads',
            'Parks',
            'Stormwater',
            'Open Space',
            'NONSWR SUBTL',
            'Total',
        ]

        starting_date = request.GET.get('starting_date', None)
        ending_date = request.GET.get('ending_date', datetime.date.today())

        if starting_date is not None:
            transaction_filename = 'transactions_starting_date_' + starting_date + 'ending_date_' + ending_date

            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename=' + transaction_filename + '.csv'

            payment_queryset = Payment.objects.filter(date_created__lte=ending_date, date_created__gte=starting_date)
            ledger_queryset = AccountLedger.objects.filter(date_created__lte=ending_date, date_created__gte=starting_date)

            lot_queryset = Lot.objects.filter(
                Q(payment__in=payment_queryset) |
                Q(ledger_lot__in=ledger_queryset)
            ).distinct()

            # SERIALIZE LOT
            lot_serializer = self.list(
                lot_queryset,
                LotSerializer,
                many=True
            )

            writer = csv.DictWriter(response, fieldnames=headers, extrasaction='ignore')
            writer.writeheader()

            for lot in lot_serializer.data:
                subdivision = ''
                all_plat_zones = ''
                alt_address = ''
                cabinet = ''
                slide = ''
                unit = ''
                section = ''
                block = ''

                if lot['plat']:
                    cabinet = lot['plat']['cabinet']
                    slide = lot['plat']['slide']
                    unit = lot['plat']['unit']
                    section = lot['plat']['section']
                    block = lot['plat']['block']

                    if lot['plat']['subdivision']:
                        subdivision = lot['plat']['subdivision']['name']

                plat_zones = PlatZone.objects.filter(plat=lot['plat']['id'])
                if plat_zones.count() > 0: 
                    all_plat_zones = ''
                    for zone in plat_zones:
                        all_plat_zones += (zone.zone + ', ')

                if lot['alternative_address_number'] or lot['alternative_address_street']:
                    alt_address = lot['alternative_address_number'] + lot['alternative_address_street']

                lot_payments = Payment.objects.filter(lot_id=lot['id'])
                lot_ledgers = AccountLedger.objects.filter(lot=lot['id'])

                if lot_payments is not None:
                    payment_serializer = self.list(
                        lot_payments,
                        PaymentSerializer,
                        many=True
                    )
                    
                    for payment in payment_serializer.data:
                        sewer_sub = round(float(payment['paid_sewer_trans']) + float(payment['paid_sewer_cap']), 2)
                        non_sewer_sub = round(float(payment['paid_roads']) + float(payment['paid_parks']) + float(payment['paid_storm']) + float(payment['paid_open_space']), 2)
                        total = sewer_sub + non_sewer_sub
                        row = {
                            'Subdivision': subdivision,
                            'Cabinet': cabinet,
                            'Slide': slide,
                            'Unit': unit,
                            'Section': section,
                            'Block': block,
                            'Plat Zones': all_plat_zones,
                            'Lot Address': lot['address_full'],
                            'Permit ID': lot['permit_id'],
                            'Alt. Address': alt_address,
                            'Transaction Type': payment['payment_type_display'],
                            'Paid By': payment['paid_by'],
                            'Sewer Trans.': payment['paid_sewer_trans'],
                            'Sewer Cap.': payment['paid_sewer_cap'],
                            'SEWER SUBTL': sewer_sub,
                            'Roads': payment['paid_roads'],
                            'Parks': payment['paid_parks'],
                            'Stormwater': payment['paid_storm'],
                            'Open Space': payment['paid_open_space'],
                            'NONSWR SUBTL': non_sewer_sub,
                            'Total': total,
                        }

                        writer.writerow(row)

                if lot_ledgers is not None:
                    ledger_serializer = self.list(
                        lot_ledgers,
                        AccountLedgerSerializer,
                        many=True
                    )
                    
                    for ledger in ledger_serializer.data:
                        total = round(float(ledger['sewer_credits']) + float(ledger['non_sewer_credits']), 2)
                        
                        account_from = ''

                        if ledger['account_from']:
                            account_from = ledger['account_from']['account_name']

                        row = {
                            'Subdivision': subdivision,
                            'Cabinet': cabinet,
                            'Slide': slide,
                            'Unit': unit,
                            'Section': section,
                            'Block': block,
                            'Plat Zones': all_plat_zones,
                            'Lot Address': lot['address_full'],
                            'Permit ID': lot['permit_id'],
                            'Alt. Address': alt_address,
                            'Transaction Type': 'Credits',
                            'Paid By': account_from,
                            'Sewer Trans.': ledger['sewer_trans'],
                            'Sewer Cap.': ledger['sewer_cap'],
                            'SEWER SUBTL': ledger['sewer_credits'],
                            'Roads': ledger['roads'],
                            'Parks': ledger['parks'],
                            'Stormwater': ledger['storm'],
                            'Open Space': ledger['open_space'],
                            'NONSWR SUBTL': ledger['non_sewer_credits'],
                            'Total': total,
                        }

                        writer.writerow(row)
            return response

