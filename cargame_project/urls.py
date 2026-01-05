"""
URL configuration for cargame_project project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('game.urls')),
]

# এই অংশটা যোগ কর – development-এ তোর game/static ফোল্ডার থেকে static files serve করবে
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])