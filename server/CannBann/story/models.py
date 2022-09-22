
from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from CannBann.AbstractModels import AbstractTimeStamp
from column.models import Column

def incrementStoryPositionbyOne():
    '''
        When new Story  is added position should be at last
    '''
    if len(Story.objects.all()) >0:
        return int(Story.objects.latest('position').position) + 1
    else:
        return 0

class Story(AbstractTimeStamp):
    class Position(models.TextChoices):
        HIGHEST = 'FR', _('HIGHEST')
        CRITICAL = 'SO', _('CRITICAL')
        ALARMING = 'JR', _('ALARMING')
        LOW = 'SR', _('LOW')
     

    description = models.TextField()
    author = models.ForeignKey(User,on_delete=models.CASCADE,related_name='author')
    position = models.IntegerField(default=incrementStoryPositionbyOne)
    column = models.ForeignKey(Column,on_delete=models.CASCADE)
    assignee = models.ManyToManyField(User,related_name='assignee')
    priority = models.CharField(
        max_length=2,
        choices=Position.choices,
        default=Position.LOW,
    )

    class Meta:
        db_table = "stories" #the name of database table to use
        get_latest_by = '-created_at'
        verbose_name='story'
   

    def __str__(self) -> str:
        return f'{self.author}'

    # helper method that returns the Enum object
    def get_priority(self):
        return self.Position[self.priority]

