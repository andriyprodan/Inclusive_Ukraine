from inclusive_ukraine.permissions import IsCreatorOrReadOnly


class ApprovedPlacesPermission(IsCreatorOrReadOnly):
    def has_object_permission(self, request, view, obj):
        # if the place is already confirmed, creator can't edit it
        return ((not obj.is_confirmed) and super().has_object_permission(request, view, obj)) or obj.is_confirmed
