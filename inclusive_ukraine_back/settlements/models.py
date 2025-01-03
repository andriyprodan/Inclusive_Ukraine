from django.db import models
from django.utils.translation import gettext_lazy as _


class Region(models.Model):
    name = models.CharField(max_length=255, verbose_name=_("Назва"), unique=True)

    class Meta:
        verbose_name = _("Область")
        verbose_name_plural = _("Області")

    def __str__(self):
        return self.name


class District(models.Model):
    # Деякі місця можуть бути за межами населених пунктів
    name = models.CharField(max_length=255, verbose_name=_("Назва"))
    region = models.ForeignKey(
        Region,
        on_delete=models.CASCADE,
        related_name="districts",
        verbose_name=_("Область"),
    )
    bounds = models.JSONField(verbose_name=_("Межі району"), null=True, blank=True)

    class Meta:
        verbose_name = _("Район")
        verbose_name_plural = _("Райони")
        unique_together = ("name", "region")

    def __str__(self):
        return f"{self.name}, {self.region.name}"


class Settlement(models.Model):
    name = models.CharField(max_length=255, verbose_name=_("Назва"))
    district = models.ForeignKey(
        District,
        on_delete=models.CASCADE,
        related_name="settlements",
        verbose_name=_("Район"),
        null=True,
        blank=True,
    )
    region = models.ForeignKey(
        Region,
        on_delete=models.CASCADE,
        related_name="settlements",
        verbose_name=_("Область"),
        null=True,
        blank=True,
    )
    bounds = models.JSONField(verbose_name=_("Межі населеного пункту"), null=True, blank=True)

    # google_id = models.CharField(max_length=255, verbose_name=_('Google ID'), unique=True)

    class Meta:
        verbose_name = _("Населений пункт")
        verbose_name_plural = _("Населені пункти")
        unique_together = ("name", "district", "region")

    def __str__(self):
        name = self.name
        if self.district:
            name += f", {self.district.name}"
        if self.district and self.district.region:
            name += f", {self.district.region.name}"
        return name


# class SettlementDistrict(models.Model):
# Наприклад, райони Києва
# TODO
# pass
