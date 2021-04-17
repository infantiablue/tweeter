from django.contrib import admin
from .models import User, Post, Like, Contact


class PostAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'user', 'created')


# Register your models here.
admin.site.register(User)
admin.site.register(Like)
admin.site.register(Post, PostAdmin)
admin.site.register(Contact)
