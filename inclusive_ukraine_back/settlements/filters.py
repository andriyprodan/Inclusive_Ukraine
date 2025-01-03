from django_filters import rest_framework as filters
from django.db.models import Q

from settlements.models import Settlement


class SettlementFilter(filters.FilterSet):
    full_name = filters.CharFilter(method="filter_full_name")

    def filter_full_name(self, queryset, name, value):
        return queryset.filter(Q(name__icontains=value) | Q(district__name__icontains=value) | Q(district__region__name__icontains=value))
    

    class Meta:
        model = Settlement
        fields = ["full_name"]