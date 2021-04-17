import os
import uuid
from PIL import Image
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError
from django.conf import settings
from django.dispatch import receiver
'''
    NOTE
    Init empty variable to be,
    then injected by middlewares.RequestExposerMiddleware
'''
model_request = ''


# Custom validator for minimum size of images
def validate_image_size():

    def validator(image):
        print(type(image))
        img = Image.open(image)
        fw, fh = img.size
        if image.file.size > 2 * 1024 * 1024:
            raise ValidationError(
                'Image size is larger than what is allowed (2048 KBs)')
        if fw < 256 or fh < 256:
            raise ValidationError(
                'Height or Width is smaller than what is allowed (512x512)')
        if fw > 1920 or fh > 1920:
            raise ValidationError(
                'Height or Width is larger than what is allowed (1920x1920)')
    return validator


# Create directory for each user to upload files
def user_directory_path(instance, filename):
    _, file_ext = os.path.splitext(filename)
    return f'user_{instance.id}/avatar/md{file_ext}'


class User(AbstractUser):
    avatar = models.ImageField(
        upload_to=user_directory_path, default='avatar.jpg', validators=[validate_image_size])
    following = models.ManyToManyField('self',
                                       through='Contact',
                                       related_name='followers',
                                       symmetrical=False)

    def __str__(self):
        return self.username

    def get_avatar(self):
        if self.avatar.name:
            _, file_ext = os.path.splitext(self.avatar.name)
            return f'user_{self.id}/avatar/full{file_ext}'
        return False


class Post(models.Model):
    text = models.CharField(max_length=300)
    user = models.ForeignKey(
        User, related_name='posts', on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created',)

    def __str__(self):
        words = self.text.split(' ')
        if len(words) > 10:
            return ' '.join(words[0:10]) + ' ...'
        else:
            return ' '.join(words[0:10])

    # Access request object, given by custom middleware then check if the post is liked by authenticated user
    def is_liked_by_auth_user(self):
        if model_request.user.is_authenticated:
            if Like.objects.filter(post=self, user=model_request.user).first():
                return True

        return False


class Contact(models.Model):
    user_from = models.ForeignKey(User,
                                  related_name='rel_from',
                                  on_delete=models.CASCADE)
    user_to = models.ForeignKey(User,
                                related_name='rel_to',
                                on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True,
                                   db_index=True)

    class Meta:
        ordering = ('-created',)

    def __str__(self):
        return f'{self.user_from} follows {self.user_to}'


class Like(models.Model):
    user = models.ForeignKey(User,
                             related_name='liked',
                             on_delete=models.CASCADE)
    post = models.ForeignKey(Post,
                             related_name='likes',
                             on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True,
                                   db_index=True)

    def __str__(self):
        return f'{self.user.username} likes {self.post}'


class Comment(models.Model):
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE)
    post = models.ForeignKey(Post,
                             related_name='comments',
                             on_delete=models.CASCADE)
    text = models.CharField(max_length=300)
    parent = models.ForeignKey(
        "self", related_name='reply_to', blank=True, null=True, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True,
                                   db_index=True)
