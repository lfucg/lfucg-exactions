from django.conf import settings
from django.template.loader import get_template
from django.core.mail import send_mail
from django.db.models import Q, Prefetch
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from builtins import hasattr

from django.contrib.auth.models import User
from plats.models import Plat, Lot, PlatZone
from .models import (
    Account,
    Agreement,
    AccountLedger,
    Payment,
    Profile,
)
from plats.utils import calculate_lot_balance, calculate_plat_balance


def send_password_reset_email(user, token):
    text_template = get_template("emails/password_reset.txt")
    html_template = get_template("emails/password_reset.html")

    context = {
        "user": user,
        "baseURL": settings.SITE_DOMAIN,
        "uid": user.id,
        "token": token,
    }

    text_content = text_template.render(context)
    html_content = html_template.render(context)

    subject, from_email = "LFUCG Exactions: Password Reset", settings.DEFAULT_FROM_EMAIL

    send_mail(
        subject,
        text_content,
        from_email,
        [user.email],
        html_message=html_content,
    )


def send_lost_username_email(user):
    text_template = get_template("emails/forgot_username.txt")
    html_template = get_template("emails/forgot_username.html")

    subject, from_email = "LFUCG Exactions: Username", settings.DEFAULT_FROM_EMAIL

    context = {
        "user": user,
        "baseURL": settings.SITE_DOMAIN,
    }

    text_content = text_template.render(context)
    html_content = html_template.render(context)

    send_mail(
        subject,
        text_content,
        from_email,
        [user.email],
        html_message=html_content,
    )


@receiver(post_save, sender=User)
def send_email_to_new_user(sender, instance, created, **kwargs):
    if created:
        user = instance
        token = PasswordResetTokenGenerator().make_token(user)

        text_template = get_template("emails/password_reset.txt")
        html_template = get_template("emails/password_reset.html")

        subject, from_email = (
            "LFUCG Exactions: Password Reset",
            settings.DEFAULT_FROM_EMAIL,
        )

        context = {
            "user": user,
            "baseURL": settings.SITE_DOMAIN,
            "uid": user.id,
            "token": token,
        }

        text_content = text_template.render(context)
        html_content = html_template.render(context)

        send_mail(
            subject,
            text_content,
            from_email,
            [user.email],
            html_message=html_content,
        )


