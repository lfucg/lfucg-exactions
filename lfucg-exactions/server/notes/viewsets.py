from rest_framework import viewsets, status, generics
from django.db.models import Q
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType

from rest_framework.parsers import FileUploadParser, MultiPartParser

from .models import *
from .serializers import *
from plats.models import *
from .permissions import CanAdminister

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
                
        if child_content_type_string is not None:
            split_child_content = child_content_type_string.split('_')

            if len(split_child_content) == 2:
                child_content_type_app_label = split_child_content[0]
                child_content_type_model = split_child_content[1]

                child_content_type = ContentType.objects.get(app_label=child_content_type_app_label, model=child_content_type_model)

                if parent_content_type_string is not None:
                    split_parent_string = parent_content_type_string.split('_')

                    if len(split_parent_string) == 2:
                        parent_content_type_app_label = split_parent_string[0]
                        parent_content_type_model = split_parent_string[1]

                        parent_content_type = ContentType.objects.get(app_label=parent_content_type_app_label, model=parent_content_type_model)

                        if parent_content_type and child_content_type:
                            query_list = queryset.filter(
                                Q(content_type=parent_content_type, object_id=parent_object_id) |
                                Q(content_type=child_content_type, object_id=child_object_id))

                        queryset = query_list

                else:
                    queryset = queryset.filter(content_type=child_content_type, object_id=child_object_id)

        else:
            queryset = queryset

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
        existing_object  = self.get_object()
        setattr(existing_object, 'modified_by', request.user)
        for key, value in request.data.items():
            for existing_object_key, existing_object_value in existing_object.__dict__.items():
                if key == existing_object_key:
                    if value != existing_object_value:
                        setattr(existing_object, existing_object_key, value)
        try:
            existing_object.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class RateViewSet(viewsets.ModelViewSet):
    serializer_class = RateSerializer
    queryset = Rate.objects.all()
    permission_classes = (CanAdminister,)

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
        existing_object  = self.get_object()
        setattr(existing_object, 'modified_by', request.user)
        for key, value in request.data.items():
            for existing_object_key, existing_object_value in existing_object.__dict__.items():
                if key == existing_object_key:
                    if value != existing_object_value:
                        setattr(existing_object, existing_object_key, value)
        try:
            existing_object.save()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

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

    