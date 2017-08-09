from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response

from django.contrib.auth.models import User
from .serializers import CurrentUserSerializer
from rest_framework.authtoken.models import Token

class CurrentUserDetails(RetrieveAPIView):
    model = User
    serializer_class = CurrentUserSerializer

    def get_object(self):
        # token = Token.objects.get_or_create(user=self.request.user)[0]
        # print('TOKEN', token)
        # print('SELF REQUEST', dir(self.request.user))
        # print('SERIALIZE', CurrentUserSerializer(self.request.user).data)
        # print('SELF USERNAME', self.request.user.username)
        return self.request.user
        # return Response({'key': token.key, 'user': CurrentUserSerializer(self.request.user).data})
