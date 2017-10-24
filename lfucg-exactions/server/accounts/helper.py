from django.conf import settings
from django.template.loader import get_template
from rest_framework import viewsets, status, filters
from django.db.models import Q
from django.core.mail import EmailMultiAlternatives
from django.core.mail import mail_admins, send_mail
from django.contrib.auth.models import User, Permission
from postmarker.django import PostmarkEmailMessage

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

def send_email_to_supervisors(pk = None, groups = [], action = ''):

    q_objects = Q()
    for group in groups:
        q_objects.add(Q(groups__name=group), Q.OR)
    users = User.objects.filter(Q(profile__is_supervisor=True), q_objects)

    to_emails = []
    for user in users:
        to_emails.append(user.email)

    html_template = get_template('emails/supervisor_email.html')
    text_template = get_template('emails/supervisor_email.txt')

    subject = 'LFUCG Exactions Activity: Pending Approval - ' + action.title()
    from_email = settings.DEFAULT_FROM_EMAIL

    context = {
        'baseURL': settings.BASE_URL,
        'model': action,
        'staticURL': settings.STATIC_URL,
        'id': pk,
    }

    html_content = html_template.render(context)
    text_content = text_template.render(context)

    msg = EmailMultiAlternatives(subject, text_content, from_email, to_emails)
    msg.attach_alternative(html_content, "text/html")
    msg.send()
