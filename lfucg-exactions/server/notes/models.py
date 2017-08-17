from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from storages.backends.s3boto import S3BotoStorage

from django.contrib.auth.models import User

from simple_history.models import HistoricalRecords

# class MediaRootS3BotoStorage(S3BotoStorage):
#     location = 'media'

class Note(models.Model):
    is_active = models.BooleanField(default=True)

    user = models.ForeignKey(User, related_name='note')

    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    note = models.TextField()
    date = models.DateTimeField(auto_now=True)

    history = HistoricalRecords()

    def __str__(self):
        return self.note

class RateTable(models.Model):
    is_active = models.BooleanField(default=True)

    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='rate_table_created')
    modified_by = models.ForeignKey(User, related_name='rate_table_modified')

    begin_effective_date = models.DateField()
    end_effective_date = models.DateField()

    resolution_number = models.CharField(max_length=200)

    history = HistoricalRecords()

    def __str__(self):
        return self.resolution_number

class Rate(models.Model):
    is_active = models.BooleanField(default=True)
    
    ZONES = (
        ('EAR-1', 'EAR-1'),
        ('EAR1-SRA', 'EAR1-SRA'),
        ('EAR-2', 'EAR-2'),
        ('EAR-3', 'EAR-3'),
        ('CC(RES)', 'CC(RES)'),
        ('CC(NONR)', 'CC(NONR)'),
        ('ED', 'ED'),
    )

    CATEGORIES = (
        ('ROADS', 'Roads'),
        ('OPEN_SPACE', 'Open Space'),
        ('SEWER_CAP', 'Sewer Capacity'),
        ('SEWER_TRANS', 'Sewer Trans.'),
        ('PARK', 'Park'),
        ('STORM_WATER', 'Storm Water'),
    )

    EXPANSION_AREAS = (
        ('EA-1', 'EA-1'),
        ('EA-2A', 'EA-2A'),
        ('EA-2B', 'EA-2B'),
        ('EA-2C', 'EA-2C'),
        ('EA-3', 'EA-3'),
    )

    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    created_by = models.ForeignKey(User, related_name='rate_created')
    modified_by = models.ForeignKey(User, related_name='rate_modified')

    rate_table_id = models.ForeignKey(RateTable, related_name='rate')

    expansion_area = models.CharField(max_length=100, choices=EXPANSION_AREAS)
    zone = models.CharField(max_length=100, choices=ZONES)
    category = models.CharField(max_length=100, choices=CATEGORIES)
    rate = models.DecimalField(max_digits=20, decimal_places=2)

    history = HistoricalRecords()

    def __str__(self):
        return self.zone + ': ' + self.category

def model_directory_path(instance, filename):
    instance_name = str(type(instance.file_content_object).__name__)

    return '{0}/{1}'.format(instance_name, filename)

class FileUpload(models.Model):
    upload = models.FileField(upload_to=model_directory_path)
    date = models.DateTimeField(auto_now=True)

    file_content_type = models.ForeignKey(ContentType)
    file_object_id = models.PositiveIntegerField()
    file_content_object = GenericForeignKey('file_content_type', 'file_object_id')

    def __str__(self):
        return str(self.upload)

    def save(self, *args, **kwargs):
        print('MODEL SAVE')
        print('MODEL SAVE SELF', self)
        super(FileUpload, self).save(*args, **kwargs)
        self.create_file_image()

    def create_file_image(self):
        from django.core.files.storage import default_storage
        print('MODEL CONTENT TYPE', self.file_content_type)
        print('MODEL SELF UPLOAD', self.upload)
        print('MODEL DIR UPLOAD', dir(self.upload))
        print('MODEL UPLOAD FILE', self.upload.file)
        print('MODEL UPLOAD PATH', self.upload.path)
    #     f = default_storage.open(self.upload.path, 'r')
    #     # image = Image.open(f)
    #     print('MODEL F READ', f.read())
    #     print('MODEL OPEN F DIR', dir(f))
    #     # f.save()
    #     # f.close()

