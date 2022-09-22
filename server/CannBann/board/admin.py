from django.contrib import admin

# Register your models here.

from board.models import Board
from column.models import Column
from story.models import Story

admin.site.register(Board)
admin.site.register(Column)
admin.site.register(Story)