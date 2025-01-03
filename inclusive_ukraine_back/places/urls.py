from rest_framework.routers import DefaultRouter

from .views import PlaceViewSet

router = DefaultRouter()
router.register(r"", PlaceViewSet, basename="place")

urlpatterns = router.urls
