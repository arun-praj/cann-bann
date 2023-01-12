
from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from CannBann.AbstractModels import AbstractTimeStamp
from column.models import Column

# def incrementStoryPositionbyOne():
#     '''
#         When new Story  is added position should be at last
#     '''
#     if len(Story.objects.all()) >0:
#         return int(Story.objects.latest('position').position) + 1
#     else:
#         return 0

class Label(AbstractTimeStamp):
    title=models.TextField(max_length=32)
    color=models.CharField(max_length=20)
    class Meta:
        db_table = "labels" #the name of database table to use
        get_latest_by = ''
        verbose_name='label'
    def __str__(self) -> str:
        return f'{self.title ,self.color }'
       

class Story(AbstractTimeStamp):
    class Position(models.TextChoices):
        HIGHEST = 'HIGHEST', _('HIGHEST')
        CRITICAL = 'CRITICAL', _('CRITICAL')
        ALARMING = 'ALARMING', _('ALARMING')
        LOW = 'LOW', _('LOW')
     

    description = models.TextField(blank=True)
    title = models.TextField()
    labels = models.OneToOneField(Label,on_delete=models.CASCADE,related_name='labels',blank=True,null=True)
    author = models.ForeignKey(User,on_delete=models.CASCADE,related_name='author')
    position = models.IntegerField(default=0)
    column = models.ForeignKey(Column,on_delete=models.CASCADE,related_name='column')
    assignee = models.ManyToManyField(User,related_name='assignee',blank=True)
    priority = models.CharField(
        max_length=10,
        choices=Position.choices,
        default=Position.LOW,
    )

    class Meta:
        db_table = "stories" #the name of database table to use
        get_latest_by = '-created_at'
        verbose_name='story'
        ordering=['position']

    def __str__(self) -> str:
        return f'{self.id,self.position ,self.author , self.description}'

    # helper method that returns the Enum object
    def get_priority(self):
        return self.Position[self.priority]


