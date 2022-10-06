
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response

from CannBann.customPermissions import IsAuthorOrReadOnly
from .models import Board
from .serializer import BoardSerializer,BoardWith_Column_Story_Serializer


class BoardViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,IsAuthorOrReadOnly]
    serializer_class = BoardSerializer
    queryset = Board.objects.filter(is_active=True)


    def retrieve(self, request,pk=None):
        # get board with all columns and its stories
        board = get_object_or_404(Board,pk=pk)
        return Response(BoardWith_Column_Story_Serializer(board).data)


    def list (self, request, *args, **kwargs):
        # return user's board
        author_board =  Board.objects.filter(is_active=True,author=request.user)
        membership_board = Board.objects.filter(board_members__in=[request.user])
        
        return Response({
            'author_board':BoardSerializer(author_board,many=True).data,
            "member_board":BoardSerializer(membership_board,many=True).data
        })
        
    def create(self, request, *args, **kwargs):
        board = Board(
                board_name = request.data.get('board_name'),
                background_color=request.data.get('background_color'),
                author=request.user
        )
        board.save()
        
        return Response(BoardSerializer(board).data)
        

