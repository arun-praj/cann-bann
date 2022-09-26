
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers

from rest_framework.permissions import AllowAny,IsAuthenticated
from CannBann.customPermissions import IsAuthorOrReadOnly
# from django.contrib.auth import authenticate

from .models import UserProfile
from .serializer import UserSerializer

class UserProfileViewSet(viewsets.ViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthorOrReadOnly]

    
    def get_tokens_for_user(self,user):
        refresh = RefreshToken.for_user(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    def list (self,request):
        # print((request.user.id))
        queryset = User.objects.all()
        serializer = UserSerializer(queryset,many=True)
        return Response(serializer.data)

    @action(detail=False,methods=['get'],permission_classes=(IsAuthenticated,))
    def me(self,request):
        print(request.user.id)
        user = get_object_or_404(User,pk = request.user.id)
        return Response(UserSerializer(user).data)


    # @action(detail=False,methods=['post'],permission_classes=(AllowAny,))
    # def login(self,request):

    #     if 'username'  not in request.data:
    #         return Response({'detail':'Username is required'})
    #     if 'password' not in request.data:
    #         return Response({'detail':'Password is required'})
        
    #     user = authenticate(request, username=request.data.get('username'), password=request.data.get('password'))
        
    #     if user is None:
    #         return Response({"error":True,"message":"Username or Password incorrect"})

    #     tokens = self.get_tokens_for_user(user)
    #     userData = {
    #         'id':user.__getattribute__('id'),
    #         'username':user.__getattribute__('username'),
    #         'email':user.__getattribute__('email'),
           

    #     }
    #     userData.update(tokens)
    #     return Response(userData)

    
    @action(detail=False,methods=['post'],permission_classes=(AllowAny,))
    def register(self,request):
        if 'username'  not in request.data:
            return Response({'detail':'Username is required'})
        
        if 'email' not in request.data:
            return Response({'detail':'email is required'})
        
        if 'password' not in request.data:
            return Response({'detail':'Password is required'})
        if 'password2' not in request.data:
            return Response({'detail':'Passwords didnt match'})

        user = User(username =request.data.get('username'),email = request.data.get('email') )

        if(request.data.get('password') != request.data.get('password2')):
            raise serializers.ValidationError({'Password must be same'})
            
        user.set_password(request.data.get('password'))
        user.save()
        userdata = UserSerializer(user).data
        tokens = self.get_tokens_for_user(user)
        userdata.update(tokens)
        return Response(userdata)
    