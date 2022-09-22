from django.db import models
from board.models import Board
from CannBann.AbstractModels import AbstractTimeStamp



def incrementColumnIDbyOne():
    '''
        When new column is added position should be at last
    '''
    if len(Column.objects.all()) >0:
        return int(Column.objects.latest('position').position) + 1
    else:
        return 0

class Column(AbstractTimeStamp):
    title = models.CharField(max_length=256)
    position = models.IntegerField(default=incrementColumnIDbyOne)
    board=models.ForeignKey(Board,on_delete=models.CASCADE)
  

    class Meta:
        db_table = "columns" #the name of database table to use
        get_latest_by = '-created_at'
        verbose_name='column'
      

    def __str__(self) -> str:
        return f'{self.title}'


