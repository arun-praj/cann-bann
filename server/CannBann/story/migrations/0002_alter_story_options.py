# Generated by Django 4.1.1 on 2022-09-22 13:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('story', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='story',
            options={'get_latest_by': '-created_at', 'verbose_name': 'story'},
        ),
    ]