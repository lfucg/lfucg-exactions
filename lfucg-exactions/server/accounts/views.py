from django.shortcuts import render

from rest_framework.generics import RetrieveAPIView

from django.contrib.auth.models import User
from .serializers import UserSerializer

class CurrentUserDetails(RetrieveAPIView):
    model = User
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
