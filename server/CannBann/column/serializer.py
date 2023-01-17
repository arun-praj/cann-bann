from rest_framework import serializers
from .models import Column
from story.serializer import StorySerializer

class ColumnSerializer(serializers.ModelSerializer):
    stories = StorySerializer(many=True,source='column')
    class Meta:
        model = Column
        fields = ('id','title','position','stories','created_at','updated_at')