@receiver(post_save, sender=Lot)
def lot_update_exactions_and_email_supervisor(sender, instance, **kwargs):
    post_save.disconnect(lot_update_exactions_and_email_supervisor, sender=Lot)
    related_lot = Lot.objects.get(id=instance.id)

    all_attributes = [
        "current_dues_roads_dev",
        "current_dues_roads_own",
        "current_dues_sewer_trans_dev",
        "current_dues_sewer_trans_own",
        "current_dues_sewer_cap_dev",
        "current_dues_sewer_cap_own",
        "current_dues_parks_dev",
        "current_dues_parks_own",
        "current_dues_storm_dev",
        "current_dues_storm_own",
        "current_dues_open_space_dev",
        "current_dues_open_space_own",
        "is_approved"
    ]

    if instance.modified_by.is_superuser or (
        (
            hasattr(instance.modified_by, "profile")
            and instance.modified_by.profile.is_supervisor == True
        )
    ):
        related_lot.is_approved = True

        users = User.objects.filter(
            Q(profile__is_supervisor=True) & Q(groups__name="Planning")
        )

        for user in users:
            profile = Profile.objects.filter(user=user).first()
            profile.is_approval_required = False
            profile.save()
    elif hasattr(related_lot, "is_approved") and (not related_lot.is_approved):
        return
    elif kwargs["update_fields"] is not None and any(
        hasattr(kwargs["update_fields"], attr) for attr in all_attributes
    ):
        return
    else:
        ctype = ContentType.objects.get_for_model(instance)
        model = ctype.model
        users = User.objects.filter(
            Q(profile__is_supervisor=True) & Q(groups__name="Planning")
        )

        for user in users:
            profile = Profile.objects.filter(user=user).first()
            if (
                hasattr(profile, "is_approval_required")
                and not profile.is_approval_required
            ):
                profile.is_approval_required = True
                profile.save()

                to_emails = list(users.values_list("email", flat=True))

                html_template = get_template("emails/supervisor_email.html")
                text_template = get_template("emails/supervisor_email.txt")

                subject = "LFUCG Exactions Activity: New Entry Pending Approval"
                from_email = settings.DEFAULT_FROM_EMAIL

                context = {
                    "baseURL": settings.SITE_DOMAIN,
                    "model": model,
                    "staticURL": settings.STATIC_URL,
                    "id": instance.id,
                }

                html_content = html_template.render(context)
                text_content = text_template.render(context)

                send_mail(
                    subject,
                    text_content,
                    from_email,
                    [user.email],
                    html_message=html_content,
                )

        related_lot.is_approved = False

    if related_lot is not None:
        if (
            kwargs["update_fields"] is not None
            and set(list(kwargs["update_fields"])).intersection(all_attributes)
        ):
            lot_balances = calculate_lot_balance(related_lot)

            related_lot.current_dues_roads_dev = lot_balances["dues_roads_dev"]
            related_lot.current_dues_roads_own = lot_balances["dues_roads_own"]
            related_lot.current_dues_sewer_trans_dev = lot_balances[
                "dues_sewer_trans_dev"
            ]
            related_lot.current_dues_sewer_trans_own = lot_balances[
                "dues_sewer_trans_own"
            ]
            related_lot.current_dues_sewer_cap_dev = lot_balances["dues_sewer_cap_dev"]
            related_lot.current_dues_sewer_cap_own = lot_balances["dues_sewer_cap_own"]
            related_lot.current_dues_parks_dev = lot_balances["dues_parks_dev"]
            related_lot.current_dues_parks_own = lot_balances["dues_parks_own"]
            related_lot.current_dues_storm_dev = lot_balances["dues_storm_dev"]
            related_lot.current_dues_storm_own = lot_balances["dues_storm_own"]
            related_lot.current_dues_open_space_dev = lot_balances[
                "dues_open_space_dev"
            ]
            related_lot.current_dues_open_space_own = lot_balances[
                "dues_open_space_own"
            ]

        related_lot.save()

    post_save.connect(lot_update_exactions_and_email_supervisor, sender=Lot)


@receiver(post_save, sender=Agreement)
@receiver(post_save, sender=AccountLedger)
@receiver(post_save, sender=Payment)
def send_email_to_finance_supervisors(sender, instance, **kwargs):
    ctype = ContentType.objects.get_for_model(instance)
    model = ctype.model

    sender = None
    sender_model = None

    if model == "agreement":
        sender = Agreement
        sender_model = Agreement.objects.get(id=instance.id)
    elif model == "accountledger":
        sender = AccountLedger
        sender_model = AccountLedger.objects.get(id=instance.id)
    elif model == "payment":
        sender = Payment
        sender_model = Payment.objects.get(id=instance.id)

    post_save.disconnect(send_email_to_finance_supervisors, sender=sender)

    if instance.modified_by.is_superuser or (
        (
            hasattr(instance.modified_by, "profile")
            and instance.modified_by.profile.is_supervisor == True
        )
    ):
        instance.is_approved = True
        users = User.objects.filter(
            Q(profile__is_supervisor=True) & Q(groups__name="Finance")
        )

        for user in users:
            profile = Profile.objects.filter(user=user).first()
            profile.is_approval_required = False
            profile.save()
    else:
        ctype = ContentType.objects.get_for_model(instance)
        model = ctype.model

        if ctype.model == "accountledger":
            model = "credit-transfer"

        users = User.objects.filter(
            Q(profile__is_supervisor=True) & Q(groups__name="Finance")
        )

        for user in users:
            profile = Profile.objects.filter(user=user).first()
            if (
                hasattr(profile, "is_approval_required")
                and not profile.is_approval_required
            ):
                profile.is_approval_required = True
                profile.save()

                to_emails = list(users.values_list("email", flat=True))

                html_template = get_template("emails/supervisor_email.html")
                text_template = get_template("emails/supervisor_email.txt")

                subject = "LFUCG Exactions Activity: New Entry Pending Approval"
                from_email = settings.DEFAULT_FROM_EMAIL

                context = {
                    "baseURL": settings.SITE_DOMAIN,
                    "model": model,
                    "staticURL": settings.STATIC_URL,
                    "id": instance.id,
                }

                html_content = html_template.render(context)
                text_content = text_template.render(context)

                send_mail(
                    subject,
                    text_content,
                    from_email,
                    [user.email],
                    html_message=html_content,
                )

        instance.is_approved = False
    sender_model.is_approved = instance.is_approved
    sender_model.save()

    post_save.connect(send_email_to_finance_supervisors, sender=sender)


