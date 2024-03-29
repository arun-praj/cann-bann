# Generated by Django 4.1.1 on 2023-06-02 06:57

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Board',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
                ('board_name', models.CharField(max_length=256)),
                ('background_color', models.CharField(max_length=62)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('board_admins', models.ManyToManyField(blank=True, related_name='board_admins', to=settings.AUTH_USER_MODEL)),
                ('board_members', models.ManyToManyField(blank=True, related_name='board_members', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'board',
                'db_table': 'boards',
                'get_latest_by': '-created_at',
            },
        ),
    ]
