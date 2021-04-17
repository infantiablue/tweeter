
from django.urls import path
from . import views, api

urlpatterns = [
    path('', views.IndexListView.as_view(), name='index'),
    path('following', views.FollowingListView.as_view(), name='following'),
    path("profile/<int:userId>", views.ProfileListView.as_view(), name="profile"),
    path("account", views.account, name="account"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("new_post", views.new_post, name="new_post"),
    # Ajax API
    path("like", api.like, name="like"),
    path("follow", api.follow, name="follow"),
    path("edit", api.edit, name="edit"),
    path("delete", api.delete, name="delete"),
    path("comments/<int:postId>", api.comments, name="comments"),
    path("comments", api.comments, name="comments")
]
