from rest_framework import serializers

from .models import District, Region, Settlement

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ('name', 'id')
        

class DistrictSerializer(serializers.ModelSerializer):
    region = RegionSerializer()

    class Meta:
        model = District
        fields = ('name', 'id', 'region')


class SettlementListSerializer(serializers.ModelSerializer):
    district = DistrictSerializer()

    class Meta:
        model = Settlement
        fields = ('name', 'id', 'district')

    
class SettlementDetailSerializer(serializers.ModelSerializer):
    district = DistrictSerializer()

    class Meta:
        model = Settlement
        fields = ('name', 'id', 'district', 'bounds')