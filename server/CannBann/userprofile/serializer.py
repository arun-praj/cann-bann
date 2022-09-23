from rest_framework import serializers
from userprofile.models import UserProfile
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','last_login','is_superuser','username','is_staff','is_active','date_joined')


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False,read_only=False)
    class Meta:
        model=UserProfile
        fields=['id','email','user']
        
