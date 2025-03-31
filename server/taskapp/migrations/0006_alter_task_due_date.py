from django.db import migrations
from datetime import date, datetime

def convert_due_date(apps, schema_editor):
    Task = apps.get_model('taskapp', 'Task')
    for task in Task.objects.all():
        if isinstance(task.due_date, datetime):  # Check if it's a datetime object
            task.due_date = task.due_date.date()  # Convert to a date object
            task.save()
        elif isinstance(task.due_date, str):  # If due_date is a string, parse it safely
            try:
                task.due_date = datetime.strptime(task.due_date, "%Y-%m-%d").date()
                task.save()
            except ValueError:
                print(f"Skipping invalid date format for task {task.id}")

class Migration(migrations.Migration):

    dependencies = [
        ('taskapp', '0005_alter_task_due_date'),  # Ensure this matches your previous migration
    ]

    operations = [
        migrations.RunPython(convert_due_date),
    ]