@receiver(post_save, sender=Plat)
def send_email_to_planning_supervisors(sender, instance, **kwargs):
    post_save.disconnect(send_email_to_planning_supervisors, sender=Plat)
    plat = Plat.objects.get(id=instance.id)

    if instance.modified_by.is_superuser or (
        (
            hasattr(instance.modified_by, "profile")
            and instance.modified_by.profile.is_supervisor == True
        )
    ):
        instance.is_approved = True
        users = User.objects.filter(
            Q(profile__is_supervisor=True) & Q(groups__name="Planning")
        )

        for user in users:
            profile = Profile.objects.filter(user=user).first()
            profile.is_approval_required = False
            profile.save()
    elif hasattr(plat, "is_approved") and (not plat.is_approved):
        return
    else:
        ctype = ContentType.objects.get_for_model(instance)
        model = ctype.model
        users = User.objects.filter(
            Q(profile__is_supervisor=True) & Q(groups__name="Planning")
        )

        for user in users:
            profile = Profile.objects.filter(user=user).first()
            if (
                hasattr(profile, "is_approval_required")
                and not profile.is_approval_required
            ):
                profile.is_approval_required = True
                profile.save()

                to_emails = list(users.values_list("email", flat=True))

                html_template = get_template("emails/supervisor_email.html")
                text_template = get_template("emails/supervisor_email.txt")

                subject = "LFUCG Exactions Activity: New Entry Pending Approval"
                from_email = settings.DEFAULT_FROM_EMAIL

                context = {
                    "baseURL": settings.SITE_DOMAIN,
                    "model": model,
                    "staticURL": settings.STATIC_URL,
                    "id": instance.id,
                }

                html_content = html_template.render(context)
                text_content = text_template.render(context)

                send_mail(
                    subject,
                    text_content,
                    from_email,
                    [user.email],
                    html_message=html_content,
                )

        instance.is_approved = False

    plat.is_approved = instance.is_approved
    plat.save()
    post_save.connect(send_email_to_planning_supervisors, sender=Plat)


@receiver(post_save, sender=Plat)
def calculate_current_plat_balance(sender, instance, **kwargs):
    related_plat = None
    post_save.disconnect(calculate_current_plat_balance, sender=Plat)

    try:
        if sender.__name__ == "Plat":
            related_plat = Plat.objects.filter(id=instance.id).prefetch_related(
                Prefetch(
                    "plat_zone",
                    queryset=PlatZone.objects.exclude(is_active=False),
                )
            )

        if related_plat:
            first_plat = related_plat.first()

            plat = first_plat
            plat_balances = calculate_plat_balance(plat)

            first_plat.current_sewer_due = plat_balances["plat_sewer_due"]
            first_plat.current_non_sewer_due = plat_balances["plat_non_sewer_due"]
            first_plat.modified_by = instance.modified_by

            plat.save(
                update_fields=[
                    "current_sewer_due",
                    "current_non_sewer_due",
                    "modified_by",
                ]
            )

    except Exception as exc:
        print("EXCEPTION calculate_current_plat_balance", exc)

    post_save.connect(calculate_current_plat_balance, sender=Plat)


