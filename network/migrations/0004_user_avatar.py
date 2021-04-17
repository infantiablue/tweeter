# Generated by Django 3.1.7 on 2021-04-14 13:15

from django.db import migrations, models
import network.models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0003_auto_20210412_1057'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='avatar',
            field=models.ImageField(default='/media/avatar.jpg', upload_to=network.models.user_directory_path),
        ),
    ]
