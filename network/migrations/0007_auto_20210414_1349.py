# Generated by Django 3.1.7 on 2021-04-14 13:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0006_auto_20210414_1342'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.FileField(default='avatar.jpg', upload_to='uploads/'),
        ),
    ]
