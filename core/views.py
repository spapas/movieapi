from django.shortcuts import render
from django.views.generic import TemplateView
from rest_framework import routers, serializers, viewsets
import core.models
import core.serializers


class MovieViewSet(viewsets.ModelViewSet):
    queryset = core.models.Movie.objects.all()
    serializer_class = core.serializers.MovieSerializer


class JobViewSet(viewsets.ModelViewSet):
    queryset = core.models.Job.objects.all()
    serializer_class = core.serializers.JobSerializer


class GenreViewSet(viewsets.ModelViewSet):
    queryset = core.models.Genre.objects.all()
    serializer_class = core.serializers.GenreSerializer


class PersonViewSet(viewsets.ModelViewSet):
    queryset = core.models.Person.objects.all()
    serializer_class = core.serializers.PersonSerializer


class ImageViewSet(viewsets.ModelViewSet):
    queryset = core.models.Image.objects.all()
    serializer_class = core.serializers.ImageSerializer


class HomeTemplateView(TemplateView):
    template_name = 'home.html'
