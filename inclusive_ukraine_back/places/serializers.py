from os import read
from rest_framework import serializers

from settlements.utils import process_settlement

from .models import Place, PlacePhoto


class PlaceBaseSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        lat, lng = data["geolocation"].split(",")
        data["lat"] = lat
        data["lng"] = lng
        data['creator_id'] = instance.creator.id
        data['is_confirmed'] = instance.is_confirmed
        return data



class PlacePhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacePhoto
        fields = ("photo",)


class PlaceListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Place
        fields = ("geolocation", "id", "creator_id", "is_confirmed")


class PlaceDetailSerializer(PlaceBaseSerializer):
    photos = PlacePhotoSerializer(many=True)

    class Meta:
        model = Place
        fields = "__all__"


class PlaceCreateUpdateSerializer(PlaceBaseSerializer):
    photos = serializers.ListField(
        child=serializers.ImageField(), write_only=True
    )
    lat = serializers.FloatField(write_only=True)
    lng = serializers.FloatField(write_only=True)

    def create(self, validated_data):
        photos = validated_data.pop("photos")
        lat = validated_data.pop("lat")
        lng = validated_data.pop("lng")
        geolocation = f'{lat},{lng}'
        settlement, district, address = process_settlement(lat, lng)
        creator = self.context["request"].user
        place = Place.objects.create(**validated_data, geolocation=geolocation, district=district, settlement=settlement, address=address, creator=creator, is_confirmed=False)
        for photo in photos:
            PlacePhoto.objects.create(place=place, photo=photo)
        return place
    
    def update(self, instance, validated_data):
        photos = validated_data.pop("photos")
        lat = validated_data.pop("lat")
        lng = validated_data.pop("lng")
        geolocation = f'{lat},{lng}'
        instance.geolocation = geolocation
        PlacePhoto.objects.filter(place=instance).delete()
        for photo in photos:
            PlacePhoto.objects.create(place=instance, photo=photo)
        return super().update(instance, validated_data)

    class Meta:
        model = Place
        fields = ('name', 'photos', 'lat', 'lng', 'geolocation', 'id')
        read_only_fields = ('geolocation', 'is_confirmed', 'creator')
