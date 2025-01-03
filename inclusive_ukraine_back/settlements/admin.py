from django.contrib import admin

from settlements.models import District, Region, Settlement


@admin.register(Settlement)
class SettlementAdmin(admin.ModelAdmin):
    search_fields = ("name",)

    def has_change_permission(self, request, obj=...):
        return False

    def has_delete_permission(self, request, obj=...):
        return False

    def has_add_permission(self, request):
        return False


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    search_fields = ("name",)

    def has_change_permission(self, request, obj=...):
        return False

    def has_delete_permission(self, request, obj=...):
        return False

    def has_add_permission(self, request):
        return False


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    search_fields = ("name",)

    def has_change_permission(self, request, obj=...):
        return False

    def has_delete_permission(self, request, obj=...):
        return False

    def has_add_permission(self, request):
        return False
