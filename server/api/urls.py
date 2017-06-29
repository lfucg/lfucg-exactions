from django.conf.urls import include, url
from rest_framework import routers

from accounts.auth import *
from plats.viewsets import *
from notes.viewsets import *
from accounts.viewsets import *
from accounts.views import CurrentUserDetails

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
    url(r'^forgot-username/$', forgot_username),
    url(r'^delete_token/', Logout.as_view()),

    url(r'^', include(router.urls)),
]