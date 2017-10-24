from django.conf import settings
from django.template.loader import get_template
from rest_framework import viewsets, status, filters
from django.db.models import Q
from django.core.mail import EmailMultiAlternatives
from django.contrib.auth.models import User

from django.db.models.signals import pre_save
from django.dispatch import receiver
from plats.models import *
from .models import *

def send_password_reset_email(user):
    text_template = get_template('emails/password_reset.txt')
    html_template = get_template('emails/password_reset.html')

    subject, from_email = 'LFUCG Exactions: Password Reset', settings.DEFAULT_FROM_EMAIL

    context = {
        'user': user,
        'baseURL': settings.BASE_URL,
    }

    text_content = text_template.render(context)
    html_content = html_template.render(context)

    msg = EmailMultiAlternatives(subject, text_content, from_email, [user.email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()

def send_lost_username_email(user):
    text_template = get_template('emails/forgot_username.txt')
    html_template = get_template('emails/forgot_username.html')

    subject, from_email = 'LFUCG Exactions: Username', settings.DEFAULT_FROM_EMAIL

    context = {
        'user': user,
        'baseURL': settings.BASE_URL,
    }

    text_content = text_template.render(context)
    html_content = html_template.render(context)

    msg = EmailMultiAlternatives(subject, text_content, from_email, [user.email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()

@receiver(pre_save, sender=Agreement)
@receiver(pre_save, sender=AccountLedger)
@receiver(pre_save, sender=Payment)
@receiver(pre_save, sender=Project)
@receiver(pre_save, sender=ProjectCostEstimate)
@receiver(pre_save, sender=Plat)
@receiver(pre_save, sender=Lot)
def set_approval(sender, instance, **kwargs):
    if instance.modified_by.is_superuser == True or (hasattr(instance.modified_by, 'profile') and instance.modified_by.profile.is_supervisor == True):
        instance.is_approved = True
    else:
        instance.is_approved = False
    return instance
