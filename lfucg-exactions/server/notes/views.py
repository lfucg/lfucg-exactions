from django.shortcuts import render
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import FormParser, FileUploadParser, MultiPartParser

from django.contrib.contenttypes.models import ContentType
from .models import FileUpload
from plats.models import *
from .serializers import FileUploadSerializer

class FileUploadView(APIView):
    parser_classes = (FormParser, FileUploadParser, MultiPartParser)

    def post(self, request, filename, format=None):
        print('VIEW REQUEST ', request)
        # print('VIEW DIR REQUEST', dir(request))
        print('VIEW REQUEST DATA', self.request.data.get('file_content_type'))
        print('VIEW REQUEST DATA FILE', request.data['file'])
        print('VIEW REQUEST DATA FILE NAME', request.data['file'].name)
        print('VIEW REQUEST DATA FILE CONTENT', request.data['file'].content_type)
        print('VIEW REQUEST DIR DATA FILE', dir(request.data['file']))
        print('VIEW REQUEST DATA CONTENT TYPE', request.query_params.get('upload', None))
        print('VIEW REQUEST DIR DATA', dir(request.data))
        # print('VIEW SELF', self)
        print('VIEW DIR SELF', dir(self))
        print('VIEW SELF PARSER CLASSES', self.parser_classes)
        print('VIEW FILENAME', filename)
        my_file = request.data['file']
        # file_obj.open()
        # file_obj.read()
        # with open(filename, 'wb+') as temp_file:
        #     for chunk in my_file.chunks():
        #         temp_file.write(chunk)

        # my_saved_file = open(filename)
        print('VIEW FILENAME', filename)
        # print('MY SAVED FILE', my_saved_file)
        # print('DIR MY SAVED FILE', dir(my_saved_file))
        # ...
        # do some stuff with uploaded file
        # ...
        content_type = ContentType.objects.get_for_model(Subdivision)
        new_upload = FileUpload.objects.create(
            upload=my_file,
            file_content_type=content_type,
            file_object_id=1,
        )
        # upload_serializer = FileUploadSerializer(context = {
        #     'upload': request.data['file'],
        #     'file_content_type': file_content_type,
        #     'file_object_id': 20,
        # }).data

        # print('SERIALIZED', upload_serializer)

        return Response(status=204)
