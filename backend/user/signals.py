from django.db.models.signals import post_save, pre_delete
from .models import Profile
from django.dispatch import receiver
from django.conf import settings

User = settings.AUTH_USER_MODEL


@receiver(post_save, sender=User)
def post_save_create_profile(sender, instance, created, **kwargs):
    """
    Summary:
            This function is responsible to create a user profile whenever a new
            user has been created
    """
    if created and not Profile.objects.filter(user=instance).exists():
        Profile.objects.create(user=instance)
