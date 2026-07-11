"""URL configuration for the {{PROJECT_NAME}} project."""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("accounts.urls")),
    path("payments/", include("payments.urls")),
]
