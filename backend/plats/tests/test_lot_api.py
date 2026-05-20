import pytest
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIClient

from plats.models import Lot

pytestmark = pytest.mark.django_db


def test_create_lot_api_with_valid_payload(test_data):
    plat = test_data.plat
    initial_lot_count = Lot.objects.count()

    user = User.objects.create_user(
        username='api_test_user',
        email='api_test_user@example.com',
        password='test',
        is_active=True,
        is_staff=True,
        is_superuser=True,
    )
    api_client = APIClient()
    api_client.force_authenticate(user=user)

    response = api_client.post(
        '/api/lot/',
        {
            'plat': plat.id,
            'lot_number': 'API Lot Create Test',
            'address_number': 999,
            'address_street': 'API Test Street',
            'address_full': '999 API Test Street Lexington, KY 40509',
            'address_state': 'KY',
            'address_zip': '40509',
        },
        format='json',
    )

    assert response.status_code == status.HTTP_200_OK
    assert Lot.objects.count() == initial_lot_count + 1

    data = response.data if hasattr(response, 'data') else response.json()
    assert data['plat']['id'] == plat.id
    assert data['address_full'] == '999 API Test Street Lexington, KY 40509'
    assert data['lot_exactions']['total_exactions'] == 0.0
