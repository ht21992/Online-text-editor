# document/views.py
from django.db import models


class Document(models.Model):
    owner = models.ForeignKey(
        "user.CustomUser", on_delete=models.CASCADE, related_name="docs"
    )
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Version(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Version {self.id} of {self.document.title}"
