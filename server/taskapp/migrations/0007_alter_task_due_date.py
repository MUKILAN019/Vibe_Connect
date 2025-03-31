from django.db import migrations
from datetime import datetime, date

def convert_due_date(apps, schema_editor):
    Task = apps.get_model('taskapp', 'Task')
    
    for task in Task.objects.all():
        if task.due_date:
            if isinstance(task.due_date, datetime):  # Convert datetime to date
                task.due_date = task.due_date.date()
            elif isinstance(task.due_date, str):  # Convert string to date
                try:
                    task.due_date = datetime.strptime(task.due_date, "%Y-%m-%d").date()
                except ValueError:
                    print(f"Skipping invalid date format for Task ID {task.id}")
                    continue
            task.save()

class Migration(migrations.Migration):

    dependencies = [
        ('taskapp', '0006_alter_task_due_date'),
    ]

    operations = [
        migrations.RunPython(convert_due_date),
    ]
