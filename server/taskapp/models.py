from django.db import models
from django.contrib.auth import get_user_model
from datetime import datetime

User = get_user_model()

class Task(models.Model):
    STATUS_CHOICES = [
        ('TODO', 'To Do'),
        ('IN_PROGRESS', 'In Progress'),
        ('DONE', 'Done')
    ]

    title = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='TODO')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tasks')
    assignee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_tasks', null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)  
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if isinstance(self.due_date, datetime): 
            self.due_date = self.due_date.date()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - {self.created_by.username}"
