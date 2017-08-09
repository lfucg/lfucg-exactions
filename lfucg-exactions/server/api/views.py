from rest_framework.generics import RetrieveAPIView

from django.contrib.auth.models import User
from .serializers import CurrentUserSerializer

class CurrentUserDetails(RetrieveAPIView):
    model = User
    serializer_class = CurrentUserSerializer

    def get_object(self):
        return self.request.user
