from statistics import mode
from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from CannBann.AbstractModels import AbstractTimeStamp
from django.db.models.signals import post_save


class UserProfile(AbstractTimeStamp):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    email=models.EmailField(max_length=254)

    class Meta:
            db_table = "users" #the name of database table to use
            get_latest_by = '-created_at'
            verbose_name='user'
    

    def __str__(self) -> str:
        return f'{self.email}'



    # auto add user to userprofile
    # @receiver(post_save,sender=User)
    # def create_user_profile(sender,instance,created,**kwargs): 
    #     if created:
    #         UserProfile.objects.create(user=instance)

