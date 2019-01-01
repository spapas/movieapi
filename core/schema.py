from .models import Genre, Job, Person, Movie
from graphene import ObjectType, Node, Schema
from graphene_django.fields import DjangoConnectionField
from graphene_django.types import DjangoObjectType

class GenreNode(DjangoObjectType):
    class Meta:
        model = Genre
        interfaces = (Node, )

class JobNode(DjangoObjectType):
    class Meta:
        model = Job
        interfaces = (Node, )
class PersonNode(DjangoObjectType):
    class Meta:
        model = Person
        interfaces = (Node, )
class MovieNode(DjangoObjectType):
    class Meta:
        model = Movie
        interfaces = (Node, )

class Query(ObjectType):
    genre = Node.Field(GenreNode)
    all_genres = DjangoConnectionField(GenreNode)

    job = Node.Field(JobNode)
    all_jobs = DjangoConnectionField(JobNode)
    person = Node.Field(PersonNode)
    all_persons = DjangoConnectionField(PersonNode)
    movie = Node.Field(MovieNode)
    all_movies = DjangoConnectionField(MovieNode)

schema = Schema(query=Query)
