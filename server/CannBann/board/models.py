from django.db import models
from django.contrib.auth.models import User

from CannBann.AbstractModels import AbstractTimeStamp

class Board(AbstractTimeStamp):
    board_name = models.CharField(max_length=256)
    board_admins = models.ManyToManyField(User, related_name='board_admins')
    board_members = models.ManyToManyField(User,related_name='board_members')

    class Meta:
        db_table = "boards" #the name of database table to use
        get_latest_by = '-created_at'
        verbose_name='board'
      

    def __str__(self) -> str:
        return f'{self.board_name}'


