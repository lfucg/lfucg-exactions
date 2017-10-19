from django.conf import settings
from django.template.loader import get_template

from django.core.mail import EmailMultiAlternatives
from django.core.mail import mail_admins, send_mail

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

def send_test_email(user):
    html_template = get_template('emails/email_test.html')
    text_template = get_template('emails/email_test.txt')

    subject, from_email = 'LFUCG Exactions: TEST!', settings.DEFAULT_FROM_EMAIL
    to_email = ['jmstewart00@gmail.com', 'kelly@apaxsoftware.com']

    context = {
        'baseURL': settings.BASE_URL,
        'name': 'Nicki',
        'staticURL': 'static/'
    }

    html_content = html_template.render(context)
    text_content = text_template.render(context)

    msg = EmailMultiAlternatives(subject, text_content, from_email, to_email)
    msg.attach_alternative(html_content, "text/html")
    msg.send()

