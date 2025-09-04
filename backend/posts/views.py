from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json
from .models import Post

# Create your views here.


class PostView(View):
    def get(self, request):
        posts = list(Post.objects.values())
        return JsonResponse(posts, safe=False)

    def post(self, request):
        data = json.loads(request.body)
        post = Post.objects.create(
            message=data.get("message", ""),
            category=data.get("category", "General")
        )
        return JsonResponse({"id": post.id, "message": post.message, "category": post.category, "upvotes": post.upvotes})

# Handle upvotes
@method_decorator(csrf_exempt, name='dispatch')
class UpvoteView(View):
    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
            post.upvotes += 1
            post.save()
            return JsonResponse({"id": post.id, "upvotes": post.upvotes})
        except Post.DoesNotExist:
            return JsonResponse({"error": "Post not found"}, status=404)