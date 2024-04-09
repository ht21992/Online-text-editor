# document/urls
from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"docs", views.DocumentViewSet)
router.register(r"versions", views.VersionViewSet)

urlpatterns = [
    path("", include((router.urls, "documents"))),
    path("", include((router.urls, "versions"))),
]
