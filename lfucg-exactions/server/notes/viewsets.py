from rest_framework import viewsets, status, generics, filters
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import status
from django.contrib.contenttypes.models import ContentType

from rest_framework.parsers import FileUploadParser, MultiPartParser
from django_filters.rest_framework import DjangoFilterBackend

from .models import Note, FileUpload, MediaStorage, Rate, RateTable, expose_rate_total
from .serializers import *
from plats.models import Lot, Plat, Subdivision
from .permissions import CanAdminister
from .utils import update_entry

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    queryset = Note.objects.all()
    permission_classes = (CanAdminister,)

    def get_queryset(self):
        queryset = Note.objects.all()

        child_content_type_string = self.request.query_params.get('content_type', None)
        child_object_id = self.request.query_params.get('object_id', None)
                
        if child_content_type_string is not None:
            split_child_content = child_content_type_string.split('_')

            if len(split_child_content) == 2:
                child_content_type_app_label = split_child_content[0]
                child_content_type_model = split_child_content[1]
                child_content_type = ContentType.objects.get(app_label=child_content_type_app_label, model=child_content_type_model)
                parent_content_type = None
                parent_object_id = None
                grandparent_content_type = None
                grandparent_object_id = None
                if child_content_type_model == 'lot':
                    content_lot = Lot.objects.filter(id=child_object_id)
                    if content_lot.count() > 0 and content_lot[0].plat:
                        chosen_lot = content_lot[0]
                        content_plat = Plat.objects.filter(id=chosen_lot.plat.id)
                        chosen_plat = content_plat[0]
                        parent_object_id = chosen_plat.id
                        parent_content_type = ContentType.objects.get_for_model(Plat)
                        if chosen_plat and chosen_plat.subdivision:
                            grandparent_content_type = ContentType.objects.get_for_model(Subdivision)
                            grandparent_object_id = chosen_plat.subdivision.id
                        else:
                            grandparent_content_type = None
                            grandparent_object_id = None
                    else:
                        parent_content_type = None
                        parent_object_id = None
                        grandparent_content_type = None
                        grandparent_object_id = None
                elif child_content_type_model == 'plat':
                    content_plat = Plat.objects.filter(id=child_object_id)
                    if content_plat.count() > 0 and content_plat[0].subdivision:
                        chosen_plat = content_plat[0]
                        parent_content_type = ContentType.objects.get_for_model(Subdivision)
                        parent_object_id = chosen_plat.subdivision.id
                    else:
                        parent_content_type = None
                        parent_object_id = None

                if grandparent_content_type is not None and parent_content_type is not None and child_content_type:
                    queryset = queryset.filter(
                        Q(content_type=grandparent_content_type, object_id=grandparent_object_id) |
                        Q(content_type=parent_content_type, object_id=parent_object_id) |
                        Q(content_type=child_content_type, object_id=child_object_id))

                elif parent_content_type is not None and child_content_type:
                    queryset = queryset.filter(
                        Q(content_type=parent_content_type, object_id=parent_object_id) |
                        Q(content_type=child_content_type, object_id=child_object_id))
                else:
                    queryset = queryset.filter(content_type=child_content_type, object_id=child_object_id)

        else:
            return Response('No Notes chosen', status=status.HTTP_406_NOT_ACCEPTABLE)

        return queryset.order_by('-date')

class RateTableViewSet(viewsets.ModelViewSet):
    serializer_class = RateTableSerializer
    queryset = RateTable.objects.all()
    permission_classes = (CanAdminister,)

    def create(self, request):
        data_set = request.data

        data_set['created_by'] = self.request.user.id
        data_set['modified_by'] = self.request.user.id

        serializer = RateTableSerializer(data=data_set)
        if serializer.is_valid(raise_exception=True):
            self.perform_create(serializer)
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk):
        self_table = request.data

        if self_table['is_active'] == True:
            all_true_tables = RateTable.objects.filter(is_active=True)
            rate_count = Rate.objects.filter(rate_table_id=request.data['id']).count()

            exposed = expose_rate_total(self)
            total_rate_entries_per_table = exposed
            if rate_count == total_rate_entries_per_table:
                for rate_table in all_true_tables:
                    if self != rate_table:
                        rate_table.is_active = False
                        rate_table.save()
                
                self_table['is_active'] = True
                return update_entry(self, request, pk)
            else:
                return Response('You must enter a rate for each of the 210 rate types, zones, expansion areas.', status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            return update_entry(self, request, pk)

class RateViewSet(viewsets.ModelViewSet):
    serializer_class = RateSerializer
    queryset = Rate.objects.all()
    permission_classes = (CanAdminister,)
    filter_backends = (DjangoFilterBackend, filters.SearchFilter,)
    filter_fields = ('rate_table_id__id',)

    def get_queryset(self):
        queryset = Rate.objects.all()

        rate_table = self.request.query_params.get('rate_table_id', None)
        if rate_table is not None:
            queryset = queryset.filter(rate_table_id=rate_table)

        category_set = self.request.query_params.get('category', None)
        if category_set is not None:
            queryset = queryset.filter(category=category_set)

        return queryset.order_by('expansion_area')

    def create(self, request):
        data_set = request.data

        data_set['created_by'] = self.request.user.id
        data_set['modified_by'] = self.request.user.id

        serializer = RateSerializer(data=data_set)
        if serializer.is_valid(raise_exception=True):
            self.perform_create(serializer)
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk):
        return update_entry(self, request, pk)

class FileUploadViewSet(viewsets.ModelViewSet):
    serializer_class = FileUploadSerializer
    queryset = FileUpload.objects.all()

    def get_queryset(self):
        queryset = FileUpload.objects.all()

        file_content_type_string = self.request.query_params.get('file_content_type', None)
        file_object_id = self.request.query_params.get('file_object_id', None)
        
        if file_content_type_string is not None:
            split_content_type = file_content_type_string.split('_')

            if len(split_content_type) == 2:
                content_type_app_label = split_content_type[0]
                content_type_model = split_content_type[1]

                file_content_type = ContentType.objects.get(app_label=content_type_app_label, model=content_type_model)

                query_list = queryset.filter(
                    Q(file_content_type=file_content_type, file_object_id=file_object_id))

                queryset = query_list

        else:
            queryset = queryset

        return queryset.order_by('-date')

class FileUploadCreate(generics.CreateAPIView):
    model = FileUpload
    serializer_class = FileUploadCreateSerializer
    parser_classes = (MultiPartParser, FileUploadParser)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()

    