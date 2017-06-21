from django.contrib.auth.models import User
from django.contrib.auth.views import login
from django.core import signing
from django.contrib.auth import authenticate, login 

from rest_framework import status as statuses, serializers
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import CreateAPIView, GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
# from rest_framework_expiring_authtoken.models import ExpirsingToken

from accounts.serializers import UserSerializer
# , PasswordChangeSerializer
# from api import tasks

from django.utils.timezone import now
from datetime import timedelta
import random

def get_user(request, token):
    if token is not None:
        user = User.objects.get(username = token.user.username)
        if user is not None:
            login(request, user)


# @api_view(['POST'])
# @permission_classes((AllowAny, ))
# def register(request):
#     serializer = UserSerializer(data=request.data)
#     if serializer.is_valid():
#         email = request.data.get('email', None)
#         profile = Profile.objects.filter(user__email__iexact=email)
#         if profile.count() > 0:
#             raise serializers.ValidationError({ 'email': ['A user with that email already exists.']})
#         u = serializer.save()
#         # Create profile
#         notifications = request.data.get('email_notifications', None)
#         if notifications is None:
#             notifications = True
#         else:
#             notifications = notifications.lower() == "true" or notifications == "1" or notifications.lower() == "yes"

#         max_opponents = Opponent.objects.all().count()
#         Profile.objects.get_or_create(user=u, email_notifications=notifications, solo_opponent=Opponent.objects.get(opponent_id=random.randint(1, max_opponents)))

#         token =  Token.objects.get_or_create(user_id=serializer.data['id'])[0]
#         return Response({'key': token.key, 'user': serializer.data})
#     return Response(serializer.errors, status=statuses.HTTP_400_BAD_REQUEST)

def get_token_for_user(user):
    token =  Token.objects.get_or_create(user=user)[0]
    right_now = now()
    if token.created < right_now - timedelta(days=3):
        token.delete()
        token = Token.objects.get_or_create(user=user, created=right_now)[0]
    return token

class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            token = get_token_for_user(serializer.validated_data['user'])
            get_user(request, token)
            return Response({'key': token.key, 'user': UserSerializer(token.user).data})
        return Response(serializer.errors, status=statuses.HTTP_400_BAD_REQUEST)

# class PasswordChangeView(GenericAPIView):
#     """
#     Calls Django Auth SetPasswordForm save method.
#     Accepts the following POST parameters: new_password1, new_password2
#     Returns the success/fail message.
#     """

#     serializer_class = PasswordChangeSerializer
#     permission_classes = (IsAuthenticated,)

#     def post(self, request):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response({"success": "New password has been saved."})

# # Convert to try and except methods
# @api_view(['POST'])
# @permission_classes((AllowAny, ))
# def forgot_password(request):
#     email = request.data.get('email', None)
#     user = User.objects.filter(email__icontains=email)
#     if user.exists():
#         if user[0].social_auth.filter(provider='facebook').exists():
#             tasks.send_password_reset_email.delay(user[0].id, 'facebook')
#         else:
#             tasks.send_password_reset_email.delay(user[0].id, 'not facebook')

#     # Always return success
#     return Response(status=statuses.HTTP_200_OK)

# # Need to edit to send username in email
# @api_view(['POST'])
# @permission_classes((AllowAny, ))
# def forgot_username(request):
#     email = request.data.get('email', None)
#     user = User.objects.filter(email__icontains=email)
#     if user.exists():
#         tasks.send_lost_username_email.delay(user[0].id)

#     # Always return success
#     return Response(status=statuses.HTTP_200_OK)


# def _validate_token(token):
#     response = {}
#     status = statuses.HTTP_400_BAD_REQUEST
#     user = None
#     try:
#         data = signing.loads(token, max_age=900) # 15 minute expiration
#         data_token = data.get('passtoken', None)
#         email = data.get('email', None)
#         if email is not None:
#             user = User.objects.get(email=email)
#             passtoken = ExpiringToken.objects.filter(user_id=user.id)
#             if passtoken.exists() and passtoken[0].key == data_token:
#                 response = None
#                 status = statuses.HTTP_200_OK
#             else:
#                 response['token'] = 'This password reset request cannot be used any more.'
#         else:
#             response['token'] = 'Missing email in password reset request.'
#     except signing.SignatureExpired:
#         response['token'] = 'Reset password request has expired.'
#     except signing.BadSignature:
#         response['token'] = 'Invalid reset password request.'
#     return response, status, user

# def _delete_token(token):
#     try:
#         data = signing.loads(token)
#         data_token = data.get('passtoken', None)
#         ExpiringToken.objects.get(key=data_token).delete()
#     except:
#         pass

# @api_view(['POST'])
# @permission_classes((AllowAny, ))
# def validate_reset_token(request, token):
#     response, status, user = _validate_token(token)

#     return Response(response, status=status)

# @api_view(['POST'])
# @permission_classes((AllowAny, ))
# def reset_password(request, token):
#     response, status, user = _validate_token(token)

#     if status == statuses.HTTP_200_OK:
#         serializer = PasswordChangeSerializer(data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             # We don't have an authenticated quest.  So, we can't call save on the serializer
#             user.set_password(request.data.get('new_password1'))
#             user.save()
#             _delete_token(token)
#             response = {'success': 'New password has been saved.'}

#     return Response(response, status=status)
