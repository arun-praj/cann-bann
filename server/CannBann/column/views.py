from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist

from rest_framework.permissions import AllowAny,IsAuthenticated
from CannBann.customPermissions import IsAuthorOrReadOnly

from board.models import Board
from .models import Column
from .serializer import ColumnSerializer




def get_latest_position(Model ,belongs_to):
    try:
        latest_position = Model.objects.filter(board=belongs_to).latest('position').position
    except ObjectDoesNotExist:
        return 0
   
    return latest_position + 1
   

class ColumnViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated,IsAuthorOrReadOnly]
    queryset = Board.objects.filter(is_active=True)

    # def list(self,request):
    #     columns = Column.objects.filter(board=16)
    #     print(columns)
    #     return Response()


    def create(self,request):
       board_obj =  get_object_or_404(Board,id=request.data.get('board_id'))

       comment_qs = Column(board = board_obj,title=request.data.get('title'," "),position=get_latest_position(Column,board_obj))
       new_column = comment_qs.save()
       return Response(ColumnSerializer(comment_qs).data)


