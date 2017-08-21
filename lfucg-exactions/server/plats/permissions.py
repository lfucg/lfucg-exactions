from rest_framework import permissions
from rest_framework.permissions import BasePermission, SAFE_METHODS
from django.contrib.auth.models import User

 
class CanAdminister(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        obj_name = type(obj).__name__.lower()
        perm_add_plats = 'plats.add_' + obj_name
        perm_change_plats = 'plats.change_' + obj_name
        if request.user.has_perm(perm_add_plats) or request.user.has_perm(perm_change_plats):
            return True
        else:
            return False
