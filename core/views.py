from django.shortcuts import render
from django.views.generic import TemplateView
from rest_framework import routers, serializers, viewsets
from rest_framework.pagination import PageNumberPagination
import core.models
import core.serializers


class SmallPaginator(PageNumberPagination):
    page_size = 10


class MovieViewSet(viewsets.ModelViewSet):
    queryset = core.models.Movie.objects.all()
    serializer_class = core.serializers.MovieSerializer
    pagination_class = SmallPaginator


class JobViewSet(viewsets.ModelViewSet):
    queryset = core.models.Job.objects.all()
    serializer_class = core.serializers.JobSerializer


class GenreViewSet(viewsets.ModelViewSet):
    queryset = core.models.Genre.objects.all()
    serializer_class = core.serializers.GenreSerializer


class PersonViewSet(viewsets.ModelViewSet):
    queryset = core.models.Person.objects.all()
    serializer_class = core.serializers.PersonSerializer
    pagination_class = SmallPaginator


class ImageViewSet(viewsets.ModelViewSet):
    queryset = core.models.Image.objects.all()
    serializer_class = core.serializers.ImageSerializer


class HomeTemplateView(TemplateView):
    template_name = 'home.html'
