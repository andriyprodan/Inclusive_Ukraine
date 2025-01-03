from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class SettlementsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'settlements'
    verbose_name = _("Населені пункти")