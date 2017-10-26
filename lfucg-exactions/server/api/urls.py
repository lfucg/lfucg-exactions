from django.conf.urls import include, url
from rest_framework import routers
from django.contrib.auth import views as auth_views

from accounts.auth import *
from plats.viewsets import *
from plats.views import PlatCSVExportView
from notes.viewsets import *
from accounts.viewsets import *
from .views import CurrentUserDetails

router = routers.DefaultRouter()

router.register(r'user', UserViewSet)

router.register(r'subdivision', SubdivisionViewSet)
router.register(r'plat', PlatViewSet)
router.register(r'lot', LotViewSet)
router.register(r'platZone', PlatZoneViewSet)
router.register(r'payment', PaymentViewSet)
router.register(r'worksheet', CalculationWorksheetViewSet)

router.register(r'note', NoteViewSet)
router.register(r'rateTable', RateTableViewSet)
router.register(r'rate', RateViewSet)
router.register(r'upload', FileUploadViewSet)

router.register(r'account', AccountViewSet)
router.register(r'agreement', AgreementViewSet)
router.register(r'project', ProjectViewSet)
router.register(r'estimate', ProjectCostEstimateViewSet)
router.register(r'ledger', AccountLedgerViewSet)

urlpatterns = [
    url(r'^me/$', CurrentUserDetails.as_view(), name="me"),

    url(r'^login/$', CustomObtainAuthToken.as_view()),
    url(r'^register/$', Registration.as_view()),
    url(r'^forgot-password/$', forgot_password),
    url(r'^password_reset/$', reset_password),
    url(r'^forgot-username/$', forgot_username),
    url(r'^delete_token/', Logout.as_view()),
    url(r'^upload/create/$', FileUploadCreate.as_view(), name="document-upload"),
    url(r'^export_plat_csv/$', PlatCSVExportView.as_view()),
    url(r'^reset/(?P<uidb36>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', auth_views.password_reset_confirm, name='password_reset_confirm'),
    url(r'^', include(router.urls)),
]