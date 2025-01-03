from django.contrib import admin
from django_google_maps import fields as map_fields
from django_google_maps import widgets as map_widgets

from places.admin_forms import PlaceForm
from places.models import Settlement, Place, PlacePhoto


class PlacePhotoInline(admin.TabularInline):
    model = PlacePhoto
    extra = 4

@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ('name', 'settlement', 'address')
    search_fields = ('name', 'settlement__name', 'address')
    inlines = (PlacePhotoInline,)
    form = PlaceForm

    formfield_overrides = {
        map_fields.AddressField: {'widget': map_widgets.GoogleMapsAddressWidget},
    }
