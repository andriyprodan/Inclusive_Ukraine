from rest_framework import mixins, viewsets
from django.db.models import Q


from places.permissions import ApprovedPlacesPermission

from .models import Place
from .serializers import PlaceCreateUpdateSerializer, PlaceDetailSerializer, PlaceListSerializer


class PlaceViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet
):
    serializer_class = PlaceDetailSerializer
    # authentication_classes = []
    permission_classes = [ApprovedPlacesPermission]
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            # return confirmed places and places created by the user
            return Place.objects.filter(Q(is_confirmed=True) | Q(creator=self.request.user))
        return Place.objects.filter(is_confirmed=True)
    
    def get_serializer_class(self):
        if self.action in ["create", "update"]:
            return PlaceCreateUpdateSerializer
        if self.action == "list":
            return PlaceListSerializer
        return PlaceDetailSerializer
    