@receiver(post_save, sender=Payment)
@receiver(post_save, sender=AccountLedger)
def calculate_current_lot_balance(sender, instance, **kwargs):
    related_lot = None
    post_save.disconnect(calculate_current_lot_balance, sender=AccountLedger)
    post_save.disconnect(calculate_current_lot_balance, sender=Payment)

    try:
        if sender.__name__ == "Payment":
            related_lot = Lot.objects.filter(id=instance.lot_id_id).prefetch_related(
                "plat",
                Prefetch(
                    "payment",
                    queryset=Payment.objects.exclude(is_active=False),
                ),
                Prefetch(
                    "ledger_lot",
                    queryset=AccountLedger.objects.exclude(is_active=False).filter(
                        entry_type="USE"
                    ),
                ),
            )
        elif sender.__name__ == "AccountLedger":
            related_lot = Lot.objects.filter(id=instance.lot_id).prefetch_related(
                "plat",
                Prefetch(
                    "payment",
                    queryset=Payment.objects.exclude(is_active=False),
                ),
                Prefetch(
                    "ledger_lot",
                    queryset=AccountLedger.objects.exclude(is_active=False).filter(
                        entry_type="USE"
                    ),
                ),
            )

        if related_lot:
            first_lot = related_lot.first()
            related_plat = first_lot.plat if hasattr(first_lot, "plat") else None

            if related_plat:
                plat = related_plat
                plat_balances = calculate_plat_balance(plat)

                plat.current_sewer_due = plat_balances["plat_sewer_due"]
                plat.current_non_sewer_due = plat_balances["plat_non_sewer_due"]

                super(Plat, plat).save()

            lot_balances = calculate_lot_balance(first_lot)

            first_lot.current_dues_roads_dev = lot_balances["dues_roads_dev"]
            first_lot.current_dues_roads_own = lot_balances["dues_roads_own"]
            first_lot.current_dues_sewer_trans_dev = lot_balances[
                "dues_sewer_trans_dev"
            ]
            first_lot.current_dues_sewer_trans_own = lot_balances[
                "dues_sewer_trans_own"
            ]
            first_lot.current_dues_sewer_cap_dev = lot_balances["dues_sewer_cap_dev"]
            first_lot.current_dues_sewer_cap_own = lot_balances["dues_sewer_cap_own"]
            first_lot.current_dues_parks_dev = lot_balances["dues_parks_dev"]
            first_lot.current_dues_parks_own = lot_balances["dues_parks_own"]
            first_lot.current_dues_storm_dev = lot_balances["dues_storm_dev"]
            first_lot.current_dues_storm_own = lot_balances["dues_storm_own"]
            first_lot.current_dues_open_space_dev = lot_balances["dues_open_space_dev"]
            first_lot.current_dues_open_space_own = lot_balances["dues_open_space_own"]
            first_lot.modified_by = instance.modified_by

            first_lot.save(
                update_fields=[
                    "current_dues_roads_dev",
                    "current_dues_roads_own",
                    "current_dues_sewer_trans_dev",
                    "current_dues_sewer_trans_own",
                    "current_dues_sewer_cap_dev",
                    "current_dues_sewer_cap_own",
                    "current_dues_parks_dev",
                    "current_dues_parks_own",
                    "current_dues_storm_dev",
                    "current_dues_storm_own",
                    "current_dues_open_space_dev",
                    "current_dues_open_space_own",
                    "modified_by",
                ]
            )
    except Exception as exc:
        print("EXCEPTION", exc)

    post_save.connect(calculate_current_lot_balance, sender=AccountLedger)
    post_save.connect(calculate_current_lot_balance, sender=Payment)


@receiver(post_save, sender=AccountLedger)
def calculate_current_account_balance(sender, instance, **kwargs):
    post_save.disconnect(calculate_current_account_balance, sender=AccountLedger)

    account_to = None
    account_from = None
    non_sewer_credits = instance.non_sewer_credits if instance.non_sewer_credits else 0
    sewer_credits = instance.sewer_credits if instance.sewer_credits else 0

    if instance.account_to is not None:
        account_to = Account.objects.filter(id=instance.account_to.id).first()

    if instance.account_from is not None:
        account_from = Account.objects.filter(id=instance.account_from.id).first()

    if account_to is not None:
        account_to.current_account_balance += non_sewer_credits + sewer_credits
        account_to.current_non_sewer_balance += non_sewer_credits
        account_to.current_sewer_balance += sewer_credits

        super(Account, account_to).save()

    if account_from is not None:
        account_from.current_account_balance -= non_sewer_credits + sewer_credits
        account_from.current_non_sewer_balance -= non_sewer_credits
        account_from.current_sewer_balance -= sewer_credits

        super(Account, account_from).save()

    post_save.connect(calculate_current_account_balance, sender=AccountLedger)
