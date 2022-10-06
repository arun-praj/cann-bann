from django.db import models
from django.contrib.auth.models import User

from CannBann.AbstractModels import AbstractTimeStamp

class Board(AbstractTimeStamp):
    board_name = models.CharField(max_length=256)
    board_admins = models.ManyToManyField(User, related_name='board_admins',blank=True)
    board_members = models.ManyToManyField(User,related_name='board_members',blank=True)
    background_color = models.CharField(max_length=62)
    author = models.ForeignKey(User,on_delete=models.CASCADE)

    class Meta:
        db_table = "boards" #the name of database table to use
        get_latest_by = '-created_at'
        verbose_name='board'
      

    def __str__(self) -> str:
        return f'{self.id,self.board_name}'


