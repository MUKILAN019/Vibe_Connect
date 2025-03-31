from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes  
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .serializers import UserSerializer, TaskSerializer
from .models import Task
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime

@api_view(['POST'])
@permission_classes([permissions.AllowAny]) 
def register_user(request):
   
    username = request.data.get("username")
    email = request.data.get("email")

    if User.objects.filter(username=username).exists():
        return Response({"message": "User already exists with this username"}, status=400)
    if User.objects.filter(email=email).exists():
        return Response({"message": "User already exists with this email"}, status=400)

    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created successfully"}, status=201)

    return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_user(request):
   
    data = request.data
    email = data.get('email', '').strip()
    password = data.get('password', '').strip()

    if not email or not password:
        return Response({"message": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.check_password(password):  
        return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

   
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    response = Response({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
        },
        "tokens": {
            "refresh": str(refresh),
            "access": access_token
        }
    }, status=status.HTTP_200_OK)

    
    response.set_cookie("refresh_token", str(refresh), httponly=False, secure=True, samesite="Lax")
    response.set_cookie("access_token", access_token, httponly=False, secure=True, samesite="Lax")

    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def user_tasks(request):
   
    filter_option = request.query_params.get('filter', None)
    if filter_option == "created_by_me":
        tasks = Task.objects.filter(created_by=request.user)
    elif filter_option == "assigned_to_me":
        tasks = Task.objects.filter(assignee=request.user)
    else:
        tasks = Task.objects.all()

    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated]) 
def update_task_status(request, task_id):
    
    task = get_object_or_404(Task, id=task_id, assignee=request.user)

    new_status = request.data.get("status")
    if new_status not in ["TODO", "IN_PROGRESS", "DONE"]:
        return Response({"error": "Invalid status value."}, status=400)

    task.status = new_status
    task.save()
    return Response({"message": "Task status updated!", "task": TaskSerializer(task).data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_task(request):
    
    data = request.data
    assignee_id = data.get("assignee_id")
    print(data)
    if not data.get("title"):
        return Response({"error": "Title is required."}, status=400)
    
    if not assignee_id:
        return Response({"error": "Assignee ID is required."}, status=400)

    try:
        assignee = User.objects.get(id=assignee_id)
    except ObjectDoesNotExist:
        return Response({"error": "Assignee not found."}, status=404)

   
    due_date = data.get("due_date")
    if due_date:
        try:
            due_date = datetime.strptime(due_date, "%Y-%m-%d") 
        except ValueError:
            return Response({"error": "Invalid due date format. Use 'YYYY-MM-DD'."}, status=400)

    task = Task.objects.create(
        title=data["title"],
        created_by=request.user,
        assignee=assignee,
        status="TODO",
        due_date=due_date if due_date else None
    )

    return Response({"message": "Task created successfully!", "task": TaskSerializer(task).data}, status=201)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def kanban_tasks(request):
    
    tasks = Task.objects.filter(assignee_id=request.user.id)

 
    todo_tasks = tasks.filter(status="TODO")
    in_progress_tasks = tasks.filter(status="IN_PROGRESS")
    done_tasks = tasks.filter(status="DONE")



    kanban_data = {
        "TODO": TaskSerializer(todo_tasks, many=True).data,
        "IN_PROGRESS": TaskSerializer(in_progress_tasks, many=True).data,
        "DONE": TaskSerializer(done_tasks, many=True).data,
    }

    return Response(kanban_data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_task(request, task_id):
    try:
        task = Task.objects.get(id=task_id, assignee=request.user)
        task.delete()
        return Response({"message": "Task deleted successfully"}, status=status.HTTP_200_OK)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated] 

    def get_queryset(self):
        
        return Task.objects.filter(Q(created_by=self.request.user) | Q(assignee=self.request.user))

    def perform_create(self, serializer):
        
        serializer.save(created_by=self.request.user)
