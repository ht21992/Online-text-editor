# backend/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # path("admin/", admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path("api/users/", include("user.urls")),
    path("api/documents/", include("document.urls")),
]
