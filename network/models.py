from django.contrib.auth.models import AbstractUser
from django.db import models

import datetime

class User(AbstractUser):

    pass

class Post(models.Model):
    text = models.CharField(max_length=200)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)
    
    def serialize(self):
        return {
            "id": self.id,
            "text": self.text,
            "author": self.author,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likes": self.likes
        }

class Follower(models.Model):
     followee = models.ForeignKey(User, on_delete=models.CASCADE)
     followers = models.ManyToManyField(User, blank=True, related_name="friends", null=True)
    
     def serialize(self):
         return {
            "followee": self.followee,
            "followers": [user.f for user in self.followers.all()]
        }

         

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    likes = models.ManyToManyField(Post, blank=True, related_name ="thumbs", null=True)

    def serialize(self):
        return {
            "user": self.user,
            "likes": [post.l for post in self.likes.all()]
        }



         
