from dataclasses import fields
from rest_framework import serializers
from .models import Board
# from django.contrib.auth.models import User
from column.serializer import ColumnSerializer

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ('id','board_name','board_admins','author','board_members','background_color','is_active','created_at','updated_at')


class BoardWith_Column_Story_Serializer(serializers.ModelSerializer):
    column = ColumnSerializer(many=True,read_only=False,source='board')
    class Meta:
        model = Board
        fields = ('id','board_name','column')
        depth = 2
