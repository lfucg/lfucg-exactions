from rest_framework import viewsets
from django.db.models import Q
from django.contrib.contenttypes.models import ContentType

from .models import *
from .serializers import *
from plats.models import Plat, Lot

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    queryset = Note.objects.all()
    permission_classes = (CanAdminister,)

    def get_queryset(self):
        queryset = Note.objects.all()

        child_content_type_string = self.request.query_params.get('content_type', None)
        child_object_id = self.request.query_params.get('object_id', None)
        parent_content_type_string = self.request.query_params.get('parent_content_type', None)
        parent_object_id = self.request.query_params.get('parent_object_id', None)
                
        if parent_content_type_string is not None:
            if parent_content_type_string == 'Plat':
                parent_content_type = ContentType.objects.get_for_model(Plat)
            elif parent_content_type_string == 'Lot':
                parent_content_type = ContentType.objects.get_for_model(Lot)
            if child_content_type_string == 'Plat':
                child_content_type = ContentType.objects.get_for_model(Plat)
            elif child_content_type_string == 'Lot':
                child_content_type = ContentType.objects.get_for_model(Lot)

            query_list = queryset.filter(
                Q(content_type=parent_content_type, object_id=parent_object_id) |
                Q(content_type=child_content_type, object_id=child_object_id))

            queryset = query_list
        elif child_content_type_string is not None:

            if child_content_type_string == 'Plat':
                child_content_type = ContentType.objects.get_for_model(Plat)
            elif child_content_type_string == 'Lot':
                child_content_type = ContentType.objects.get_for_model(Lot)
            queryset = queryset.filter(content_type=child_content_type, object_id=child_object_id)

        else:
            queryset = queryset

        return queryset.order_by('-date')

class RateTableViewSet(viewsets.ModelViewSet):
    serializer_class = RateTableSerializer
    queryset = RateTable.objects.all()
    permission_classes = (CanAdminister,)

class RateViewSet(viewsets.ModelViewSet):
    serializer_class = RateSerializer
    queryset = Rate.objects.all()
    permission_classes = (CanAdminister,)
    