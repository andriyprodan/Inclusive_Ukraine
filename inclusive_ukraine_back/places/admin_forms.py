from django import forms

from places.models import Place
from settlements.utils import process_settlement


class PlaceForm(forms.ModelForm):
    # Override the field to make it optional
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["settlement"].required = False
        self.fields["district"].required = False

    def save(self, commit=True):
        instance = super().save(commit=False)

        # create new city using google data if not exists
        lat = instance.geolocation.lat
        lon = instance.geolocation.lon
        settlement, district, address = process_settlement(lat, lon)
        if district is None:
            raise forms.ValidationError(
                f"District processing failed, coordinates: {lat}, {lon}"
            )
        instance.district = district  # district is required
        if settlement:
            instance.settlement = settlement

        if commit:
            instance.save()
        return instance

    class Meta:
        model = Place
        fields = "__all__"
