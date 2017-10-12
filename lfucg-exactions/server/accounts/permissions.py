from rest_framework import permissions
from rest_framework.permissions import BasePermission, SAFE_METHODS
from django.contrib.auth.models import User

 
class CanAdminister(permissions.BasePermission):
    def has_permission(self, request, view):
        view_full_name = type(view).__name__
        view_name = view_full_name.replace("ViewSet", "").lower()

        perm_add = 'accounts.add_' + view_name
        perm_change = 'accounts.change_' + view_name

        if request.user.has_perm(perm_change) or request.user.has_perm(perm_add):
            return True
        elif request.method in permissions.SAFE_METHODS:
            return True
        else:
            return False

    def has_object_permission(self, request, view, obj):
        obj_name = type(obj).__name__.lower()
        perm_add = 'accounts.add_' + obj_name
        perm_change = 'accounts.change_' + obj_name

        if request.user.has_perm(perm_change) or request.user.has_perm(perm_add):
            return True
        elif request.method in permissions.SAFE_METHODS:
            return True
        else:
            return False
            