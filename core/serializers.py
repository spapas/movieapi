from rest_framework import serializers
import core.models

class MovieSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = core.models.Movie
        fields = '__all__'
        # fields = ('url', 'username', 'email', 'is_staff')


class GenreSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = core.models.Genre
        fields = '__all__'


class JobSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = core.models.Job
        fields = '__all__'


class PersonSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = core.models.Person
        fields = '__all__'


class ImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = core.models.Image
        fields = '__all__'
