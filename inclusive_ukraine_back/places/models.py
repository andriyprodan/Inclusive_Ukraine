from django.db import models
from django.utils.translation import gettext_lazy as _
from django_google_maps import fields as map_fields
from django.contrib.auth import get_user_model

from settlements.models import District, Settlement

User = get_user_model()

class Place(models.Model):
    name = models.CharField(max_length=255, verbose_name=_("Назва"))
    # latitude = models.FloatField(verbose_name=_('Широта'))
    # longitude = models.FloatField(verbose_name=_('Довгота'))
    description = models.TextField(blank=True, null=True, verbose_name=_("Опис"))
    settlement = models.ForeignKey(
        Settlement,
        on_delete=models.CASCADE,
        related_name="places",
        verbose_name=_("Населений пункт"),
        null=True,
        blank=True,
    )
    # Деякі місця можуть бути за межами населених пунктів
    district = models.ForeignKey(
        District,
        on_delete=models.CASCADE,
        related_name="places",
        verbose_name=_("Район"),
        null=True,
        blank=True,
    )
    
    creator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="places",
        verbose_name=_("Творець"),
    )
    
    is_confirmed = models.BooleanField(default=True, verbose_name=_("Підтверджено"), help_text=_("Підтверджено модератором"))

    address = map_fields.AddressField(max_length=200)
    geolocation = map_fields.GeoLocationField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Місце")
        verbose_name_plural = _("Місця")


class PlacePhoto(models.Model):
    place = models.ForeignKey(
        Place, on_delete=models.CASCADE, related_name="photos", verbose_name=_("Місце")
    )
    photo = models.ImageField(upload_to="places", verbose_name=_("Фото"))

    class Meta:
        verbose_name = _("Фото місця")
        verbose_name_plural = _("Фото місць")
