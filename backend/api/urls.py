from django.urls import include, path
from rest_framework import routers
from django.contrib.auth import views as auth_views

from accounts.auth import *
from plats.viewsets import SubdivisionViewSet, SubdivisionQuickViewSet, PlatViewSet, PlatQuickViewSet, LotViewSet, LotQuickViewSet, LotExactionsViewSet, PlatZoneViewSet
from plats.views import (
    LotSearchCSVExportView,
    AdminLotSearchCSVExportView,
    PlatCSVExportView,
    SubdivisionCSVExportView,
)
from notes.viewsets import *
from accounts.viewsets import *
from accounts.views import (
    AccountCSVExportView,
    AccountLedgerCSVExportView,
    AgreementCSVExportView,
    CurrentUserDetails,
    PaymentCSVExportView,
    ProjectCSVExportView,
    ProjectCostEstimateCSVExportView,
    TransactionCSVExportView,
    AccountLedgerDifferencesCSVExportView,
    AccountLedgerDifferencesNoZeroCSVExportView,
    AccountLedgerDifferencesOnlyZeroCSVExportView,
)

router = routers.DefaultRouter()

router.register(r'user', UserViewSet)

router.register(r'subdivision', SubdivisionViewSet)
router.register(r'subdivisionQuick', SubdivisionQuickViewSet, basename='subdivisionQuick')
router.register(r'plat', PlatViewSet)
router.register(r'platQuick', PlatQuickViewSet, basename='platQuick')
router.register(r'lot', LotViewSet)
router.register(r'lotQuick', LotQuickViewSet, basename='lotQuick')
router.register(r'lotExactions', LotExactionsViewSet, basename='lotExactions')
router.register(r'platZone', PlatZoneViewSet)
router.register(r'payment', PaymentViewSet)

router.register(r'note', NoteViewSet)
router.register(r'rateTable', RateTableViewSet)
router.register(r'rate', RateViewSet)
router.register(r'upload', FileUploadViewSet)

router.register(r'account', AccountViewSet)
router.register(r'accountQuick', AccountQuickViewSet, basename='accountQuick')
router.register(r'agreement', AgreementViewSet)
router.register(r'agreementQuick', AgreementQuickViewSet, basename='agreementQuick')
router.register(r'project', ProjectViewSet)
router.register(r'projectQuick', ProjectQuickViewSet, basename='projectQuick')
router.register(r'estimate', ProjectCostEstimateViewSet)
router.register(r'ledger', AccountLedgerViewSet)

urlpatterns = [
    path(r'^me/$', CurrentUserDetails.as_view(), name="me"),

    path(r'^login/$', CustomObtainAuthToken.as_view()),
    path(r'^register/$', Registration.as_view()),
    path(r'^forgot-password/$', forgot_password),
    # path(r'^password_reset/$', reset_password),
    path(r'^forgot-username/$', forgot_username),
    path(r'^delete_token/', Logout.as_view()),
    path(r'^reset/(?P<uid>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        # auth_views.password_reset_confirm,
        reset_password,
        name='password_reset_confirm'
    ),

    path(r'^upload/create/$', FileUploadCreate.as_view(), name="document-upload"),
    path(r'^subdivision_search_csv/$', SubdivisionCSVExportView.as_view()),
    path(r'^export_plat_csv/$', PlatCSVExportView.as_view()),
    path(r'^lot_search_csv/$', LotSearchCSVExportView.as_view()),
    path(r'^admin_lot_search_csv/$', AdminLotSearchCSVExportView.as_view()),

    path(r'^transactions_csv/$', TransactionCSVExportView.as_view()),
    path(r'^export_account_csv/$', AccountCSVExportView.as_view()),
    path(r'^export_agreement_csv/$', AgreementCSVExportView.as_view()),
    path(r'^payment_search_csv/$', PaymentCSVExportView.as_view()),
    path(r'^project_search_csv/$', ProjectCSVExportView.as_view()),
    path(r'^project_estimate_search_csv/$', ProjectCostEstimateCSVExportView.as_view()),
    path(r'^ledger_search_csv/$', AccountLedgerCSVExportView.as_view()),
    path(r'^ledger_differences_csv/$', AccountLedgerDifferencesCSVExportView.as_view()),
    path(r'^ledger_differences_no_zero_csv/$', AccountLedgerDifferencesNoZeroCSVExportView.as_view()),
    path(r'^ledger_differences_only_zero_csv/$', AccountLedgerDifferencesOnlyZeroCSVExportView.as_view()),

    path(r'^', include(router.urls)),
]
