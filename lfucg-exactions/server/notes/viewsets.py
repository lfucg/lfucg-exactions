from rest_framework import viewsets
from django.db.models import Q
from django.contrib.contenttypes.models import ContentType

from rest_framework.mixins import (CreateModelMixin,
                   DestroyModelMixin,
                   RetrieveModelMixin,
                   UpdateModelMixin,
                   ListModelMixin)

from rest_framework.parsers import FormParser, FileUploadParser, MultiPartParser

from .models import *
from .serializers import *
from plats.models import Plat, Lot

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    queryset = Note.objects.all()

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

class RateViewSet(viewsets.ModelViewSet):
    serializer_class = RateSerializer
    queryset = Rate.objects.all()

class FileUploadViewSet(viewsets.ModelViewSet):
    serializer_class = FileUploadSerializer
    queryset = FileUpload.objects.all()
    parser_classes = (FileUploadParser, MultiPartParser)

    def get_queryset(self):
        queryset = FileUpload.objects.all()

        file_content_type_string = self.request.query_params.get('file_content_type', None)
        file_object_id = self.request.query_params.get('file_object_id', None)
                
        if file_content_type_string is not None:
            if file_content_type_string == 'Plat':
                file_content_type = ContentType.objects.get_for_model(Plat)
            elif file_content_type_string == 'Lot':
                file_content_type = ContentType.objects.get_for_model(Lot)

            query_list = queryset.filter(
                Q(file_content_type=file_content_type, file_object_id=file_object_id))

            queryset = query_list

        else:
            queryset = queryset

        return queryset.order_by('-date')

    # def get_object(self):
    #     print('GET OBJECT SELF', self)

    # def post(self, request, filename, format=None):
    #     print('VIEW REQUEST ', request)
    #     # print('VIEW DIR REQUEST', dir(request))
    #     print('VIEW REQUEST DATA', self.request.data.get('file_content_type'))
    #     print('VIEW REQUEST DATA FILE', request.data['file'])
    #     # print('VIEW REQUEST DATA CONTENT TYPE', request.query_params.get('upload', None))
    #     # print('VIEW REQUEST DIR DATA', dir(request.data))
    #     print('VIEW SELF', self)
    #     print('VIEW DIR SELF', dir(self))
    #     file_obj = request.data['file']
    #     # ...
    #     # do some stuff with uploaded file
    #     # ...
    #     content_type = ContentType.objects.get_for_model(Plat)
    #     new_upload = FileUpload.objects.create(
    #         upload=request.data['file'],
    #         file_content_type=content_type,
    #         file_object_id=20,
    #     )
        # upload_serializer = FileUploadSerializer(context = {
        #     'upload': request.data['file'],
        #     'file_content_type': file_content_type,
        #     'file_object_id': 20,
        # }).data

        # print('SERIALIZED', upload_serializer)

        return Response(status=204)
    