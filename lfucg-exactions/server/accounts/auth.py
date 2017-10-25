from django.contrib.auth.models import User
from django.contrib.auth.views import login
from django.core import signing

from rest_framework import authentication, permissions
from django.contrib.auth import views as auth_views
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from django.shortcuts import redirect
from rest_framework import status as statuses, serializers
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import CreateAPIView, GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .helper import send_password_reset_email, send_lost_username_email
# from rest_framework_expiring_authtoken.models import ExpiringToken

from accounts.serializers import UserSerializer
# , PasswordChangeSerializer
# from api import tasks

from django.utils.timezone import now
from datetime import timedelta
import random


# @api_view(['POST'])
# @permission_classes((AllowAny, ))

def get_token_for_user(user):
    token =  Token.objects.get_or_create(user=user)[0]
    right_now = now()
    if token.created < right_now - timedelta(days=3):
        token.delete()
        token = Token.objects.get_or_create(user=user, created=right_now)[0]
    return token

class CustomObtainAuthToken(ObtainAuthToken):
    authentication_classes = (authentication.SessionAuthentication,)
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            token = get_token_for_user(serializer.validated_data['user'])
            return Response({'key': token.key, 'user': UserSerializer(token.user).data})
        return Response(serializer.errors, status=statuses.HTTP_400_BAD_REQUEST)

class Registration(GenericAPIView):
    authentication_classes = (authentication.SessionAuthentication,)
    # def clean_password2(self):
    #     cd = self.cleaned_data

    #     if cd['password_1'] != cd['password_2']:
    #         raise forms.ValidationError('Passwords do not match.')
    #     password = cd['password_2']
    #     return password

    def post(self, request, *args, **kwargs):
        print('GOT TO Registration')
        

    #     serializer = UserSerializer(data=request.data)
    #     if serializer.is_valid():
    #         token = get_token_for_user(serializer.validated_data['user'])
    #         u = serializer.save()

    #         return Response({'key': token.key, 'user': UserSerializer(token.user).data})
    #     return Response(serializer.errors, status=statuses.HTTP_400_BAD_REQUEST)

    # authentication_classes = (authentication.SessionAuthentication,)
    
    # def register(request):
    #     serializer = UserSerializer(data=request.data)
    #     if serializer.is_valid():
    #         u = serializer.save()

    #         token =  Token.objects.get_or_create(user_id=serializer.data['id'])[0]
    #         return Response({'key': token.key, 'user': serializer.data})
    #     return Response(serializer.errors, status=statuses.HTTP_400_BAD_REQUEST)

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
@api_view(['POST'])
@permission_classes((AllowAny, ))
def forgot_password(request):
    email = request.data.get('email', None)
    user = User.objects.get(email=email)
    token = PasswordResetTokenGenerator().make_token(user)
    if user:
        print(user)
        print('yep')
        send_password_reset_email(user, token)
    # Always return success
    return Response({'message': 'An email was sent to your account with instructions to reset your password.'}, status=statuses.HTTP_200_OK)

# # Need to edit to send username in email
@api_view(['POST'])
@permission_classes((AllowAny, ))
def forgot_username(request):
    email = request.data.get('email', None)
    user = User.objects.filter(email__icontains=email)
    if user.exists():
        send_lost_username_email(user)

    # Always return success
    return Response({'message': 'An email was sent to your account with your username.'}, status=statuses.HTTP_200_OK)

@api_view(['POST'])
@permission_classes((AllowAny, ))
def reset_password(request):
    user = User.objects.get(id=request.data['uid'])
    token = request.data['token']
    response, status, user = _validate_token(user, token)
    if status == statuses.HTTP_200_OK:
        user.set_password(request.data.get('newPassword1'))
        user.save()
        _delete_token(token)
        response = {'success': 'New password has been saved.'}

    return Response(response, status=status)

def _validate_token(user, token):
    response = {}
    status = statuses.HTTP_400_BAD_REQUEST
    print('we outchea')
    print(PasswordResetTokenGenerator().check_token(user, token))
    if PasswordResetTokenGenerator().check_token(user, token):
        response = None
        status = statuses.HTTP_200_OK
        print(status)
            
    #     if user.email is not None:
    #         passtoken = ExpiringToken.objects.filter(user_id=user.id)
    #         if passtoken.exists() and passtoken[0].key == data_token:
    #         else:
    #             response['token'] = 'This password reset request cannot be used any more.'
    #     else:
    #         response['token'] = 'Missing email in password reset request.'
    # except signing.SignatureExpired:
    #     response['token'] = 'Reset password request has expired.'
    # except signing.BadSignature:
    #     response['token'] = 'Invalid reset password request.'
    return response, status, user

def _delete_token(token):
    try:
        data = signing.loads(token)
        data_token = data.get('passtoken', None)
        ExpiringToken.objects.get(key=data_token).delete()
    except:
        pass

class Logout(GenericAPIView):
    def post(self, request, *args, **kwargs):
        request.user.auth_token.delete()
        return redirect('/logout/')

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
