from django.shortcuts import render
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from CannBann.customPermissions import IsAuthorOrReadOnly
from board.models import Board


from .models import Column

class ColumnViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated,IsAuthorOrReadOnly]
    queryset = Board.objects.filter(is_active=True)

    def list(self,request):
        columns = Column.objects.filter(board=16)
        print(columns)
        return Response()


