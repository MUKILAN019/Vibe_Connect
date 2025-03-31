from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Task
from datetime import date

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)  

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class TaskSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField()
    assignee = serializers.SerializerMethodField()
    due_date = serializers.DateField(format='%Y-%m-%d', required=False, allow_null=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'status', 'due_date', 'created_at', 'created_by', 'assignee']
        read_only_fields = ['id', 'created_at', 'created_by']

    def get_created_by(self, obj):
        return {
            "id": obj.created_by.id,
            "username": obj.created_by.username,
            "email": obj.created_by.email  # Including email for authentication
        }

    def get_assignee(self, obj):
        if obj.assignee:
            return {
                "id": obj.assignee.id,
                "username": obj.assignee.username,
                "email": obj.assignee.email  # Including email for authentication
            }
        return None  # If there's no assignee, return None
