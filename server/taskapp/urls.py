from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    register_user, login_user, user_tasks, update_task_status,
    create_task, kanban_tasks,delete_task, TaskViewSet
)

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('tasks/', user_tasks, name='user_tasks'),
    path('task/update/<int:task_id>/', update_task_status, name='update_task_status'),
    path('task/create/', create_task, name='create_task'),
    path('kanban/', kanban_tasks, name='kanban_tasks'),
    path('kanban/delete/<int:task_id>/',delete_task, name='kanban_task_delete'),
    path('', include(router.urls)),  
]
