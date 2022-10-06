
from turtle import position
from venv import create
from django.shortcuts import get_list_or_404, render
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


from CannBann.customPermissions import IsAuthorOrReadOnly



from .models import Story
from column.models import Column
from .serializer import StorySerializer

def get_latest_story_position(column_id):
    try:
        latest_position = Story.objects.filter(column=column_id).latest('position').position
    except ObjectDoesNotExist:
        return 0
   
    return latest_position + 1

class StoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,IsAuthorOrReadOnly]
    serializer_class = StorySerializer
    queryset = Story.objects.filter(is_active=True)


    def create(self, request, *args, **kwargs):
        print('asdf')
        column_obj = get_object_or_404(Column,id=request.data.get('column_id',''))
        story_obj = Story.objects.create(title=request.data.get('title',''),position=get_latest_story_position(request.data.get('column_id')),author=request.user,column=column_obj)
        serializer = StorySerializer(story_obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    
   
    @action(detail=False,methods=['post'],permission_classes=(IsAuthenticated,IsAuthorOrReadOnly))
    def bulk_update_position(self,request,*args,**kwargs):
        kwargs['partial'] = True
       
        # update the position of dragged story
        story = get_object_or_404(Story,pk=request.data.get('draggedStory'))
        story.position = request.data.get('draggedDestination')
        story.save()
    
        # update the position of non dragged stories
        if(request.data.get('drag_column')=='SAME_COLUMN'):
            update_list = []
            model_qs = Story.objects.filter(id__in = request.data.get('story_list'))
            
            for model_obj in model_qs:
                if(request.data.get('direction') == 'DRAG_DOWN'):
                    model_obj.position  = model_obj.position - 1
                else:
                    model_obj.position = model_obj.position + 1
                update_list.append(model_obj)
            updated_stories_qs = Story.objects.bulk_update(update_list,['position'])
            return  Response({'no of row affected':updated_stories_qs})

        elif (request.data.get('drag_column')=='DIFF_COLUMN'):
            #update the column of dragged story
            column_qs = Column.objects.get(id=request.data.get('draggedDestinationColumn'))
            story.column = column_qs
            story.save()

            # update the column, position of other affected story
            update_list = []
            for story in request.data.get('story_list'):
                story_obj = Story.objects.get(id=story['id'])
                story_obj.position = story['position']
                update_list.append(story_obj)

            updated_stories_qs = Story.objects.bulk_update(update_list,['position','column'])
            return  Response({'no of row affected',updated_stories_qs})
