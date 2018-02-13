from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include

from django.conf import settings
from django.conf.urls.static import static

from rest_framework import routers
import core.views

router = routers.DefaultRouter()
router.register(r'movies', core.views.MovieViewSet)
router.register(r'persons', core.views.PersonViewSet)
router.register(r'jobs', core.views.JobViewSet)
router.register(r'genres', core.views.GenreViewSet)
router.register(r'images', core.views.ImageViewSet)

urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('admin/', admin.site.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)