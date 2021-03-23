
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("<int:user_id>", views.profile_view, name="profile"),
    path("following", views.following_view, name="following"),
    #API routes
    path("post", views.post, name="post"),
    path("new_post", views.new_post, name="new_post"),
    path("follow/<int:profile_id>", views.follow, name="follow"),
    path("edit/<int:post_id>", views.edit, name="edit"),
    path("like/<int:post_id>", views.like, name="like"),
    path("load/<int:post_id>", views.load, name="load")
    

]
