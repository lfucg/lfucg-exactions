from rest_framework import viewsets

from .models import *
from .serializers import *

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    queryset = Note.objects.all()

class RateTableViewSet(viewsets.ModelViewSet):
    serializer_class = RateTableSerializer
    queryset = RateTable.objects.all()

class RateViewSet(viewsets.ModelViewSet):
    serializer_class = RateSerializer
    queryset = Rate.objects.all()
    