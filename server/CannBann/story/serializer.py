from rest_framework import serializers
from .models import Story,Label


class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ('id','color','title')


class StorySerializer(serializers.ModelSerializer):
    labels = LabelSerializer(many=True,read_only=False)
    class Meta:
        model = Story
        fields = ('id','description','position','column','author','assignee','priority','title','labels','created_at','updated_at')



