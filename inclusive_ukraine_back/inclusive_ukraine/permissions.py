from rest_framework.permissions import BasePermission, SAFE_METHODS



class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS
    
    
class IsCreatorOrReadOnly(BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `creator` attribute.
    """
    
    # def has_permission(self, request, view):
    #     if view.action == 'create' and request.user.is_authenticated:
    #         return True
    #     return request.method in SAFE_METHODS

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in SAFE_METHODS:
            return True

        # Instance must have an attribute named `owner`.
        return obj.creator == request.user