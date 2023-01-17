# Generated by Django 4.1.1 on 2022-09-30 12:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('board', '0002_rename_backgroundcolor_board_background_color'),
    ]

    operations = [
        migrations.CreateModel(
            name='Column',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
                ('title', models.CharField(max_length=256)),
                ('position', models.IntegerField(default=0)),
                ('board', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='board', to='board.board')),
            ],
            options={
                'verbose_name': 'column',
                'db_table': 'columns',
                'ordering': ['position'],
                'get_latest_by': '-created_at',
            },
        ),
    ]
