from django.db import models

# Create your models here.

class Post(models.Model):
    message = models.TextField()
    category = models.CharField(max_length=50)
    upvotes = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category}: {self.message[:30]}"