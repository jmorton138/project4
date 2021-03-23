import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.db.models import F

from .models import User, Post, Follower, Like

def pagination():
    posts = Post.objects.all()
    p = Paginator(posts, 10)


def index(request):
    #return render(request, "network/index2.html")
    posts = Post.objects.all().order_by('-timestamp')
    p = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = p.get_page(page_number)
    # like status of post
    if request.user.is_authenticated:
        user=request.user
        likes = Like.objects.filter(user=user)
        likelist=[]
        for post in posts:
            if Like.objects.filter(user=user, likes=post):
                likelist.append(post)
 
    # posts = posts.order_by("timestamp").all()
        return render(request, "network/index.html", {
            "posts": posts, "page_obj": page_obj, "likes": likes, "likelist": likelist
        })
    else:
        return render(request, "network/index.html", {
            "posts": posts, "page_obj": page_obj
        })

def load(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)
    if request.method == "GET":
        return JsonResponse(post.serialize())



def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
@csrf_exempt
def new_post(request):
    if request.method=="POST":
        text = request.POST["new_post"]
        author = request.user
        p = Post(text=text, author=author)
        p.save()
        return HttpResponseRedirect(reverse("index")) 
        
@csrf_exempt
def post(request):    
    if request.method=="POST":
        #get data from post
        data = json.loads(request.body)
        text = data.get("text", "")
        author=request.user
        #store new post in db
        p = Post(text=text, author=author)
        p.save()
    return HttpResponseRedirect(reverse("index"))
    return JsonResponse({"message": "Message posted successfully."}, status=201)


def profile_view(request, user_id):
    #get following status for current user
    current_user = request.user
    profile = user_id
    #get data for that user
    followee = User.objects.get(id=user_id)
    #get followers for this user
    followers = Follower.objects.filter(followee=followee)
   
    if Follower.objects.filter(followee=followee, followers = current_user):
        follow_button = "unfollow"
    else:
        follow_button = "follow"
    follower_count = 0
    following_count = 0
    for follower in followers:
        follower_count += 1
    following = Follower.objects.filter(followers = followee)
    for follow in following:
        following_count += 1
    #get posts for that user
    posts = Post.objects.filter(author_id = user_id).order_by('-timestamp')
    #posts = Post.objects.all().order_by('-timestamp')
    p = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = p.get_page(page_number)
    #return profile page
    if request.user.is_authenticated:
        user=request.user
        likes = Like.objects.filter(user=user)
        likelist=[]
        for post in posts:
            if Like.objects.filter(user=user, likes=post):
                likelist.append(post)
 
    return render(request, "network/profile.html", {
       "posts": posts, "page_obj": page_obj, "follower_count": follower_count, "following_count": following_count, "profile": profile, "follow_button": follow_button, "followee": followee, "likes": likes, "likelist": likelist
    })

@login_required
def following_view(request):
    #get listing of followed users (followees)
    follower = request.user
    followees = Follower.objects.filter(followers = follower)
    #if following user, show users post
    #posts= Post.objects.all().order_by('-timestamp')
    #get list of posts from followees
    posts=[]
    all_posts = Post.objects.all().order_by('-timestamp')
    for post in all_posts:
        for followee in followees:
            if post.author == followee.followee:
                posts.append(post)
    p = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = p.get_page(page_number)
    # like status of post
    if request.user.is_authenticated:
        user=request.user
        likes = Like.objects.filter(user=user)
        likelist=[]
        for post in posts:
            if Like.objects.filter(user=user, likes=post):
                likelist.append(post)
    # posts = posts.order_by("timestamp").all()
    return render(request, "network/following.html", {
        "posts": posts, "page_obj": page_obj, "likes": likes, "likelist": likelist,"followees": followees
    })
    # return render(request, "network/following.html", {
    #    "posts": posts, "followees": followees
    # })
    

@csrf_exempt
def follow(request, profile_id):
    if request.method=="POST":
        data = json.loads(request.body)


        #get data of current user
        user = request.user
        #get data of user to follow
        followee = User.objects.get(id=profile_id)
        
        followers = []
        followers.append(user)
        
        #update data in Follower model
        if not Follower.objects.filter(followee=followee, followers=user):
            f = Follower(followee=followee)
            f.save()
            for follower in followers:
                f.followers.add(user)
            f.save()
        elif Follower.objects.filter(followee=followee, followers=user):
            Follower.objects.filter(followee=followee, followers=user).delete()
        #return HttpResponseRedirect(reverse("profile", args= (profile_id,)))
        
        return JsonResponse({"message": "Email sent successfully."}, status=201)

@csrf_exempt
def edit(request, post_id):
    post = Post.objects.get(id=post_id)
    data = json.loads(request.body)
    new_text = data.get("text", "")
    post.text=new_text
    post.save()
    return JsonResponse({"message": "Edit successful."}, status=201)

@csrf_exempt
def like(request, post_id):
    if request.method =="POST":
        data = json.loads(request.body)
        # get current user
        user=request.user
        #get post
        post = Post.objects.get(id=post_id)
        likes = []
        likes.append(post)
        #get like status
        if not Like.objects.filter(user=user, likes=post):
            #update number of likes in Post class (add)
            post.likes = post.likes + 1
            post.save()
            #add to Like class
            l = Like(user=user)
            l.save()
            for like in likes:
                l.likes.add(post)
            l.save()
        elif Like.objects.filter(user=user, likes=post):
            #update number of likes in Post class (minus)
            post.likes = post.likes - 1
            post.save()
            #delete from Like class
            Like.objects.filter(user=user, likes=post).delete()
        return JsonResponse({"message": "like updated"}, status=201)
            