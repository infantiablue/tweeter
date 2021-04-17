
import json
from django.http import JsonResponse
from .models import User, Post, Like, Contact, Comment
from .utils import login_required_ajax
from django.core.exceptions import ValidationError
from django.core.serializers import serialize


@ login_required_ajax
def delete(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        post = Post.objects.get(pk=data['post_id'])
        if post.user == request.user:
            post.delete()
            return JsonResponse({'message': "Your post is removed updated."})
        else:
            return JsonResponse({'error': "You are not authorized."})


@ login_required_ajax
def like(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        cur_post = Post.objects.get(pk=data['post_id'])
        check = Like.objects.filter(
            user=request.user, post=cur_post).first()
        if check:
            check.delete()
            msg = 'You just un-like this post.'
            liked = False
        else:
            if request.user.posts.filter(id=cur_post.id).first():
                return JsonResponse({'error': 'You cant like your own post.'})

            new_like = Like(
                user=request.user, post=cur_post)
            new_like.save()
            msg = 'Awesome !'
            liked = True
        return JsonResponse({'message': msg, 'liked': liked})


@ login_required_ajax
def follow(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        target_user = User.objects.get(pk=data['target_id'])
        if target_user.id == request.user.id:
            return JsonResponse({'error': 'You cant follow yourself.'})

        check = Contact.objects.filter(
            user_from=request.user, user_to=target_user).first()

        if check:
            check.delete()
            msg = f'You just un-follow {target_user.username}'
            followed = False
        else:
            new_following = Contact(
                user_from=request.user, user_to=target_user)
            new_following.save()
            msg = f'You just follow {target_user.username}'
            followed = True

        return JsonResponse({'message': msg, 'followed': followed})


@ login_required_ajax
def edit(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        post = Post.objects.get(pk=data['post_id'])
        if post.user == request.user:
            post.text = data['text']
            try:
                post.full_clean()
            except ValidationError as e:
                messages = []
                for m in e.messages:
                    messages.append(m)
                return JsonResponse({'error': '<br\>'.join(messages)})
            post.save()
            return JsonResponse({'message': "Your post is successfully updated."})
        else:
            return JsonResponse({'error': "You are not authorized."})


@ login_required_ajax
def comments(request):
    if request.method == 'PUT':
        print("Hello")
        data = json.loads(request.body)
        post = Post.objects.get(pk=data['post_id'])
        new_comment = Comment(user=request.user, post=post)
        new_comment.text = data['text']
        try:
            new_comment.full_clean()
        except ValidationError as e:
            messages = []
            for m in e.messages:
                messages.append(m)
            return JsonResponse({'error': '<br\>'.join(messages)})
        new_comment.save()
        return JsonResponse({'message': "Your comment is successfully posted."})

    if request.method == 'POST':
        data = json.loads(request.body)
        post = Post.objects.get(pk=data['post_id'])
        qs = post.comments.all()
        return JsonResponse({'comments': serialize("json", qs), 'count': qs.count()})
