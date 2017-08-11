from django.contrib.auth.models import User
from rest_framework import serializers

from rest_framework.authtoken.models import Token

class CurrentUserSerializer(serializers.ModelSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    def get_token(self, obj):
        token_value = Token.objects.filter(user=obj)[0].key
        return token_value

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'is_superuser',
            'token',
        )
