import os
import json
import shutil
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import IntegrityError
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect, HttpResponseNotFound
from django.shortcuts import render
from django.views.generic.list import ListView
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.conf import settings
from .models import User, Post, Like, Contact
from .forms import PostForm, UserForm

if settings.POSTS_PER_PAGE:
    POSTS_PER_PAGE = settings.POSTS_PER_PAGE
else:
    POSTS_PER_PAGE = 5


def login_required_ajax(view_func):
    from functools import wraps

    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'You need to log in to process'})
        return view_func(request, *args, **kwargs)
    return _wrapped_view


class IndexListView(ListView):
    model = Post
    paginate_by = POSTS_PER_PAGE  # if pagination is desired
    context_object_name = 'posts'
    template_name = "network/index.html"

    def get_context_data(self, **kwargs):
        form = PostForm()
        context = super().get_context_data(**kwargs)
        context['form'] = form
        return context


@login_required(login_url='login')
def account(request):
    if request.method == 'POST':
        form = UserForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            instance = form.save(commit=False)
            if request.FILES['avatar']:
                # Handle uploading avatar
                from .utils import crop_smart
                _, ext = os.path.splitext(instance.avatar.name)
                thumb_path = f'{settings.MEDIA_ROOT}/user_{request.user.id}/avatar/md{ext}'
                old_path = f'{settings.MEDIA_ROOT}/user_{request.user.id}/avatar'
                # Remove old avatar files
                if os.path.exists(old_path):
                    shutil.rmtree(old_path)
                # Save to DB and upload file
                instance.save()
                # Keep the original one
                shutil.copy(thumb_path,
                            f'{settings.MEDIA_ROOT}/user_{request.user.id}/avatar/full{ext}')
                # Crop and repalce the old file with new size
                crop_smart(
                    thumb_path, thumb_path, 128, 128)
            else:
                instance.save()
            messages.success(
                request, 'Your account is updated succesfully.')
            return HttpResponseRedirect(reverse('account'))

    else:
        form = UserForm(instance=request.user)
    context = {'form': form}
    return render(request, 'network/account.html', context)


@ method_decorator(login_required(login_url='login'), name='dispatch')
class FollowingListView(ListView):
    model = Post
    paginate_by = POSTS_PER_PAGE  # if pagination is desired
    context_object_name = 'posts'
    template_name = "network/following.html"

    def get_queryset(self):
        followings = self.request.user.following.all()
        return Post.objects.filter(user__in=followings).all()


class ProfileListView(ListView):

    model = Post
    paginate_by = POSTS_PER_PAGE  # if pagination is desired
    context_object_name = 'posts'
    template_name = "network/profile.html"

    def dispatch(self, request, *args, **kwargs) -> HttpResponse:
        # Fetch authenticated user object
        self.auth_user = User.objects.get(pk=self.kwargs['userId'])
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.auth_user
        posts = user.posts.all()
        followed_by_current_user = False
        if self.request.user.is_authenticated:
            if Contact.objects.filter(user_from=self.request.user, user_to=user).first():
                followed_by_current_user = True
        num_followers = user.rel_to.count()
        num_following = user.rel_from.count()
        data = {'profile': user, 'posts': posts,
                'num_following': num_following,
                'num_followers': num_followers,
                'followed_by_current_user': followed_by_current_user}
        context = {**context, **data}
        return context

    def get_queryset(self):
        user = self.auth_user
        return user.posts.all()


def new_post(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.user = request.user
            post.save()
            messages.success(
                request, 'The post has been created successfully.')
            return HttpResponseRedirect(reverse('index'))
        else:
            return HttpResponseNotFound('<h1>Page not found</h1>')


def login_view(request):
    if request.method == 'POST':

        # Attempt to sign user in
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse('index'))
        else:
            return render(request, 'network/login.html', {
                'message': 'Invalid username and/or password.'
            })
    else:
        return render(request, 'network/login.html')


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('index'))


def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']

        # Ensure password matches confirmation
        password = request.POST['password']
        confirmation = request.POST['confirmation']
        if password != confirmation:
            return render(request, 'network/register.html', {
                'message': 'Passwords must match.'
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, 'network/register.html', {
                'message': 'Username already taken.'
            })
        login(request, user)
        return HttpResponseRedirect(reverse('index'))
    else:
        return render(request, 'network/register.html')
