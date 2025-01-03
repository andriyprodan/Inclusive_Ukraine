from django_filters import rest_framework as filters
from rest_framework import mixins, viewsets

from settlements.filters import SettlementFilter

from .models import Settlement
from .serializers import SettlementDetailSerializer, SettlementListSerializer


class SettlementViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Settlement.objects.all()
    serializer_class = SettlementDetailSerializer
    authentication_classes = []
    permission_classes = []

    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = SettlementFilter
    # filterset_fields = {"name": ["icontains"]}

    def get_serializer_class(self, *args, **kwargs):
        if self.action == "list":
            return SettlementListSerializer
        return SettlementDetailSerializer
