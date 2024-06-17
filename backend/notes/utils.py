from rest_framework.response import Response
from rest_framework import status

def update_entry(self, request, pk):
    existing_object = self.get_object()
    setattr(existing_object, 'modified_by', request.user)
    serializer = self.get_serializer(existing_object, data=request.data, partial=True)
    if serializer.is_valid(raise_exception=True):
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

