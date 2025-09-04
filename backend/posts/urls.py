from django.urls import path
from .views import PostView, UpvoteView

urlpatterns = [
    path("posts/", PostView.as_view()),                # GET all posts, POST new post
    path("upvote/<int:post_id>/", UpvoteView.as_view()) # POST upvote
]